// ------------------------------------------------------------
// GIDION UI v1 — SELF-HEALING PANEL TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa uiSelfHealingPanel.ts -moduulin keskeiset toiminnot:
//   - buildSelfHealingPanel palauttaa validin paneelirakenteen
//   - scaffold + data yhdistyvät oikein
//   - kaikki kentät ovat oikeassa muodossa
//   - UI-kerros saa deterministisen paneelirakenteen
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildSelfHealingPanel } from "./uiSelfHealingPanel.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running UISelfHealingPanel tests...");
    // --- Test 1: uiSelfHealingPanel.ts olemassa ---
    const modulePath = path.join(__dirname, "uiSelfHealingPanel.ts");
    assert(fs.existsSync(modulePath), "uiSelfHealingPanel.ts is missing");
    // --- Test 2: buildSelfHealingPanel toimii ---
    const panel = await buildSelfHealingPanel();
    assert(typeof panel === "object", "buildSelfHealingPanel did not return an object");
    // --- Test 3: scaffold on validi ---
    assert(typeof panel.scaffold === "object", "panel.scaffold missing or invalid");
    assert(typeof panel.scaffold.title === "string", "panel.scaffold.title invalid");
    assert(typeof panel.scaffold.style === "object", "panel.scaffold.style invalid");
    assert(typeof panel.scaffold.header === "object", "panel.scaffold.header invalid");
    // --- Test 4: data on validi ---
    assert(typeof panel.data === "object", "panel.data missing or invalid");
    assert(typeof panel.data.plannedActions === "number", "panel.data.plannedActions invalid");
    assert(typeof panel.data.executedDryRunActions === "number", "panel.data.executedDryRunActions invalid");
    assert(typeof panel.data.dryRunAllSuccessful === "boolean", "panel.data.dryRunAllSuccessful invalid");
    assert(typeof panel.data.healthIssues === "number", "panel.data.healthIssues invalid");
    assert(typeof panel.data.requiresManualReview === "boolean", "panel.data.requiresManualReview invalid");
    console.log("✔ All UISelfHealingPanel tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
