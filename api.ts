import { loadEnvFile } from "node:process";
import type { ClassResource, Resource, SchoolData, SchoolYear, Timetable } from "./types.ts";

loadEnvFile();
const baseUrl: string = process.env.APIBASEURL;
const headers: HeadersInit = { "anonymous-school": "ap" };

function newURL(path: string, params?: URLSearchParams): string {
    return `${baseUrl}${path}` + (params ? `?${params}` : "");
}

export async function getClasses(): Promise<ClassResource[]> {
    const params = new URLSearchParams({
        resourceType: "CLASS",
    });

    const response = await fetch(newURL("/timetable/filter", params), { headers: headers });
    const data: Resource = await response.json();

    return data.classes;
}

export async function getCurrentSchoolyear(): Promise<SchoolYear> {
    const response = await fetch(newURL("/app/data"), { headers: headers });
    const data: SchoolData = await response.json();

    return data.currentSchoolYear;
}

export async function getTimetable(classId: number): Promise<Timetable> {
    const { start, end } = (await getCurrentSchoolyear()).dateRange;
    const params = new URLSearchParams({
        resourceType: "CLASS",
        start: start,
        end: end,
        resources: classId.toString(),
    });

    const response = await fetch(newURL("/timetable/entries", params), { headers: headers });
    const data: Timetable = await response.json();

    return data;
}
