// Fullcalendar imports
import { Calendar } from "fullcalendar";
import iCalendarPlugin from "@fullcalendar/icalendar";
import dayGridPlugin from "fullcalendar/daygrid";
import timeGridPlugin from "fullcalendar/timegrid";
import themePlugin from "fullcalendar/themes/forma";

// Tippy imports
import tippy from "tippy.js";
import { hideOnEsc } from "./tippy-custom-plugins";

// Fullcalendar CSS
import "fullcalendar/skeleton.css";
import "fullcalendar/themes/forma/theme.css";
import "fullcalendar/themes/forma/palettes/red.css";

// Tippy CSS
import "tippy.js/dist/tippy.css";

// Custom CSS
import "/css/global-style.css";
import "/css/calview.css";

//#region Helpers
async function getCalendarUrl(): Promise<string> {
    if (!location.search) location.replace("/");
    const url = `/calendar${location.search}`;

    const testRes = await fetch(url);
    if (!testRes.ok) location.replace("/");

    return url;
}
//#endregion

//#region Icon Actions
const refetchIcon: SVGElement = document.querySelector("#refetch-icon")!;
const linkIcon: SVGElement = document.querySelector("#calendar-icon")!;

tippy(refetchIcon, { content: "Refetch events", placement: "right" });
tippy(linkIcon, { content: "Copy ICS sync url", placement: "left" });

let rotation = 0;
refetchIcon.addEventListener("click", () => {
    rotation += 720;
    refetchIcon.style.transform = `rotate(${rotation}deg)`;
    calendar.refetchEvents();
});

linkIcon.addEventListener("click", () => {
    let url = `${location.protocol}//${location.host}/calendar${location.search}`;

    try {
        navigator.clipboard.writeText(url);
        alert(
            `Copied sync url to your clipboard!\nPaste it in your calendar app to sync.`
        );
    } catch (error) {
        // Fallback when unable to write to clipboard
        prompt(
            `Cannot copy sync url to your clipboard!\nCopy following url manually and paste it in your calendar app to sync.`,
            url
        );
    }
});
//#endregion

//#region Setup & Render calendar
const wrapperEl: HTMLElement = document.querySelector("#wrapper")!;
const calendarEl: HTMLElement = document.querySelector("#calendar")!;
const tippyContainer: HTMLElement = document.querySelector("#tippy-container")!;
tippyContainer.style.display = "none";

const calendar = new Calendar(calendarEl, {
    plugins: [themePlugin, iCalendarPlugin, dayGridPlugin, timeGridPlugin],
    colorScheme: "dark",
    height: "100dvh",
    editable: false,
    expandRows: true,
    dayMaxEvents: true,
    nowIndicator: true,
    scrollTime: `08:00`,
    firstDay: 1, // Monday
    locale: "en-GB",
    toolbarClass: "toolbar",
    headerToolbar: {
        left: "title",
        center: "today prev,next",
        right: "timeGridDay,timeGridWeek,dayGridMonth"
    },
    initialView: "timeGridWeek",
    views: {
        timeGridDay: {
            type: "timeGrid",
            duration: { days: 1 }
        }
    },
    buttons: {
        timeGridDay: {
            text: "Day"
        }
    },
    weekends: false,
    events: {
        url: await getCalendarUrl(),
        format: "ics"
    },
    eventDidMount: (info) =>
        tippy(info.el, {
            plugins: [hideOnEsc],
            trigger: "click",
            arrow: false,
            hideOnClick: true,
            theme: "custom",
            allowHTML: true,
            interactive: true,
            maxWidth: "none",
            onClickOutside: (instance) => {
                instance.popperInstance.destroy();
            },
            appendTo: () => tippyContainer,
            onShow: () => {
                wrapperEl.classList.add("event-open");
                tippyContainer.style.display = null;
            },
            onHide: (instance) => {
                wrapperEl.classList.remove("event-open");
                tippyContainer.style.display = "none";
                instance.popper.remove();
            },
            content: `
                <p class="time">${info.event.start.toLocaleString("nl-BE", { dateStyle: "short", timeStyle: "short" })} - ${info.event.end.toLocaleString("nl-BE", { timeStyle: "short" })}</p>
                <h3>${info.event.title}</h3>
                <p>${info.event.extendedProps.location}</p>
                <p>${(info.event.extendedProps.description as string).replaceAll("\n", "</br>")}</p>
            `
        })
});

calendar.render();
//#endregion
