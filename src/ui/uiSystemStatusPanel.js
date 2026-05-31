// ------------------------------------------------------------
// GIDION UI v1 — SYSTEM STATUS PANEL v1
// ------------------------------------------------------------
// Tämä moduuli rakentaa ensimmäisen oikean dashboard-paneelin,
// joka näyttää järjestelmän tilan UI-valmiina rakenteena.
//
// Paneeli käyttää uiPanelScaffold-pohjaa ja yhdistää siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// Tämä moduuli on täysin framework-agnostinen.
// ------------------------------------------------------------
import { createPanelScaffold } from "./uiPanelScaffold.ts";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.ts";
export async function buildSystemStatusPanel() {
    const dashboard = await getOptimizationDashboardData();
    const scaffold = createPanelScaffold("System Status");
    return {
        scaffold,
        data: {
            health: dashboard.metrics.health,
            selfHealing: dashboard.metrics.selfHealing,
            repair: dashboard.metrics.repair,
            optimization: {
                fullyOptimized: dashboard.status.fullyOptimized,
                adviceCount: dashboard.status.adviceCount,
                executedSteps: dashboard.status.executedSteps
            }
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    buildSystemStatusPanel().then((panel) => {
        console.log("Gidion UI v1 — System Status Panel");
        console.log(JSON.stringify(panel, null, 2));
    });
}
