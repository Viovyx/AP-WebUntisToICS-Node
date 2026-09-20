import "/css/global-style.css";
import "/css/home.css";
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
                if (schoolyearId)
                    copy(
                        getUrl("calendar", classData.id.toString(), dateRange)
                    );
                else copy(getUrl("calendar", classData.id.toString()));
            });

        classEl
            .querySelector(".open-calendar")
            .addEventListener("click", (event) => {
                let url = "";
                if (schoolyearId)
                    url = getUrl("calview", classData.id.toString(), dateRange);
                else url = getUrl("calview", classData.id.toString());
                location.href = url;
            });

        classEl.addEventListener("mouseenter", async () => {
            await new Promise((r) => setTimeout(r, 1)); // Needed to prevent clicking buttons before visible
            (
                classEl.querySelector(".action-buttons") as HTMLElement
            ).style.display = "flex";
        });
        classEl.addEventListener("mouseleave", async () => {
            await new Promise((r) => setTimeout(r, 1)); // Needed to prevent clicking buttons before visible
            (
                classEl.querySelector(".action-buttons") as HTMLElement
            ).style.display = "none";
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
    const findTextRef: HTMLInputElement = document.querySelector("#find-text")!;

    findTextRef.addEventListener("keyup", (event) => {
        event.preventDefault();
        const query: string = findTextRef.value.toLowerCase();
        const classes = document.querySelectorAll("#classes > div");

        classes.forEach((classEl) => {
            const name = classEl.querySelector("p").innerText.toLowerCase();

            if (name.indexOf(query) > -1)
                (classEl as HTMLElement).style.display = "";
            else (classEl as HTMLElement).style.display = "none";
        });
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
