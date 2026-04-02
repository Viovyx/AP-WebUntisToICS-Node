import express from "express";
import ViteExpress from "vite-express";
import { getClasses, getLessons } from "./api";
import { Lesson } from "../types";
import ical from "ical-generator";

export const app = express();

app.get("/calendar", async (req, res) => {
    const classId = req.query.class as string;
    if (!classId) res.redirect("/");
    const lessons: Lesson[] = await getLessons(classId);

    const calendar = ical({ name: "AP WebUntis", timezone: "Europe/Brussels" });
    lessons.forEach((lesson) => {
        let descriptionLines = [lesson.teacher, lesson.classes.join(" / ")];
        if (lesson.info) descriptionLines.concat(["-".repeat(20), `ℹ️ ${lesson.info}`]);

        calendar.createEvent({
            start: lesson.start,
            end: lesson.end,
            summary: `${lesson.subject}` + (lesson.info ? ` (${lesson.info})` : ""),
            location: lesson.locations.join(" / "),
            description: descriptionLines.join("\n"),
        });
    });

    res.contentType("text/calendar");
    res.send(calendar.toString());
});

app.post("/classes", async (_, res) => {
    const data = await getClasses();
    res.json(data);
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening on port 3000..."));
