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
    eventTitleClass: "event-title",
    eventDidMount: (info) => {
        // Add event locations under title
        if (info.view.type !== "dayGridMonth") {
            const locationEl = document.createElement("p");
            locationEl.innerText = info.event.extendedProps.location;
            locationEl.classList.add("event-location");
            info.el.querySelector(".event-title").after(locationEl);
        }

        // Event detailed view
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
                <div class="event-detail-group">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                    <p>${info.event.extendedProps.location}</p>
                </div>
                <div class="event-detail-group">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
                    <p>${(info.event.extendedProps.description as string).replaceAll("\n", "</br>")}</p>
                </div>
            `
        });
    }
});

calendar.render();
//#endregion
