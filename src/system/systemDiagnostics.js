// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM DIAGNOSTICS v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli yhdistää:
//   - systemManifestin
//   - systemOverview’n
//   - systemHealthcheckin
//
// ja tuottaa diagnostisen raportin, jota:
//   - UI-kerros voi käyttää
//   - selfHealing-järjestelmä voi analysoida
//   - agentit voivat hyödyntää
// ------------------------------------------------------------
import { systemManifest } from "./systemManifest.ts";
import { generateSystemOverview } from "./systemOverview.ts";
import { runHealthcheck } from "./systemHealthcheck.ts";
export async function runDiagnostics() {
    const overview = generateSystemOverview();
    const health = await runHealthcheck();
    const issues = [];
    // Healthcheck-analyysi
    if (!health.kernel)
        issues.push("Kernel not healthy");
    if (!health.autonomyLoop)
        issues.push("Autonomy loop not running");
    if (!health.projectEngine)
        issues.push("Project engine not functioning");
    if (!health.agents)
        issues.push("No agents registered");
    return {
        timestamp: new Date().toISOString(),
        manifestCount: systemManifest.length,
        categories: overview.categories.map(c => c.category),
        health,
        issues
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runDiagnostics().then((report) => {
        console.log("Gidion UltraHybrid Level 4 — System Diagnostics");
        console.log("Timestamp:", report.timestamp);
        console.log("Manifest entries:", report.manifestCount);
        console.log("Categories:", report.categories.join(", "));
        console.log("\nHealth:");
        console.table(report.health);
        if (report.issues.length === 0) {
            console.log("\n✔ No issues detected.");
        }
        else {
            console.log("\nDetected issues:");
            for (const issue of report.issues)
                console.log(" - " + issue);
        }
    });
}
