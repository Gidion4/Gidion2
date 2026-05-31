// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 â€” SELF HEALING ORCHESTRATOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli yhdistÃ¤Ã¤ koko self-healing-ketjun:
//
//   1. Core     â†’ analyzeSystemState()
//   2. Planner  â†’ generateHealingPlan()
//   3. Executor â†’ executeHealingPlanDryRun()
//
// Se EI tee oikeita muutoksia jÃ¤rjestelmÃ¤Ã¤n.
// Se tuottaa yhden yhtenÃ¤isen SelfHealingOrchestrationReport-objektin.
// ------------------------------------------------------------

import { analyzeSystemState } from "./systemSelfHealingCore.js";
import { generateHealingPlan } from "./systemSelfHealingPlanner.js";
import { executeHealingPlanDryRun } from "./systemSelfHealingExecutor.js";

export interface SelfHealingOrchestrationReport {
  timestamp: string;
  coreReport: Awaited<ReturnType<typeof analyzeSystemState>>;
  healingPlan: Awaited<ReturnType<typeof generateHealingPlan>>;
  executionReport: Awaited<ReturnType<typeof executeHealingPlanDryRun>>;
  fullyHealthy: boolean;
}

export async function runSelfHealingOrchestration(): Promise<SelfHealingOrchestrationReport> {
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
    console.log("Gidion UltraHybrid Level 4 â€” Self Healing Orchestrator (Dry Run)");
    console.log("Timestamp:", report.timestamp);
    console.log("Fully healthy:", report.fullyHealthy);

    console.log("\nCore issues:", report.coreReport.issues.length);
    console.log("Planned actions:", report.healingPlan.actions.length);
    console.log("Executed actions:", report.executionReport.actions.length);
  });
}


