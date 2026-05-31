// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM SNAPSHOT v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli tuottaa täydellisen snapshotin koko järjestelmän tilasta.
//
// Snapshot sisältää:
//   - manifestin
//   - overview’n
//   - healthcheckin
//   - diagnostics-raportin
//
// Snapshot toimii:
//   - selfHealing-järjestelmän baseline-tilana
//   - UI-kerroksen "System State Viewer" -paneelin datana
// ------------------------------------------------------------
import { systemManifest } from "./systemManifest.ts";
import { generateSystemOverview } from "./systemOverview.ts";
import { runHealthcheck } from "./systemHealthcheck.ts";
import { runDiagnostics } from "./systemDiagnostics.ts";
export async function createSystemSnapshot() {
    const overview = generateSystemOverview();
    const health = await runHealthcheck();
    const diagnostics = await runDiagnostics();
    return {
        timestamp: new Date().toISOString(),
        manifest: systemManifest,
        overview,
        health,
        diagnostics
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    createSystemSnapshot().then((snapshot) => {
        console.log("Gidion UltraHybrid Level 4 — System Snapshot");
        console.log("Timestamp:", snapshot.timestamp);
        console.log("\nManifest entries:", snapshot.manifest.length);
        console.log("Categories:", snapshot.overview.categories.map(c => c.category));
        console.log("\nHealth:");
        console.table(snapshot.health);
        console.log("\nDiagnostics issues:", snapshot.diagnostics.issues);
    });
}
