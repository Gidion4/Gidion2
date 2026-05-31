// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM STATE MANAGER TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemStateManager.ts -moduulin keskeiset toiminnot:
//   - saveState luo snapshotin
//   - loadState lukee snapshotin
//   - virheelliset polut hylätään
//   - deterministinen toiminta
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { saveState, loadState } from "./systemStateManager.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running SystemStateManager tests...");
    // --- Test 1: systemStateManager.ts olemassa ---
    const managerPath = path.join(__dirname, "systemStateManager.ts");
    assert(fs.existsSync(managerPath), "systemStateManager.ts is missing");
    // --- Test 2: saveState luo snapshotin ---
    const testDir = path.join(__dirname, "test_state_manager");
    const fileName = `state_manager_test_${Date.now()}.json`;
    const saveResult = await saveState(testDir, fileName);
    assert(saveResult.success === true, "saveState did not succeed");
    assert(typeof saveResult.filePath === "string", "saveState did not return a file path");
    assert(fs.existsSync(saveResult.filePath), "Saved snapshot file does not exist");
    // --- Test 3: loadState lukee snapshotin ---
    const loadResult = loadState(saveResult.filePath);
    assert(loadResult.success === true, "loadState failed to read valid snapshot");
    assert(typeof loadResult.data === "object", "loadState did not return snapshot data");
    // --- Test 4: Virheellinen polku hylätään ---
    const invalidResult = loadState("nonexistent_file_12345.json");
    assert(invalidResult.success === false, "loadState accepted invalid file path");
    console.log("✔ All SystemStateManager tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
