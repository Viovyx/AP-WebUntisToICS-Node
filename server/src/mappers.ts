import type { ICalEventData } from "ical-generator";
import type { Class, ClassResource, Lesson, Timetable } from "./types.ts";

function mergeArrays(...arrays: string[][]): string[] {
    let mergedArray: string[] = [...new Set(arrays.flatMap((arr) => arr))];
    mergedArray.sort();
    return mergedArray;
}

function deduplicateLessons(lessons: Lesson[]): Lesson[] {
    let lessonSet = new Map<string, Lesson>();

    lessons.forEach((lesson) => {
        const key: string = lesson.subject.concat(
            lesson.info,
            lesson.start.toString(),
            lesson.end.toString()
        );

        let toCompare = lessonSet.get(key);
        if (toCompare) {
            toCompare.teachers = mergeArrays(
                toCompare.teachers,
                lesson.teachers
            );
            toCompare.classes = mergeArrays(toCompare.classes, lesson.classes);
            toCompare.locations = mergeArrays(
                toCompare.locations,
                lesson.locations
            );
        } else lessonSet.set(key, lesson);
    });

    return [...lessonSet.values()];
}

export function mapToLessons(timetable: Timetable): Lesson[] {
    const lessons: Lesson[] = timetable.days?.flatMap((day) =>
        day.gridEntries?.map((entry) => {
            return {
                start: new Date(entry.duration.start),
                end: new Date(entry.duration.end),
                info: entry.lessonInfo,
                teachers: [entry.position1[0]?.current.longName],
                subject: entry.position2[0]?.current.longName,
                locations: entry.position3
                    .map((location) => location.current.displayName)
                    .sort(),
                classes: [
                    ...(entry.position5?.map(
                        (classEl) => classEl.current.displayName
                    ) ?? []),
                    day.resource.shortName
                ].sort()
            } as Lesson;
        })
    );

    return deduplicateLessons(lessons);
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
