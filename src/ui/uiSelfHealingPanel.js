// ------------------------------------------------------------
// GIDION UI v1 — SELF-HEALING PANEL v1
// ------------------------------------------------------------
// Tämä moduuli rakentaa Self-Healing -dashboard-paneelin,
// joka näyttää self-healing -metriikat UI-valmiina rakenteena.
//
// Paneeli käyttää uiPanelScaffold-pohjaa ja yhdistää siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// Tämä moduuli on täysin framework-agnostinen.
// ------------------------------------------------------------
import { createPanelScaffold } from "./uiPanelScaffold.ts";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.ts";
export async function buildSelfHealingPanel() {
    const dashboard = await getOptimizationDashboardData();
    const scaffold = createPanelScaffold("Self-Healing Engine");
    return {
        scaffold,
        data: {
            plannedActions: dashboard.metrics.selfHealing.plannedActions,
            executedDryRunActions: dashboard.metrics.selfHealing.executedDryRunActions,
            dryRunAllSuccessful: dashboard.metrics.selfHealing.dryRunAllSuccessful,
            healthIssues: dashboard.metrics.health.issues,
            requiresManualReview: dashboard.metrics.health.requiresManualReview
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    buildSelfHealingPanel().then((panel) => {
        console.log("Gidion UI v1 — Self-Healing Panel");
        console.log(JSON.stringify(panel, null, 2));
    });
}
