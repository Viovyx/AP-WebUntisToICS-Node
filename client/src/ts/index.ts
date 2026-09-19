import "/css/global-style.css";
import "/css/index.css";
import type { Class, DateRange, SchoolYear } from "./types";

loadClasses();
loadSchoolyears();
initSearch();

async function loadClasses(schoolyearId?: number) {
    const classesListRef: HTMLElement = document.querySelector("div#classes")!;
    classesListRef.innerHTML = "";

    let classes: Class[] = [];
    let dateRange: DateRange;
    if (schoolyearId) {
        const schoolyears: SchoolYear[] = await get("/schoolyears");
        dateRange = schoolyears.find(
            (schoolyear) => schoolyear.id === schoolyearId
        )!.dateRange;
        classes = await get(
            `/classes?start=${dateRange.start}&end=${dateRange.end}`
        );
    } else classes = await get("/classes");

    classes.forEach((classData) => {
        const classEl = document.createElement("div");

        classEl.innerHTML = `
            <p>${classData.name}</p>
            <div class="action-buttons">
                <button class="copy-url">Copy ICS sync url</button>
                <button class="open-calendar">Open Calendar</button>
            </div>
            <span>${classData.id}</span>
        `;

        classEl
            .querySelector(".copy-url")
            .addEventListener("click", (event) => {
                const el = event.target as HTMLElement;
                if (schoolyearId)
                    copy(
                        getUrl("calendar", classData.id.toString(), dateRange)
                    );
                else copy(getUrl("calendar", classData.id.toString()));
            });

        classEl
            .querySelector(".open-calendar")
            .addEventListener("click", (event) => {
                const el = event.target as HTMLElement;
                let url = "";
                if (schoolyearId)
                    url = getUrl("calview", classData.id.toString(), dateRange);
                else url = getUrl("calview", classData.id.toString());
                location.href = url;
            });

        classesListRef.appendChild(classEl);
    });
}

async function loadSchoolyears() {
    const schoolyearsSelectRef: HTMLSelectElement =
        document.querySelector("select#schoolyears")!;
    const schoolyears: SchoolYear[] = await get("/schoolyears");

    schoolyearsSelectRef.innerHTML = `<option value="" selected>Current Schoolyear</option>`;
    schoolyearsSelectRef.innerHTML += schoolyears
        .map(
            (schoolyear) =>
                `<option value="${schoolyear.id}">${schoolyear.name}</option>`
        )
        .join("");

    schoolyearsSelectRef.addEventListener("change", (event) => {
        const selected = (event.target as HTMLSelectElement).selectedOptions[0];
        loadClasses(+selected.value);
    });
}

function initSearch() {
    const form: HTMLFormElement = document.querySelector("#find")!;
    const findTextRef: HTMLInputElement = form.querySelector("#find-text")!;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query: string = findTextRef.value;

        if ("find" in window && typeof (window as any).find === "function") {
            (window as any).find(query);
        } else {
            // Fallback for browsers that don't support window.find()
            alert(
                "window.find() is not supported in this browser.\n\nUse your browsers built-in search functionality ('ctrl+f' or 'Find in page') instead."
            );
        }
    });
}

//#region Helper functions
async function get(path: string, method: string = "get") {
    const response = await fetch(path, { method: method });
    const data = response.json();
    return data;
}

function getUrl(
    type: "calendar" | "calview",
    id: string,
    dateRange?: DateRange
): string {
    let url = `${location.href}${type}?class=${id}`;
    if (dateRange) url += `&start=${dateRange.start}&end=${dateRange.end}`;
    return url;
}

function copy(text: string) {
    try {
        navigator.clipboard.writeText(text);
        alert(
            `Copied sync url to your clipboard!\nPaste it in your calendar app to sync.`
        );
    } catch (error) {
        // Fallback when unable to write to clipboard
        prompt(
            `Cannot copy sync url to your clipboard!\nCopy following url manually and paste it in your calendar app to sync.`,
            text
        );
    }
}
//#endregion
