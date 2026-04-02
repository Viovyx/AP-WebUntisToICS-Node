import type { Class } from "../types";
import "./style.css";

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

function copy(id: string) {
    const url = location.href + "calendar?class=" + id;
    navigator.clipboard.writeText(url);
    alert(`${url} copied to clipboard!\nPaste it in your calendar app to sync.`);
}

async function get(localPath: string) {
    const response = await fetch(localPath, { method: "POST" });
    const data = response.json();
    return data;
}

main();
