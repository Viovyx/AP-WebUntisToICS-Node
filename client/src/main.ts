import "./style.css";
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
        classEl.innerHTML = `<p>${classData.name}</p><span>${classData.id}</span>`;
        classEl.id = String(classData.id);
        classEl.addEventListener("click", (e) => {
            const el = e.target as HTMLElement;
            if (schoolyearId) copy(el.id, dateRange);
            else copy(el.id);
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

    schoolyearsSelectRef.addEventListener("change", (e) => {
        const selected = (e.target as HTMLSelectElement).selectedOptions[0];
        loadClasses(+selected.value);
    });
}

function initSearch() {
    const form: HTMLFormElement = document.querySelector("#find")!;
    const findTextRef: HTMLInputElement = form.querySelector("#find-text")!;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
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

function copy(id: string, dateRange?: DateRange) {
    let url = `${location.href}calendar?class=${id}`;
    if (dateRange) url += `&start=${dateRange.start}&end=${dateRange.end}`;

    navigator.clipboard.writeText(url);
    alert(
        `${url} copied to clipboard!\nPaste it in your calendar app to sync.`
    );
}
//#endregion
