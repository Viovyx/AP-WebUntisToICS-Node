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
import { config } from "dotenv";

//#region Set consts
config();
const app = express();

export const envUndefined = (name: string) => {
    console.error(
        `${name} must be defined in .env!\nPlease restart application after updating .env`
    );
    process.exit();
};

const host: string = process.env.HOST?.trim() || envUndefined("HOST");
const publicUrl: string =
    process.env.PUBLIC_URL?.trim() || envUndefined("PUBLIC_URL");
const port: number = Number(process.env.PORT?.trim()) || envUndefined("PORT");

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
    const filter: string[] = (req.query.filter as string)
        ?.split(",")
        .map((filter) => filter.trim());

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
        const lessons = mapToLessons(timetable, filter);

        const minutes = (n: number) => n * 60;
        const calendar = ical({
            name: "AP WebUntis",
            description: "AP calendar synced from ap.webuntis.com",
            timezone: "Europe/Brussels",
            ttl: minutes(15),
            url: `${publicUrl}/calendar?class=${classId}&start=${dateRange.start}&end=${dateRange.end}`,
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

app.get("/lessons", async (req, res) => {
    const classId = req.query.class as string;
    let dateRange: DateRange = {
        start: req.query.start as string,
        end: req.query.end as string
    };
    const filter: string[] = (req.query.filter as string)
        ?.split(",")
        .map((filter) => filter.trim());

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
        const lessons = mapToLessons(timetable, filter);
        res.json(lessons);
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
        `../client/dist${!path.extname(req.path) ? req.path + "/index.html" : req.path}`
    );
    res.sendFile(resPath, (error) => {
        if (error) sendError(res, `Cannot ${req.method} ${req.path}`, 404);
    });
});
//#endregion

//#region Start express
app.listen(port, host, () => {
    console.log(
        `
         Server started!
         > Listening on: http://${host}:${port}
         > Public access: ${publicUrl}
        `
            .replaceAll("  ", "")
            .trim()
    );
});
//#endregion
