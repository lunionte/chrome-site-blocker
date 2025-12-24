#!/usr/bin/env node

/**
 * Build Script para X-Chrome Site Blocker
 * Otimiza a estrutura de saída para carregamento em chrome://extensions/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const srcDir = path.join(distDir, "src");

console.log("🔧 Otimizando estrutura de build para Chrome Extension...\n");

// Move arquivos do src para raiz do dist
try {
    // Mover HTML files
    const popupHtml = path.join(srcDir, "popup", "popup.html");
    const blockPageHtml = path.join(srcDir, "block-page", "block-page.html");

    if (fs.existsSync(popupHtml)) {
        fs.copyFileSync(popupHtml, path.join(distDir, "popup.html"));
        console.log("✓ popup.html movido para dist/");
    }

    if (fs.existsSync(blockPageHtml)) {
        fs.copyFileSync(blockPageHtml, path.join(distDir, "block-page.html"));
        console.log("✓ block-page.html movido para dist/");
    }

    // Remove pasta src completamente
    if (fs.existsSync(srcDir)) {
        fs.rmSync(srcDir, { recursive: true, force: true });
        console.log("✓ Pasta src/ removida");
    }

    // Move arquivos da pasta assets para raiz e remove a pasta
    const assetsDir = path.join(distDir, "assets");
    if (fs.existsSync(assetsDir)) {
        const assetFiles = fs.readdirSync(assetsDir);
        assetFiles.forEach((file) => {
            const assetPath = path.join(assetsDir, file);
            const destPath = path.join(distDir, file);
            fs.copyFileSync(assetPath, destPath);
        });
        fs.rmSync(assetsDir, { recursive: true, force: true });
        console.log(`✓ ${assetFiles.length} arquivo(s) movido(s) de assets/ para raiz`);
    }

    console.log("\n✅ Build otimizado com sucesso!");
    console.log("\n📦 Estrutura final:");
    console.log("dist/");
    console.log("├── manifest.json");
    console.log("├── popup.html");
    console.log("├── popup.js");
    console.log("├── block-page.html");
    console.log("├── block-page.js");
    console.log("├── background.js");
    console.log("├── content-script.js");
    console.log("├── globals.js");
    console.log("└── globals.css");
    console.log("\n📱 Para carregar a extensão:");
    console.log("1. Abra chrome://extensions/");
    console.log('2. Ative "Modo do desenvolvedor"');
    console.log('3. Clique em "Carregar extensão sem empacotamento"');
    console.log(`4. Selecione a pasta: ${distDir}`);
} catch (error) {
    console.error("❌ Erro ao otimizar build:", error);
    process.exit(1);
}
