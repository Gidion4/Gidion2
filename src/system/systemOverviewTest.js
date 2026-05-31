// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM OVERVIEW TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemOverview.ts -moduulin keskeiset toiminnot:
//   - overview-funktion olemassaolo
//   - kategorioiden löytyminen
//   - dependencyMapin rakenne
//   - deterministinen toiminta
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSystemOverview } from "./systemOverview.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running SystemOverview tests...");
    // --- Test 1: systemOverview.ts olemassa ---
    const overviewPath = path.join(__dirname, "systemOverview.ts");
    assert(fs.existsSync(overviewPath), "systemOverview.ts is missing");
    // --- Test 2: Overview voidaan generoida ---
    const overview = generateSystemOverview();
    assert(typeof overview === "object", "generateSystemOverview did not return an object");
    // --- Test 3: totalModules on validi ---
    assert(typeof overview.totalModules === "number" && overview.totalModules > 0, "totalModules is invalid");
    // --- Test 4: kategoriat löytyvät ---
    assert(Array.isArray(overview.categories), "categories is not an array");
    assert(overview.categories.length > 0, "No categories found in overview");
    // --- Test 5: dependencyMap on validi ---
    assert(typeof overview.dependencyMap === "object", "dependencyMap is not an object");
    for (const key of Object.keys(overview.dependencyMap)) {
        assert(Array.isArray(overview.dependencyMap[key]), `dependencyMap entry '${key}' is not an array`);
    }
    console.log("✔ All SystemOverview tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
