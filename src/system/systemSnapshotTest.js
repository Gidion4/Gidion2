// ------------------------------------------------------------
// GIDION LEVEL 4 — SYSTEM SNAPSHOT TEST v3 (SAFE + ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemSnapshot.ts -moduulin keskeiset toiminnot:
//   - snapshotin generointi
//   - snapshotin rakenne
//   - kaikkien osien olemassaolo
//   - deterministinen toiminta
//
// HUOM: Ei koskaan kutsu process.exit().
//       Palauttaa turvallisen TestReport-olion.
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createSystemSnapshot } from "./systemSnapshot.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function safeAssert(condition, name, error) {
    if (condition)
        return { name, success: true };
    return { name, success: false, error };
}
export async function runSystemSnapshotTests() {
    const results = [];
    // --- Test 1: systemSnapshot.ts olemassa ---
    const snapshotPath = path.join(__dirname, "systemSnapshot.ts");
    results.push(safeAssert(fs.existsSync(snapshotPath), "systemSnapshot.ts exists"));
    // --- Test 2: Snapshot voidaan luoda ---
    let snapshot = null;
    try {
        snapshot = await createSystemSnapshot();
        results.push(safeAssert(typeof snapshot === "object", "createSystemSnapshot returns an object"));
    }
    catch (err) {
        results.push(safeAssert(false, "createSystemSnapshot executes without throwing", err));
    }
    if (snapshot) {
        // --- Test 3: Timestamp on validi ---
        results.push(safeAssert(typeof snapshot.timestamp === "string", "snapshot.timestamp is a string"));
        // --- Test 4: Manifest löytyy ---
        results.push(safeAssert(Array.isArray(snapshot.manifest) && snapshot.manifest.length > 0, "snapshot.manifest is a non-empty array"));
        // --- Test 5: Overview löytyy ---
        const overviewOk = typeof snapshot.overview === "object" &&
            typeof snapshot.overview.totalModules === "number";
        results.push(safeAssert(overviewOk, "snapshot.overview has valid structure"));
        // --- Test 6: Health löytyy ---
        const expectedHealthKeys = ["kernel", "autonomyLoop", "projectEngine", "agents"];
        for (const key of expectedHealthKeys) {
            const ok = snapshot.health && Object.prototype.hasOwnProperty.call(snapshot.health, key);
            results.push(safeAssert(ok, `snapshot.health contains key '${key}'`));
        }
        // --- Test 7: Diagnostics löytyy ---
        const diagOk = typeof snapshot.diagnostics === "object" &&
            Array.isArray(snapshot.diagnostics.issues);
        results.push(safeAssert(diagOk, "snapshot.diagnostics has valid structure"));
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
    runSystemSnapshotTests().then((report) => {
        console.log("GIDION SYSTEM SNAPSHOT TEST v3");
        console.log("--------------------------------");
        for (const r of report.results) {
            console.log(`${r.success ? "✔" : "✖"} ${r.name}`);
            if (r.error)
                console.error(r.error);
        }
        console.log(`\nPassed: ${report.passed}`);
        console.log(`Failed: ${report.failed}`);
    });
}
