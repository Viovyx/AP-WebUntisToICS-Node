import express, { type Response } from "express";
import type { ErrorRes } from "./types.ts";
import { getClasses, getTimetable } from "./api.ts";
import ical from "ical-generator";
import { mapToCalEvent, mapToClasses, mapToLessons } from "./mappers.ts";
import { loadEnvFile } from "node:process";
import path from "node:path";

loadEnvFile();
const app = express();
const host: string = process.env.HOST;
const port: number = process.env.PORT;

const sendError = (res: Response, error: ErrorRes, status: number = 400) =>
    res.status(status).send(error);

// Api endpoints
app.get("/calendar", async (req, res) => {
    const classId = req.query.class as string;

    if (!classId) return sendError(res, { error: "No 'class' param found." });
    if (isNaN(+classId))
        return sendError(res, { error: "'class' should be a number." });

    const timetable = await getTimetable(+classId);
    const lessons = mapToLessons(timetable);

    const minutes = (n: number) => n * 60;
    const calendar = ical({
        name: "AP WebUntis",
        timezone: "Europe/Brussels",
        ttl: minutes(15),
        url: `${host}:${port}/calendar?class=${classId}`
    });

    lessons.forEach((lesson) => {
        calendar.createEvent(mapToCalEvent(lesson));
    });

    res.contentType("text/calendar").send(calendar.toString());
});

app.get("/classes", async (req, res) => {
    const classesRes = await getClasses();
    const classes = mapToClasses(classesRes);
    res.json(classes);
});

// Serve client files
app.use((req, res) => {
    const resPath = path.resolve(
        `./client/dist${req.path == "/" ? "/index.html" : req.path}`
    );
    res.sendFile(resPath, (e) =>
        e
            ? sendError(res, { error: `Cannot ${req.method} ${req.path}` }, 404)
            : null
    );
});

// Start Express server
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
