import "./style.css";
import type { Class } from "./types";

async function main() {
    const classes: Class[] = await get("/classes");
    const classesListRef: HTMLElement = document.querySelector("div#classes")!;

    classes.forEach((classData) => {
        const classEl: HTMLElement = document.createElement("div");
        classEl.innerHTML = `<p>${classData.name}</p><span>${classData.id}</span>`;
        classEl.id = String(classData.id);
        classEl.addEventListener("click", (e) => {
            const el: HTMLElement = e.target as HTMLElement;
            copy(el.id);
        });
        classesListRef.appendChild(classEl);
    });
}

async function get(path: string, method: string = "get") {
    const response = await fetch(path, { method: method });
    const data = response.json();
    return data;
}

function copy(id: string) {
    const url = location.href + "calendar?class=" + id;
    navigator.clipboard.writeText(url);
    alert(
        `${url} copied to clipboard!\nPaste it in your calendar app to sync.`
    );
}

main();
