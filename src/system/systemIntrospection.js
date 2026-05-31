// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM INTROSPECTION v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli yhdistää:
//   - systemManifestin
//   - systemOverview’n
//   - systemHealthcheckin
//
// ja tarjoaa yhden yhtenäisen introspektio-API:n.
//
// Tämä toimii:
//   - UI-kerroksen tietolähteenä
//   - selfHealing-järjestelmän analyysikerroksena
//   - diagnostiikkatyökalujen perustana
// ------------------------------------------------------------
import { systemManifest } from "./systemManifest.ts";
import { generateSystemOverview } from "./systemOverview.ts";
import { runHealthcheck } from "./systemHealthcheck.ts";
export async function getFullIntrospection() {
    const overview = generateSystemOverview();
    const health = await runHealthcheck();
    return {
        manifest: systemManifest,
        overview,
        health
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    getFullIntrospection().then((data) => {
        console.log("Gidion UltraHybrid Level 4 — Full System Introspection");
        console.log("\nManifest:");
        console.table(data.manifest);
        console.log("\nOverview:");
        console.log("Total modules:", data.overview.totalModules);
        console.log("Categories:", data.overview.categories.map(c => c.category));
        console.log("\nHealth:");
        console.table(data.health);
    });
}
