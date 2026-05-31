// ------------------------------------------------------------
// GIDION UI v1 — CORE LAYOUT TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa uiCoreLayout.ts -moduulin keskeiset toiminnot:
//   - getUICoreLayout palauttaa validin layout-olion
//   - style- ja layout-kentät ovat olemassa ja oikeassa muodossa
//   - UI-kerros saa deterministisen pohjarakenteen
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUICoreLayout } from "./uiCoreLayout.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running UICoreLayout tests...");
    // --- Test 1: uiCoreLayout.ts olemassa ---
    const modulePath = path.join(__dirname, "uiCoreLayout.ts");
    assert(fs.existsSync(modulePath), "uiCoreLayout.ts is missing");
    // --- Test 2: getUICoreLayout toimii ---
    const layout = getUICoreLayout();
    assert(typeof layout === "object", "getUICoreLayout did not return an object");
    // --- Test 3: style on validi ---
    assert(typeof layout.style === "object", "style missing or invalid");
    assert(typeof layout.style.background === "string", "style.background invalid");
    assert(typeof layout.style.panelBackground === "string", "style.panelBackground invalid");
    assert(typeof layout.style.neonPrimary === "string", "style.neonPrimary invalid");
    assert(typeof layout.style.neonSecondary === "string", "style.neonSecondary invalid");
    assert(typeof layout.style.glowIntensity === "number", "style.glowIntensity invalid");
    assert(typeof layout.style.borderRadius === "string", "style.borderRadius invalid");
    assert(typeof layout.style.blur === "string", "style.blur invalid");
    // --- Test 4: layout on validi ---
    assert(typeof layout.layout === "object", "layout.layout missing or invalid");
    assert(typeof layout.layout.headerHeight === "string", "layout.headerHeight invalid");
    assert(typeof layout.layout.sidebarWidth === "string", "layout.sidebarWidth invalid");
    assert(typeof layout.layout.contentPadding === "string", "layout.contentPadding invalid");
    assert(typeof layout.layout.maxContentWidth === "string", "layout.maxContentWidth invalid");
    console.log("✔ All UICoreLayout tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
