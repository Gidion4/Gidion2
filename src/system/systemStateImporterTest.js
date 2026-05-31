// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM STATE IMPORTER TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemStateImporter.ts -moduulin keskeiset toiminnot:
//   - snapshotin lukeminen
//   - snapshotin validointi
//   - virheellisten snapshotien hylkääminen
//   - deterministinen toiminta
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importSystemState } from "./systemStateImporter.ts";
import { exportSystemState } from "./systemStateExporter.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running SystemStateImporter tests...");
    // --- Test 1: systemStateImporter.ts olemassa ---
    const importerPath = path.join(__dirname, "systemStateImporter.ts");
    assert(fs.existsSync(importerPath), "systemStateImporter.ts is missing");
    // --- Test 2: Luodaan snapshot exporteria käyttäen ---
    const testDir = path.join(__dirname, "test_imports");
    const fileName = `snapshot_import_test_${Date.now()}.json`;
    const exportResult = await exportSystemState(testDir, fileName);
    assert(exportResult.success === true, "Failed to export snapshot for import test");
    assert(typeof exportResult.filePath === "string", "Export did not return a file path");
    // --- Test 3: Snapshot voidaan lukea importerilla ---
    const importResult = importSystemState(exportResult.filePath);
    assert(importResult.success === true, "Importer failed to read valid snapshot");
    assert(typeof importResult.data === "object", "Importer did not return snapshot data");
    // --- Test 4: Snapshot sisältää kaikki vaaditut kentät ---
    const requiredKeys = ["timestamp", "manifest", "overview", "health", "diagnostics"];
    for (const key of requiredKeys) {
        assert(Object.prototype.hasOwnProperty.call(importResult.data, key), `Imported snapshot missing key '${key}'`);
    }
    // --- Test 5: Virheellinen snapshot hylätään ---
    const invalidPath = path.join(testDir, "invalid_snapshot.json");
    fs.writeFileSync(invalidPath, JSON.stringify({ foo: "bar" }, null, 2), "utf-8");
    const invalidResult = importSystemState(invalidPath);
    assert(invalidResult.success === false, "Importer accepted invalid snapshot");
    console.log("✔ All SystemStateImporter tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
