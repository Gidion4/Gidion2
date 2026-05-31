// ------------------------------------------------------------
// GIDION UI v1 â€” SELF-HEALING PANEL v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli rakentaa Self-Healing -dashboard-paneelin,
// joka nÃ¤yttÃ¤Ã¤ self-healing -metriikat UI-valmiina rakenteena.
//
// Paneeli kÃ¤yttÃ¤Ã¤ uiPanelScaffold-pohjaa ja yhdistÃ¤Ã¤ siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// TÃ¤mÃ¤ moduuli on tÃ¤ysin framework-agnostinen.
// ------------------------------------------------------------
import { createPanelScaffold } from "./uiPanelScaffold.js";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.js";
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
        console.log("Gidion UI v1 â€” Self-Healing Panel");
        console.log(JSON.stringify(panel, null, 2));
    });
}
