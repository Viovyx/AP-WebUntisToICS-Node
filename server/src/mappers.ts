import type { ICalEventData } from "ical-generator";
import type {
    Class,
    ClassResource,
    CleanPositions,
    GridEntry,
    Lesson,
    Position,
    Timetable
} from "./types.ts";

//#region Helpers
function mergeArrays(...arrays: string[][]): string[] {
    let mergedArray: string[] = [...new Set(arrays.flatMap((arr) => arr))];
    mergedArray.sort();
    return mergedArray;
}

function getEntryPositions(gridEntry: GridEntry): CleanPositions {
    const positionsArr: Position[][] = [
        gridEntry.position1 ?? [],
        gridEntry.position2 ?? [],
        gridEntry.position3 ?? [],
        gridEntry.position4 ?? [],
        gridEntry.position5 ?? [],
        gridEntry.position6 ?? [],
        gridEntry.position7 ?? []
    ];

    let positions: CleanPositions = {
        subjects: [],
        teachers: [],
        rooms: [],
        infos: [],
        classes: []
    };

    positionsArr.forEach((pos) => {
        switch (pos[0]?.current.type) {
            case "SUBJECT":
                positions.subjects = pos;
                break;
            case "TEACHER":
                positions.teachers = pos;
                break;
            case "ROOM":
                positions.rooms = pos;
                break;
            case "INFO":
                positions.infos = pos;
                break;
            case "CLASS":
                positions.classes = pos;
                break;
            default:
                break;
        }
    });

    return positions;
}
//#endregion

//#region Mappers
export function mapToLessons(
    timetable: Timetable,
    filter?: string[]
): Lesson[] {
    const lessonSet = new Map<string, Lesson>();

    timetable.days?.forEach((day) =>
        day.gridEntries?.forEach((entry) => {
            const positions = getEntryPositions(entry);

            const lesson: Lesson = {
                start: new Date(entry.duration.start),
                end: new Date(entry.duration.end),
                info: entry.lessonInfo,
                teachers: positions.teachers.map(
                    (teacher) => teacher.current.longName
                ),
                subject:
                    positions.subjects[0]?.current.longName ?? "No subject",
                locations: positions.rooms
                    .map((location) => location.current.displayName)
                    .sort(),
                classes: [
                    ...(positions.classes?.map(
                        (classEl) => classEl.current.displayName
                    ) ?? []),
                    day.resource.shortName
                ].sort()
            };

            if (
                !filter?.some(
                    (filterSubject) =>
                        filterSubject.toLowerCase() ===
                        lesson.subject.toLowerCase()
                )
            ) {
                // Create unique key
                const key: string = lesson.subject.concat(
                    lesson.info,
                    lesson.start.toString(),
                    lesson.end.toString()
                );
                const toCompare = lessonSet.get(key);

                // If key exists => merge lessons
                if (toCompare !== undefined) {
                    toCompare.teachers = mergeArrays(
                        toCompare.teachers,
                        lesson.teachers
                    );
                    toCompare.classes = mergeArrays(
                        toCompare.classes,
                        lesson.classes
                    );
                    toCompare.locations = mergeArrays(
                        toCompare.locations,
                        lesson.locations
                    );
                } else lessonSet.set(key, lesson); // Add new unique lesson
            }
        })
    );

    return [...lessonSet.values()];
}

export function mapToClasses(classesRes: ClassResource[]): Class[] {
    return classesRes.map((classEl) => {
        return { id: classEl.class.id, name: classEl.class.displayName };
    });
}

export function mapToCalEvent(lesson: Lesson): ICalEventData {
    let descriptionLines = [
        lesson.teachers.join(", "),
        "-".repeat(20),
        lesson.classes.join(" / ")
    ];
    if (lesson.info) descriptionLines.push("-".repeat(20), `ℹ️ ${lesson.info}`);

    return {
        start: lesson.start,
        end: lesson.end,
        summary: lesson.subject + (lesson.info ? ` (${lesson.info})` : ""),
        location: lesson.locations.join(" / "),
        description: descriptionLines.join("\n")
    };
}
//#endregion
