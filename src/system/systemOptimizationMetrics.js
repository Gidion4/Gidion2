// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 6 — OPTIMIZATION METRICS v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli kerää ja normalisoi Gidionin sisäisiä metriikoita
// optimointikerrosta varten.
// ------------------------------------------------------------
import { runSelfHealingOrchestration } from "./systemSelfHealingOrchestrator.ts";
import { runRepairOrchestration } from "./systemRepairOrchestrator.ts";
export async function collectOptimizationMetrics() {
    const selfHealing = await runSelfHealingOrchestration();
    const repair = await runRepairOrchestration();
    return {
        timestamp: new Date().toISOString(),
        health: {
            healthy: selfHealing.coreReport.healthy,
            issues: selfHealing.coreReport.issues.length,
            requiresManualReview: selfHealing.healingPlan.requiresManualReview
        },
        selfHealing: {
            plannedActions: selfHealing.healingPlan.actions.length,
            executedDryRunActions: selfHealing.executionReport.actions.length,
            dryRunAllSuccessful: selfHealing.executionReport.allSuccessful
        },
        repair: {
            plannedActions: repair.healingPlan.actions.length,
            executedSteps: repair.repairExecution.steps.length,
            fullyRepaired: repair.fullyRepaired
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    collectOptimizationMetrics().then((metrics) => {
        console.log("Gidion UltraHybrid Level 6 — Optimization Metrics");
        console.log(JSON.stringify(metrics, null, 2));
    });
}
