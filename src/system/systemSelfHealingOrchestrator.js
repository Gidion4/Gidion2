// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SELF HEALING ORCHESTRATOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli yhdistää koko self-healing-ketjun:
//
//   1. Core     → analyzeSystemState()
//   2. Planner  → generateHealingPlan()
//   3. Executor → executeHealingPlanDryRun()
//
// Se EI tee oikeita muutoksia järjestelmään.
// Se tuottaa yhden yhtenäisen SelfHealingOrchestrationReport-objektin.
// ------------------------------------------------------------
import { analyzeSystemState } from "./systemSelfHealingCore.ts";
import { generateHealingPlan } from "./systemSelfHealingPlanner.ts";
import { executeHealingPlanDryRun } from "./systemSelfHealingExecutor.ts";
export async function runSelfHealingOrchestration() {
    const coreReport = await analyzeSystemState();
    const healingPlan = await generateHealingPlan();
    const executionReport = await executeHealingPlanDryRun();
    return {
        timestamp: new Date().toISOString(),
        coreReport,
        healingPlan,
        executionReport,
        fullyHealthy: coreReport.healthy && executionReport.allSuccessful
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runSelfHealingOrchestration().then((report) => {
        console.log("Gidion UltraHybrid Level 4 — Self Healing Orchestrator (Dry Run)");
        console.log("Timestamp:", report.timestamp);
        console.log("Fully healthy:", report.fullyHealthy);
        console.log("\nCore issues:", report.coreReport.issues.length);
        console.log("Planned actions:", report.healingPlan.actions.length);
        console.log("Executed actions:", report.executionReport.actions.length);
    });
}
