// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM INDEX TEST v3 (SAFE + ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemIndex.ts -moduulin keskeiset toiminnot:
//   - tiedoston olemassaolo
//   - exporttien löytyminen
//   - deterministinen rakenne
//
// HUOM: Ei koskaan kutsu process.exit().
//       Palauttaa turvallisen TestReport-olion.
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function safeAssert(condition, name, error) {
    if (condition) {
        return { name, success: true };
    }
    return { name, success: false, error };
}
export async function runSystemIndexTests() {
    const results = [];
    // --- Test 1: systemIndex.ts olemassa ---
    const indexPath = path.join(__dirname, "systemIndex.ts");
    const exists = fs.existsSync(indexPath);
    results.push(safeAssert(exists, "systemIndex.ts exists"));
    // --- Test 2: Import toimii ---
    let indexModule = null;
    try {
        indexModule = await import(`file://${indexPath}`);
        results.push(safeAssert(true, "systemIndex.ts imports successfully"));
    }
    catch (err) {
        results.push(safeAssert(false, "systemIndex.ts imports successfully", err));
    }
    // --- Test 3: Exportit löytyvät ---
    if (indexModule) {
        const expectedExports = [
            "OrganizationKernel",
            "AutonomyLoop",
            "ProjectEngine",
            "AgentCore",
            "AgentOrchestrator"
        ];
        for (const exp of expectedExports) {
            const ok = Object.prototype.hasOwnProperty.call(indexModule, exp);
            results.push(safeAssert(ok, `Export '${exp}' exists`));
        }
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
    runSystemIndexTests().then((report) => {
        console.log("GIDION SYSTEM INDEX TEST v3");
        console.log("---------------------------");
        for (const r of report.results) {
            console.log(`${r.success ? "✔" : "✖"} ${r.name}`);
            if (r.error)
                console.error(r.error);
        }
        console.log(`\nPassed: ${report.passed}`);
        console.log(`Failed: ${report.failed}`);
    });
}
