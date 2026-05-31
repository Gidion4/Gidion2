// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 5 — REPAIR ORCHESTRATOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli yhdistää koko korjausketjun:
//
//   1. Planner → generateHealingPlan()
//   2. RepairExecutor → executeRepairs()
// ------------------------------------------------------------
import { generateHealingPlan } from "./systemSelfHealingPlanner.ts";
import { executeRepairs } from "./systemRepairExecutor.ts";
export async function runRepairOrchestration() {
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
        console.log("Gidion UltraHybrid Level 5 — Repair Orchestrator");
        console.log("Timestamp:", report.timestamp);
        console.log("Fully repaired:", report.fullyRepaired);
        console.log("\nPlanned actions:", report.healingPlan.actions.length);
        console.log("Executed steps:", report.repairExecution.steps.length);
    });
}
