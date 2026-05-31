// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 5 â€” REPAIR ORCHESTRATOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli yhdistÃ¤Ã¤ koko korjausketjun:
//
//   1. Planner â†’ generateHealingPlan()
//   2. RepairExecutor â†’ executeRepairs()
// ------------------------------------------------------------

import { generateHealingPlan } from "./systemSelfHealingPlanner.js";
import { executeRepairs } from "./systemRepairExecutor.js";

export interface RepairOrchestrationReport {
  timestamp: string;
  healingPlan: Awaited<ReturnType<typeof generateHealingPlan>>;
  repairExecution: Awaited<ReturnType<typeof executeRepairs>>;
  fullyRepaired: boolean;
}

export async function runRepairOrchestration(): Promise<RepairOrchestrationReport> {
  const healingPlan = await generateHealingPlan();
  const repairExecution = await executeRepairs();

  return {
    timestamp: new Date().toISOString(),
    healingPlan,
    repairExecution,
    fullyRepaired: repairExecution.allSuccessful
  };
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runRepairOrchestration().then((report) => {
    console.log("Gidion UltraHybrid Level 5 â€” Repair Orchestrator");
    console.log("Timestamp:", report.timestamp);
    console.log("Fully repaired:", report.fullyRepaired);

    console.log("\nPlanned actions:", report.healingPlan.actions.length);
    console.log("Executed steps:", report.repairExecution.steps.length);
  });
}


