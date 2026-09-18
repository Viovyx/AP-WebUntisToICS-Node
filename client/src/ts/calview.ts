import { Calendar } from "fullcalendar";
import interactionPlugin from "fullcalendar/interaction";
import dayGridPlugin from "fullcalendar/daygrid";
import timeGridPlugin from "fullcalendar/timegrid";
import listPlugin from "fullcalendar/list";
import classicThemePlugin from "fullcalendar/themes/classic";
import adaptivePlugin from "fullcalendar-scheduler/adaptive";
import resourceTimelinePlugin from "fullcalendar-scheduler/resource-timeline";

import "fullcalendar/skeleton.css";
import "fullcalendar/themes/classic/theme.css";
import "fullcalendar/themes/classic/palette.css";

import "/css/global-style.css";
import "/css/calview.css";
import type { Lesson } from "./types";

const calendarEl: HTMLElement = document.getElementById("calendar")!;
const calendar = new Calendar(calendarEl, {
    plugins: [
        adaptivePlugin,
        classicThemePlugin,
        interactionPlugin,
        dayGridPlugin,
        listPlugin,
        timeGridPlugin,
        resourceTimelinePlugin
    ],
    schedulerLicenseKey: "AGPL-My-Frontend-And-Backend-Are-Open-Source",
    // now: "2018-02-07",
    editable: false, // enable draggable events
    // aspectRatio: 1.8,
    height: "95vh",
    scrollTime: `${new Date().getHours()}:${new Date().getMinutes()}`, // undo default 6am scrollTime, set to current time
    firstDay: 1,
    locale: "en-GB",
    headerToolbar: {
        left: "today prev,next",
        center: "title",
        right: "resourceTimelineDay,resourceTimelineThreeDays,timeGridWeek,dayGridMonth,listWeek"
    },
    initialView: "resourceTimelineDay",
    views: {
        resourceTimelineThreeDays: {
            type: "resourceTimeline",
            duration: { days: 3 }
        }
    },
    buttons: {
        resourceTimelineThreeDays: {
            text: "3 day"
        }
    },
    resourceColumnHeaderContent: "Rooms",
    resources: [],
    eventClass: "event",
    eventContent: (info) => {
        const event = info.event;
        return {
            html: `
            <h2>${event.title}</h2>
            <p>${event.extendedProps.locations.join(" / ")}</p>
            <p>${event.extendedProps.classes.join(" / ")}</p>
            <p>${event.extendedProps.teachers.join(", ")}</p>
        `
        };
    }
});

async function loadLessons(params?: URLSearchParams) {
    if (!params || !params.get("class")) return location.replace("/");

    const lessons: Lesson[] = await fetch(`/lessons?${params}`).then(
        async (res) => await res.json()
    );

    lessons.forEach((lesson) =>
        calendar.addEvent({
            start: lesson.start,
            end: lesson.end,
            title: lesson.subject + (lesson.info ? ` (${lesson.info})` : ""),
            extendedProps: {
                locations: lesson.locations,
                teachers: lesson.teachers,
                classes: lesson.classes
            }
        })
    );
}

function getSearchParams(): URLSearchParams | undefined {
    if (!location.search) return;

    return new URLSearchParams(
        location.search
            .substring(1)
            .split("&")
            .map((pair) => pair.split("="))
    );
}

loadLessons(getSearchParams());
calendar.render();
