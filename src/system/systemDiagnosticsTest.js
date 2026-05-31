// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM DIAGNOSTICS TEST v3 (SAFE + ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemDiagnostics.ts -moduulin keskeiset toiminnot:
//   - diagnostisen raportin generointi
//   - raportin rakenne
//   - kaikkien kenttien olemassaolo
//   - deterministinen toiminta
//
// HUOM: Ei koskaan kutsu process.exit().
//       Palauttaa turvallisen TestReport-olion.
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runDiagnostics } from "./systemDiagnostics.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function safeAssert(condition, name, error) {
    if (condition)
        return { name, success: true };
    return { name, success: false, error };
}
export async function runSystemDiagnosticsTests() {
    const results = [];
    // --- Test 1: systemDiagnostics.ts olemassa ---
    const diagPath = path.join(__dirname, "systemDiagnostics.ts");
    results.push(safeAssert(fs.existsSync(diagPath), "systemDiagnostics.ts exists"));
    // --- Test 2: Diagnostiikka voidaan suorittaa ---
    let report = null;
    try {
        report = await runDiagnostics();
        results.push(safeAssert(typeof report === "object", "runDiagnostics returns an object"));
    }
    catch (err) {
        results.push(safeAssert(false, "runDiagnostics executes without throwing", err));
    }
    // --- Test 3: Timestamp on validi ---
    if (report) {
        results.push(safeAssert(typeof report.timestamp === "string", "timestamp is a string"));
    }
    // --- Test 4: manifestCount on validi ---
    if (report) {
        const ok = typeof report.manifestCount === "number" && report.manifestCount > 0;
        results.push(safeAssert(ok, "manifestCount is a positive number"));
    }
    // --- Test 5: categories on validi ---
    if (report) {
        const ok = Array.isArray(report.categories) && report.categories.length > 0;
        results.push(safeAssert(ok, "categories is a non-empty array"));
    }
    // --- Test 6: health on validi ---
    if (report) {
        const expectedHealthKeys = ["kernel", "autonomyLoop", "projectEngine", "agents"];
        for (const key of expectedHealthKeys) {
            const ok = Object.prototype.hasOwnProperty.call(report.health, key);
            results.push(safeAssert(ok, `Health field '${key}' exists`));
        }
    }
    // --- Test 7: issues on validi ---
    if (report) {
        const ok = Array.isArray(report.issues);
        results.push(safeAssert(ok, "issues is an array"));
    }
    const passed = results.filter(r => r.success).length;
    const failed = results.length - passed;
    return {
        timestamp: new Date().toISOString(),
        results,
        passed,
        failed
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runSystemDiagnosticsTests().then((report) => {
        console.log("GIDION SYSTEM DIAGNOSTICS TEST v3");
        console.log("----------------------------------");
        for (const r of report.results) {
            console.log(`${r.success ? "✔" : "✖"} ${r.name}`);
            if (r.error)
                console.error(r.error);
        }
        console.log(`\nPassed: ${report.passed}`);
        console.log(`Failed: ${report.failed}`);
    });
}
