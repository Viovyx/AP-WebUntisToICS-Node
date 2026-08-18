import express, { type Response } from "express";
import type { DateRange, ErrorRes } from "./src/types.ts";
import {
    getClasses,
    getCurrentSchoolyear,
    getSchoolyears,
    getTimetable
} from "./src/api.ts";
import ical from "ical-generator";
import { mapToCalEvent, mapToClasses, mapToLessons } from "./src/mappers.ts";
import path from "node:path";

//#region Set consts
const app = express();

export const host: string = "0.0.0.0";
export const port: number = 3000;
export const apiBaseUrl: string =
    "https://ap.webuntis.com/WebUntis/api/rest/view/v1";

const sendError = (res: Response, error: ErrorRes, status: number = 400) =>
    res.status(status).send(error);
//#endregion

//#region API endpoints
app.get("/calendar", async (req, res) => {
    const classId = req.query.class as string;
    let dateRange: DateRange = {
        start: req.query.start as string,
        end: req.query.end as string
    };

    if (!(dateRange.start && dateRange.end))
        dateRange = (await getCurrentSchoolyear()).dateRange;
    else if (
        !(await getSchoolyears()).some(
            (schoolyear) =>
                schoolyear.dateRange.start === dateRange.start &&
                schoolyear.dateRange.end === dateRange.end
        )
    )
        return sendError(res, {
            error: `No schoolyear found for daterange '${dateRange.start} - ${dateRange.end}'.`
        });

    if (!classId) return sendError(res, { error: "No 'class' param found." });
    if (isNaN(+classId))
        return sendError(res, { error: "'class' should be a number." });

    const timetable = await getTimetable(+classId, dateRange);
    if (!timetable)
        return sendError(res, {
            error: `Class with id '${classId}' not found.`
        });

    const lessons = mapToLessons(timetable!);

    const minutes = (n: number) => n * 60;
    const calendar = ical({
        name: "AP WebUntis",
        description: "AP calendar synced from ap.webuntis.com",
        timezone: "Europe/Brussels",
        ttl: minutes(15),
        url: `${host}:${port}/calendar?class=${classId}`,
        prodId: { company: "viovyx", product: "AP-WebUntisToICS-Node" }
    });

    lessons.forEach((lesson) => {
        calendar.createEvent(mapToCalEvent(lesson));
    });

    res.writeHead(200, {
        "Content-Disposition": 'attachment; filename="calendar.ics"',
        "Content-Type": "text/calendar; charset=utf-8"
    });
    res.end(calendar.toString());
});

app.get("/classes", async (req, res) => {
    let dateRange: DateRange = {
        start: req.query.start as string,
        end: req.query.end as string
    };

    if (!(dateRange.start && dateRange.end))
        dateRange = (await getCurrentSchoolyear()).dateRange;

    const classesRes = await getClasses(dateRange);
    const classes = mapToClasses(classesRes);
    res.json(classes);
});

app.get("/schoolyears", async (_, res) => {
    const schoolyears = await getSchoolyears();
    res.json(schoolyears);
});
//#endregion

//#region Serve Client
app.use((req, res) => {
    const resPath = path.resolve(
        `../client/dist${req.path == "/" ? "/index.html" : req.path}`
    );
    res.sendFile(resPath, (e) =>
        e
            ? sendError(res, { error: `Cannot ${req.method} ${req.path}` }, 404)
            : null
    );
});
//#endregion

//#region Start express
app.listen(port, host, () => {
    console.log(
        `
         Server started!
         > Listening on: http://${host}:${port}
        `
            .replaceAll("  ", "")
            .trim()
    );
});
//#endregion
