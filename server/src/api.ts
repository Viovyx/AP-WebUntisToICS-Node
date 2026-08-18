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
import { apiBaseUrl } from "../server.ts";

const headers: HeadersInit = { "anonymous-school": "ap" };

//#region Helpers
function newURL(path: string, params?: URLSearchParams): string {
    return `${apiBaseUrl}${path}` + (params ? `?${params}` : "");
}

function createFetchCache(time: {
    days?: number;
    hours?: number;
    minutes?: number;
}) {
    const days: number = time.days ?? 0;
    const hours: number = time.hours ?? 0;
    const minutes: number = time.minutes ?? 0;

    return NodeFetchCache.create({
        shouldCacheResponse: (response) => response.ok,
        cache: new FileSystemCache({
            cacheDirectory: "./cache",
            ttl: days * 86400 + hours * 3600 + minutes * 60
        })
    });
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

    const fetchCache = createFetchCache({ days: 7 });
    const response = await fetchCache(newURL("/timetable/filter", params), {
        headers: headers
    });
    const data = (await response.json()) as Resource;

    return data.classes;
}

export async function getSchoolyears(): Promise<SchoolYear[]> {
    const fetchCache = createFetchCache({ days: 7 });
    const response = await fetchCache(newURL("/schoolyears"), {
        headers: headers
    });
    const data = (await response.json()) as SchoolYear[];

    return data;
}

export async function getCurrentSchoolyear(): Promise<CurrentSchoolyear> {
    const fetchCache = createFetchCache({ days: 7 });
    const response = await fetchCache(newURL("/app/data"), {
        headers: headers
    });
    const data = (await response.json()) as SchoolData;

    return data.currentSchoolYear;
}

export async function getTimetable(
    classId: number,
    dateRange: DateRange
): Promise<Timetable | undefined> {
    const params = new URLSearchParams({
        resourceType: "CLASS",
        start: dateRange.start,
        end: dateRange.end,
        resources: classId.toString()
    });

    const fetchCache = createFetchCache({ minutes: 15 });
    const response = await fetchCache(newURL("/timetable/entries", params), {
        headers: headers
    });

    if (response.ok) {
        const data = (await response.json()) as Timetable;
        return data;
    } else return;
}
//#endregion
