// ------------------------------------------------------------
// GIDION UI v1 — REPAIR ENGINE PANEL v1
// ------------------------------------------------------------
// Tämä moduuli rakentaa Repair Engine -dashboard-paneelin,
// joka näyttää korjausmetriikat UI-valmiina rakenteena.
//
// Paneeli käyttää uiPanelScaffold-pohjaa ja yhdistää siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// Tämä moduuli on täysin framework-agnostinen.
// ------------------------------------------------------------
import { createPanelScaffold } from "./uiPanelScaffold.ts";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.ts";
export async function buildRepairPanel() {
    const dashboard = await getOptimizationDashboardData();
    const scaffold = createPanelScaffold("Repair Engine");
    return {
        scaffold,
        data: {
            plannedActions: dashboard.metrics.repair.plannedActions,
            executedSteps: dashboard.metrics.repair.executedSteps,
            fullyRepaired: dashboard.metrics.repair.fullyRepaired
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    buildRepairPanel().then((panel) => {
        console.log("Gidion UI v1 — Repair Panel");
        console.log(JSON.stringify(panel, null, 2));
    });
}
