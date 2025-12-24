import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        react(),
        {
            name: "copy-manifest",
            apply: "build",
            generateBundle() {
                const manifestPath = path.resolve(__dirname, "src/manifest.json");
                const manifestContent = fs.readFileSync(manifestPath, "utf-8");
                this.emitFile({
                    type: "asset",
                    fileName: "manifest.json",
                    source: manifestContent,
                });
            },
        },
    ],
    build: {
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, "src/popup/popup.html"),
                "block-page": path.resolve(__dirname, "src/block-page/block-page.html"),
                background: path.resolve(__dirname, "src/background/background.ts"),
                "content-script": path.resolve(__dirname, "src/content-script/content-script.ts"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name][extname]",
                dir: "dist",
            },
        },
        outDir: "dist",
        emptyOutDir: true,
        target: "esnext",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
