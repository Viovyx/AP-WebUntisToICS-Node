import type { Class, DateRange, Day, Lesson, ResourceData, SchoolInfo, TimeTable } from "./types";

const baseUrl: string = "https://ap.webuntis.com/WebUntis/api/rest/view/v1";
const headers: HeadersInit = { "anonymous-school": "ap" };

export async function getApiProxy(localPath: string) {
    const response = await fetch(localPath, { method: "POST" });
    const data = response.json();
    return data;
}

function newURL(path: string, params?: URLSearchParams): string {
    return `${baseUrl}${path}` + (params ? `?${params}` : "");
}

export async function getClasses(): Promise<Class[]> {
    const params: URLSearchParams = new URLSearchParams({
        resourceType: "CLASS",
    });

    const response = await fetch(newURL("/timetable/filter", params), { headers: headers });
    const data: ResourceData = await response.json();

    return data.classes.map((classObj) => {
        return { id: classObj.class.id, name: classObj.class.displayName };
    });
}

async function getCurrentSchoolyear(): Promise<DateRange> {
    const response = await fetch(newURL("/app/data"), { headers: headers });
    const data: SchoolInfo = await response.json();

    return data.currentSchoolYear.dateRange;
}

async function getTimeTable(classId: string): Promise<Day[]> {
    const { start, end } = await getCurrentSchoolyear();
    const params: URLSearchParams = new URLSearchParams({
        resourceType: "CLASS",
        start: start,
        end: end,
        resources: classId,
    });

    const response = await fetch(newURL("/timetable/entries", params), { headers: headers });
    const data: TimeTable = await response.json();

    return data.days.map((day) => {
        return {
            date: day.date,
            entries: day.gridEntries.map((entry) => {
                let classes = entry.position5
                    ? [...entry.position5.map((classEl) => classEl.current.displayName), day.resource.shortName]
                    : [day.resource.shortName];
                classes.sort((a, b) => a.localeCompare(b));
                return {
                    start: new Date(entry.duration.start),
                    end: new Date(entry.duration.end),
                    info: entry.lessonInfo,
                    teacher: entry.position1[0]!.current.longName,
                    subject: entry.position2[0]!.current.longName,
                    locations: entry.position3.map((location) => location.current.displayName),
                    classes: classes,
                };
            }),
        };
    });
}

export async function getLessons(classId: string): Promise<Lesson[]> {
    const timetable = await getTimeTable(classId);
    return timetable.flatMap((day) => day.entries);
}
