import { config } from "dotenv";
import type {
    ClassResource,
    CurrentSchoolyear,
    DateRange,
    Resource,
    SchoolData,
    SchoolYear,
    Timetable
} from "./types.ts";
import NodeFetchCache, { FileSystemCache } from "node-fetch-cache";
import { envUndefined } from "../server.ts";

config();
const apiBaseUrl: string =
    process.env.API_BASE_URL?.trim() || envUndefined("API_BASE_URL");
const headers: HeadersInit = { "anonymous-school": "ap" };

//#region Helpers
function newURL(path: string, params?: URLSearchParams): string {
    return `${apiBaseUrl}${path}` + (params ? `?${params}` : "");
}

function createFetchCache(
    time: {
        days?: number;
        hours?: number;
        minutes?: number;
    },
    cacheSubDir: string
) {
    const days: number = time.days ?? 0;
    const hours: number = time.hours ?? 0;
    const minutes: number = time.minutes ?? 0;

    return NodeFetchCache.create({
        shouldCacheResponse: (response) => response.ok,
        cache: new FileSystemCache({
            cacheDirectory: `./cache/${cacheSubDir}`,
            ttl: (days * 86400 + hours * 3600 + minutes * 60) * 1000
        })
    });
}

const longCache = createFetchCache({ days: 7 }, "long");
const shortCache = createFetchCache({ minutes: 15 }, "short");

async function fetchJson<T>(
    fetchFunc: typeof longCache | typeof shortCache,
    url: string
): Promise<T> {
    const response = await fetchFunc(url, {
        headers
    });

    if (!response.ok) {
        throw new Error(
            `WebUntis API request failed: ${response.status} ${response.statusText}`
        );
    }

    return (await response.json()) as T;
}
//#endregion

//#region API requests
export async function getClasses(
    dateRange: DateRange
): Promise<ClassResource[]> {
    const params = new URLSearchParams({
        resourceType: "CLASS",
        start: dateRange.start,
        end: dateRange.end
    });

    const data: Resource = await fetchJson(
        longCache,
        newURL("/timetable/filter", params)
    );

    return data.classes;
}

export async function getSchoolyears(): Promise<SchoolYear[]> {
    const data: SchoolYear[] = await fetchJson(
        longCache,
        newURL("/schoolyears")
    );

    return data;
}

export async function getCurrentSchoolyear(): Promise<CurrentSchoolyear> {
    const data: SchoolData = await fetchJson(longCache, newURL("/app/data"));

    return data.currentSchoolYear;
}

export async function getTimetable(
    classId: number,
    dateRange: DateRange
): Promise<Timetable> {
    const params = new URLSearchParams({
        resourceType: "CLASS",
        start: dateRange.start,
        end: dateRange.end,
        resources: classId.toString()
    });

    const data: Timetable = await fetchJson(
        shortCache,
        newURL("/timetable/entries", params)
    );

    return data;
}
//#endregion
