import express, { type Response } from "express";
import type { DateRange } from "./src/types.ts";
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

const sendError = (res: Response, error: string, status: number = 400) =>
    res.status(status).send(error);

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);
//#endregion

//#region API endpoints
app.get("/calendar", async (req, res) => {
    const classId = req.query.class as string;
    let dateRange: DateRange = {
        start: req.query.start as string,
        end: req.query.end as string
    };

    if (!classId) return sendError(res, "No 'class' param found.");
    if (isNaN(+classId)) return sendError(res, "'class' should be a number.");

    if (!(dateRange.start && dateRange.end)) {
        try {
            dateRange = (await getCurrentSchoolyear()).dateRange;
        } catch (error) {
            return sendError(res, getErrorMessage(error));
        }
    } else {
        try {
            const schoolyears = await getSchoolyears();
            if (
                !schoolyears.some(
                    (schoolyear) =>
                        schoolyear.dateRange.start === dateRange.start &&
                        schoolyear.dateRange.end === dateRange.end
                )
            )
                return sendError(
                    res,
                    `No schoolyear found for daterange '${dateRange.start} - ${dateRange.end}'.`
                );
        } catch (error) {
            return sendError(res, getErrorMessage(error), 502);
        }
    }

    try {
        const timetable = await getTimetable(+classId, dateRange);
        const lessons = mapToLessons(timetable);

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
    } catch (error) {
        return sendError(res, getErrorMessage(error));
    }
});

app.get("/classes", async (req, res) => {
    let dateRange: DateRange = {
        start: req.query.start as string,
        end: req.query.end as string
    };

    if (!(dateRange.start && dateRange.end)) {
        try {
            dateRange = (await getCurrentSchoolyear()).dateRange;
        } catch (error) {
            return sendError(res, getErrorMessage(error), 502);
        }
    }

    try {
        const classesRes = await getClasses(dateRange);
        const classes = mapToClasses(classesRes);
        res.json(classes);
    } catch (error) {
        return sendError(res, getErrorMessage(error), 502);
    }
});

app.get("/schoolyears", async (_, res) => {
    try {
        const schoolyears = await getSchoolyears();
        res.json(schoolyears);
    } catch (error) {
        return sendError(res, getErrorMessage(error), 502);
    }
});
//#endregion

//#region Serve Client
app.use((req, res) => {
    const resPath = path.resolve(
        `../client/dist${req.path == "/" ? "/index.html" : req.path}`
    );
    res.sendFile(resPath, (e) =>
        e ? sendError(res, `Cannot ${req.method} ${req.path}`, 404) : null
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
