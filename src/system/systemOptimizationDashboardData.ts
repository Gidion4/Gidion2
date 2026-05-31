// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 6 â€” OPTIMIZATION DASHBOARD DATA v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------

import { runOptimizationOrchestration } from "./systemOptimizationOrchestrator.js";

export interface OptimizationDashboardData {
  timestamp: string;

  status: {
    fullyOptimized: boolean;
    adviceCount: number;
    executedSteps: number;
  };

  metrics: {
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
  };

  advice: {
    key: string;
    description: string;
    recommendedAction: string | null;
    severity: string;
  }[];

  execution: {
    actionKey: string;
    success: boolean;
    message: string;
  }[];
}

export async function getOptimizationDashboardData(): Promise<OptimizationDashboardData> {
  const orchestration = await runOptimizationOrchestration();

  return {
    timestamp: orchestration.timestamp,

    status: {
      fullyOptimized: orchestration.fullyOptimized,
      adviceCount: orchestration.advice.advice.length,
      executedSteps: orchestration.execution.steps.length
    },

    metrics: {
      health: {
        healthy: orchestration.metrics.health.healthy,
        issues: orchestration.metrics.health.issues,
        requiresManualReview: orchestration.metrics.health.requiresManualReview
      },
      selfHealing: {
        plannedActions: orchestration.metrics.selfHealing.plannedActions,
        executedDryRunActions: orchestration.metrics.selfHealing.executedDryRunActions,
        dryRunAllSuccessful: orchestration.metrics.selfHealing.dryRunAllSuccessful
      },
      repair: {
        plannedActions: orchestration.metrics.repair.plannedActions,
        executedSteps: orchestration.metrics.repair.executedSteps,
        fullyRepaired: orchestration.metrics.repair.fullyRepaired
      }
    },

    advice: orchestration.advice.advice.map(a => ({
      key: a.key,
      description: a.description,
      recommendedAction: a.recommendedAction,
      severity: a.severity
    })),

    execution: orchestration.execution.steps.map(s => ({
      actionKey: s.actionKey,
      success: s.success,
      message: s.message
    }))
  };
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  getOptimizationDashboardData().then((data) => {
    console.log("Gidion UltraHybrid Level 6 â€” Optimization Dashboard Data");
    console.log(JSON.stringify(data, null, 2));
  });
}


