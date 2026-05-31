// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 5 â€” REPAIR DASHBOARD DATA v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli muotoilee RepairOrchestratorin datan UI-valmiiksi
// dashboard-rakenteeksi.
//
// Dashboard sisÃ¤ltÃ¤Ã¤:
//   - korjaussuunnitelman yhteenvedon
//   - suoritetut korjaustoimet
//   - onnistumisasteen
//   - kokonaisarvion
//
// TÃ¤mÃ¤ toimii Gidion UI:n "Repair Dashboard" -paneelin datalÃ¤hteenÃ¤.
// ------------------------------------------------------------
import { runRepairOrchestration } from "./systemRepairOrchestrator.js";
export async function getRepairDashboardData() {
    const orchestration = await runRepairOrchestration();
    return {
        timestamp: orchestration.timestamp,
        repairStatus: {
            fullyRepaired: orchestration.fullyRepaired,
            plannedActions: orchestration.healingPlan.actions.length,
            executedSteps: orchestration.repairExecution.steps.length
        },
        planned: orchestration.healingPlan.actions.map(a => ({
            issueKey: a.issueKey,
            severity: a.severity,
            steps: a.steps
        })),
        executed: orchestration.repairExecution.steps.map(s => ({
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
    getRepairDashboardData().then((data) => {
        console.log("Gidion UltraHybrid Level 5 â€” Repair Dashboard Data");
        console.log(JSON.stringify(data, null, 2));
    });
}
