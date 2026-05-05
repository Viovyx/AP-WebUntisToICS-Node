import type {
    ClassResource,
    Resource,
    SchoolData,
    SchoolYear,
    Timetable
} from "./types.ts";
import NodeFetchCache, { FileSystemCache, MemoryCache } from "node-fetch-cache";
import { apiBaseUrl } from "../server.ts";

const headers: HeadersInit = { "anonymous-school": "ap" };

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

export async function getClasses(): Promise<ClassResource[]> {
    const params = new URLSearchParams({
        resourceType: "CLASS"
    });

    const fetchCache = createFetchCache({ days: 7 });
    const response = await fetchCache(newURL("/timetable/filter", params), {
        headers: headers
    });
    const data = (await response.json()) as Resource;

    return data.classes;
}

export async function getCurrentSchoolyear(): Promise<SchoolYear> {
    const fetchCache = createFetchCache({ days: 7 });
    const response = await fetchCache(newURL("/app/data"), {
        headers: headers
    });
    const data = (await response.json()) as SchoolData;

    return data.currentSchoolYear;
}

export async function getTimetable(
    classId: number
): Promise<Timetable | undefined> {
    const { start, end } = (await getCurrentSchoolyear()).dateRange;
    const params = new URLSearchParams({
        resourceType: "CLASS",
        start: start,
        end: end,
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
