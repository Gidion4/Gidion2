// ------------------------------------------------------------
// GIDION UI v1 — OPTIMIZATION PANEL TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa uiOptimizationPanel.ts -moduulin keskeiset toiminnot:
//   - buildOptimizationPanel palauttaa validin paneelirakenteen
//   - scaffold + data yhdistyvät oikein
//   - kaikki kentät ovat oikeassa muodossa
//   - UI-kerros saa deterministisen paneelirakenteen
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildOptimizationPanel } from "./uiOptimizationPanel.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running UIOptimizationPanel tests...");
    // --- Test 1: uiOptimizationPanel.ts olemassa ---
    const modulePath = path.join(__dirname, "uiOptimizationPanel.ts");
    assert(fs.existsSync(modulePath), "uiOptimizationPanel.ts is missing");
    // --- Test 2: buildOptimizationPanel toimii ---
    const panel = await buildOptimizationPanel();
    assert(typeof panel === "object", "buildOptimizationPanel did not return an object");
    // --- Test 3: scaffold on validi ---
    assert(typeof panel.scaffold === "object", "panel.scaffold missing or invalid");
    assert(typeof panel.scaffold.title === "string", "panel.scaffold.title invalid");
    assert(typeof panel.scaffold.style === "object", "panel.scaffold.style invalid");
    assert(typeof panel.scaffold.header === "object", "panel.scaffold.header invalid");
    // --- Test 4: data on validi ---
    assert(typeof panel.data === "object", "panel.data missing or invalid");
    assert(typeof panel.data.fullyOptimized === "boolean", "panel.data.fullyOptimized invalid");
    assert(typeof panel.data.adviceCount === "number", "panel.data.adviceCount invalid");
    assert(typeof panel.data.executedSteps === "number", "panel.data.executedSteps invalid");
    console.log("✔ All UIOptimizationPanel tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
