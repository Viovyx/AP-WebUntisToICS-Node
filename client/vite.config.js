import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    root: resolve(import.meta.dirname, "src"),
    build: {
        outDir: resolve(import.meta.dirname, "dist"),
        emptyOutDir: true,

        rolldownOptions: {
            input: {
                main: resolve(import.meta.dirname, "src/index.html"),
                calview: resolve(import.meta.dirname, "src/calview/index.html")
            }
        }
    }
});
