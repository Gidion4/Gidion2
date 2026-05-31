// ------------------------------------------------------------
// GIDION UI v1 â€” OPTIMIZATION PANEL v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli rakentaa Optimization -dashboard-paneelin,
// joka nÃ¤yttÃ¤Ã¤ optimointimetriikat UI-valmiina rakenteena.
//
// Paneeli kÃ¤yttÃ¤Ã¤ uiPanelScaffold-pohjaa ja yhdistÃ¤Ã¤ siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// TÃ¤mÃ¤ moduuli on tÃ¤ysin framework-agnostinen.
// ------------------------------------------------------------
import { createPanelScaffold } from "./uiPanelScaffold.js";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.js";
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
        console.log("Gidion UI v1 â€” Optimization Panel");
        console.log(JSON.stringify(panel, null, 2));
    });
}
