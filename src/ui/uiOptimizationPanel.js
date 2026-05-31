// ------------------------------------------------------------
// GIDION UI v1 — OPTIMIZATION PANEL v1
// ------------------------------------------------------------
// Tämä moduuli rakentaa Optimization -dashboard-paneelin,
// joka näyttää optimointimetriikat UI-valmiina rakenteena.
//
// Paneeli käyttää uiPanelScaffold-pohjaa ja yhdistää siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// Tämä moduuli on täysin framework-agnostinen.
// ------------------------------------------------------------
import { createPanelScaffold } from "./uiPanelScaffold.ts";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.ts";
export async function buildOptimizationPanel() {
    const dashboard = await getOptimizationDashboardData();
    const scaffold = createPanelScaffold("Optimization Engine");
    return {
        scaffold,
        data: {
            fullyOptimized: dashboard.status.fullyOptimized,
            adviceCount: dashboard.status.adviceCount,
            executedSteps: dashboard.status.executedSteps
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    buildOptimizationPanel().then((panel) => {
        console.log("Gidion UI v1 — Optimization Panel");
        console.log(JSON.stringify(panel, null, 2));
    });
}
