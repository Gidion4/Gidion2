// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 6 â€” OPTIMIZATION ADVISOR v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli analysoi OptimizationMetrics-olion ja tuottaa
// turvallisia, whitelistattuja optimointisuosituksia.
//
// Se EI tee muutoksia jÃ¤rjestelmÃ¤Ã¤n.
// Se EI suorita mitÃ¤Ã¤n toimia.
// Se tuottaa vain OptimizationAdvice-olion.
// ------------------------------------------------------------

import { collectOptimizationMetrics, OptimizationMetrics } from "./systemOptimizationMetrics.js";

export interface OptimizationAdviceItem {
  key: string;
  description: string;
  recommendedAction: string | null; // null = ei automaattista toimenpidettÃ¤
  severity: "low" | "medium" | "high";
}

export interface OptimizationAdvice {
  timestamp: string;
  metrics: OptimizationMetrics;
  advice: OptimizationAdviceItem[];
}

export async function generateOptimizationAdvice(): Promise<OptimizationAdvice> {
  const metrics = await collectOptimizationMetrics();
  const advice: OptimizationAdviceItem[] = [];

  // ------------------------------------------------------------
  // 1. Health-based recommendations
  // ------------------------------------------------------------
  if (!metrics.health.healthy) {
    advice.push({
      key: "health.issuesDetected",
      description: "System health is degraded. Issues detected in self-healing core.",
      recommendedAction: "runSelfHealingOrchestration",
      severity: "high"
    });
  }

  if (metrics.health.requiresManualReview) {
    advice.push({
      key: "health.manualReviewRequired",
      description: "Some issues require manual review before automated optimization.",
      recommendedAction: null,
      severity: "medium"
    });
  }

  // ------------------------------------------------------------
  // 2. Self-healing performance
  // ------------------------------------------------------------
  if (!metrics.selfHealing.dryRunAllSuccessful) {
    advice.push({
      key: "selfHealing.dryRunFailures",
      description: "Self-healing dry-run reported failures. Review planned actions.",
      recommendedAction: "runSelfHealingOrchestrator",
      severity: "medium"
    });
  }

  // ------------------------------------------------------------
  // 3. Repair performance
  // ------------------------------------------------------------
  if (!metrics.repair.fullyRepaired) {
    advice.push({
      key: "repair.notFullyRepaired",
      description: "Repair executor did not fully resolve all issues.",
      recommendedAction: "runRepairOrchestration",
      severity: "high"
    });
  }

  // ------------------------------------------------------------
  // 4. Optimization opportunities
  // ------------------------------------------------------------
  if (metrics.selfHealing.plannedActions === 0 && metrics.repair.plannedActions === 0) {
    advice.push({
      key: "optimization.noActions",
      description: "No optimization actions needed. System is stable.",
      recommendedAction: null,
      severity: "low"
    });
  }

  return {
    timestamp: new Date().toISOString(),
    metrics,
    advice
  };
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  generateOptimizationAdvice().then((advice) => {
    console.log("Gidion UltraHybrid Level 6 â€” Optimization Advisor");
    console.log(JSON.stringify(advice, null, 2));
  });
}

