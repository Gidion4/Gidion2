// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 5 — REPAIR EXECUTOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli suorittaa Plannerin tuottamat korjaustoimet
// käyttäen RepairActionLibraryn sallittuja toimintoja.
//
// Se EI tee mitään vaarallista.
// Se EI suorita toimia, joita ei ole whitelistattu.
// Se tuottaa RepairExecutionReport-olion.
// ------------------------------------------------------------
import { generateHealingPlan } from "./systemSelfHealingPlanner.ts";
import { repairActions } from "./systemRepairActionLibrary.ts";
export async function executeRepairs() {
    const plan = await generateHealingPlan();
    const steps = [];
    for (const action of plan.actions) {
        const actionKey = mapIssueToRepairAction(action.issueKey);
        if (!actionKey) {
            steps.push({
                actionKey: action.issueKey,
                success: false,
                message: "No allowed repair action for this issue"
            });
            continue;
        }
        const repairFn = repairActions[actionKey];
        if (!repairFn) {
            steps.push({
                actionKey,
                success: false,
                message: "Mapped repair action not found in library"
            });
            continue;
        }
        const result = await repairFn();
        steps.push({
            actionKey,
            success: result.success,
            message: result.message
        });
    }
    return {
        timestamp: new Date().toISOString(),
        steps,
        allSuccessful: steps.every(s => s.success)
    };
}
// ------------------------------------------------------------
// Issue → RepairActionLibrary -mapping
// ------------------------------------------------------------
function mapIssueToRepairAction(issueKey) {
    switch (issueKey) {
        case "kernel":
            return "kernel.softReset";
        case "autonomyLoop":
            return "autonomyLoop.restart";
        case "projectEngine":
            return "projectEngine.reload";
        case "agents":
            return "agents.reload";
        case "diagnostics":
            return "diagnostics.recheck";
        default:
            return null;
    }
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    executeRepairs().then((report) => {
        console.log("Gidion UltraHybrid Level 5 — Repair Executor");
        console.log("Timestamp:", report.timestamp);
        console.log("All successful:", report.allSuccessful);
        console.log("\nSteps:");
        for (const step of report.steps) {
            console.log(`- ${step.actionKey}: ${step.message}`);
        }
    });
}
