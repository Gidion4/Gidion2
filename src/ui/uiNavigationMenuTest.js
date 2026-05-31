// ------------------------------------------------------------
// GIDION UI v1 — NAVIGATION MENU TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa uiNavigationMenu.ts -moduulin keskeiset toiminnot:
//   - getNavigationMenu palauttaa validin navigaatiorakenteen
//   - kaikki navigaatioelementit ovat oikeassa muodossa
//   - UI-kerros saa deterministisen navigaatiopohjan
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getNavigationMenu } from "./uiNavigationMenu.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running UINavMenu tests...");
    // --- Test 1: uiNavigationMenu.ts olemassa ---
    const modulePath = path.join(__dirname, "uiNavigationMenu.ts");
    assert(fs.existsSync(modulePath), "uiNavigationMenu.ts is missing");
    // --- Test 2: getNavigationMenu toimii ---
    const nav = getNavigationMenu();
    assert(typeof nav === "object", "getNavigationMenu did not return an object");
    // --- Test 3: items on validi ---
    assert(Array.isArray(nav.items), "nav.items is not an array");
    assert(nav.items.length > 0, "nav.items is empty");
    for (const item of nav.items) {
        assert(typeof item.key === "string", "item.key invalid");
        assert(typeof item.label === "string", "item.label invalid");
        assert(typeof item.icon === "string", "item.icon invalid");
        assert(typeof item.route === "string", "item.route invalid");
        assert(typeof item.glow === "boolean", "item.glow invalid");
    }
    // --- Test 4: style on validi ---
    assert(typeof nav.style === "object", "nav.style missing or invalid");
    assert(typeof nav.style.width === "string", "nav.style.width invalid");
    assert(typeof nav.style.background === "string", "nav.style.background invalid");
    assert(typeof nav.style.neonGlowColor === "string", "nav.style.neonGlowColor invalid");
    assert(typeof nav.style.hoverGlowIntensity === "number", "nav.style.hoverGlowIntensity invalid");
    console.log("✔ All UINavMenu tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
