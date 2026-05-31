// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM HEALTHCHECK TEST v3 (SAFE + ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemHealthcheck.ts -moduulin keskeiset toiminnot:
//   - healthcheck-funktion olemassaolo
//   - raportin rakenne
//   - kenttien validius (ei pakoteta true-arvoa)
//
// HUOM: Ei koskaan kutsu process.exit().
//       Palauttaa turvallisen TestReport-olion.
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runHealthcheck } from "./systemHealthcheck.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function safeAssert(condition, name, error) {
    if (condition)
        return { name, success: true };
    return { name, success: false, error };
}
export async function runSystemHealthcheckTests() {
    const results = [];
    // --- Test 1: systemHealthcheck.ts olemassa ---
    const healthPath = path.join(__dirname, "systemHealthcheck.ts");
    results.push(safeAssert(fs.existsSync(healthPath), "systemHealthcheck.ts exists"));
    // --- Test 2: Healthcheck palauttaa validin raportin ---
    let report = null;
    try {
        report = await runHealthcheck();
        results.push(safeAssert(typeof report === "object", "Healthcheck returns an object"));
    }
    catch (err) {
        results.push(safeAssert(false, "Healthcheck executes without throwing", err));
    }
    // --- Test 3: Raportissa on kaikki odotetut kentät ---
    if (report) {
        const expectedKeys = ["kernel", "autonomyLoop", "projectEngine", "agents"];
        for (const key of expectedKeys) {
            const ok = Object.prototype.hasOwnProperty.call(report, key);
            results.push(safeAssert(ok, `Healthcheck report contains key '${key}'`));
        }
    }
    // HUOM: Emme enää pakota kaikkia kenttiä true-arvoon.
    // Self-healing-järjestelmä tarvitsee realistisia false-arvoja.
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
    runSystemHealthcheckTests().then((report) => {
        console.log("GIDION SYSTEM HEALTHCHECK TEST v3");
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
