// ------------------------------------------------------------
// GIDION UI v1 â€” SYSTEM STATUS PANEL v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli rakentaa ensimmÃ¤isen oikean dashboard-paneelin,
// joka nÃ¤yttÃ¤Ã¤ jÃ¤rjestelmÃ¤n tilan UI-valmiina rakenteena.
//
// Paneeli kÃ¤yttÃ¤Ã¤ uiPanelScaffold-pohjaa ja yhdistÃ¤Ã¤ siihen
// systemOptimizationDashboardData.ts -moduulin datan.
//
// TÃ¤mÃ¤ moduuli on tÃ¤ysin framework-agnostinen.
// ------------------------------------------------------------

import { createPanelScaffold } from "./uiPanelScaffold.js";
import { getOptimizationDashboardData } from "../system/systemOptimizationDashboardData.js";

export interface UISystemStatusPanel {
  scaffold: ReturnType<typeof createPanelScaffold>;
  data: {
    health: {
      healthy: boolean;
      issues: number;
      requiresManualReview: boolean;
    };
    selfHealing: {
      plannedActions: number;
      executedDryRunActions: number;
      dryRunAllSuccessful: boolean;
    };
    repair: {
      plannedActions: number;
      executedSteps: number;
      fullyRepaired: boolean;
    };
    optimization: {
      fullyOptimized: boolean;
      adviceCount: number;
      executedSteps: number;
    };
  };
}

export async function buildSystemStatusPanel(): Promise<UISystemStatusPanel> {
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
    console.log("Gidion UI v1 â€” System Status Panel");
    console.log(JSON.stringify(panel, null, 2));
  });
}

