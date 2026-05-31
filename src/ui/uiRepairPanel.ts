// ------------------------------------------------------------
// GIDION UI v1 â€” REPAIR ENGINE PANEL v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli rakentaa Repair Engine -dashboard-paneelin,
// joka nÃ¤yttÃ¤Ã¤ korjausmetriikat UI-valmiina rakenteena.
//
// Paneeli kÃ¤yttÃ¤Ã¤ uiPanelScaffold-pohjaa ja yhdistÃ¤Ã¤ siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// TÃ¤mÃ¤ moduuli on tÃ¤ysin framework-agnostinen.
// ------------------------------------------------------------

import { createPanelScaffold } from "./uiPanelScaffold.js";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.js";

export interface UIRepairPanel {
  scaffold: ReturnType<typeof createPanelScaffold>;
  data: {
    plannedActions: number;
    executedSteps: number;
    fullyRepaired: boolean;
  };
}

export async function buildRepairPanel(): Promise<UIRepairPanel> {
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
    console.log("Gidion UI v1 â€” Repair Panel");
    console.log(JSON.stringify(panel, null, 2));
  });
}

