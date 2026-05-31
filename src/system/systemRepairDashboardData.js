// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 5 — REPAIR DASHBOARD DATA v1
// ------------------------------------------------------------
// Tämä moduuli muotoilee RepairOrchestratorin datan UI-valmiiksi
// dashboard-rakenteeksi.
//
// Dashboard sisältää:
//   - korjaussuunnitelman yhteenvedon
//   - suoritetut korjaustoimet
//   - onnistumisasteen
//   - kokonaisarvion
//
// Tämä toimii Gidion UI:n "Repair Dashboard" -paneelin datalähteenä.
// ------------------------------------------------------------
import { runRepairOrchestration } from "./systemRepairOrchestrator.ts";
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
        console.log("Gidion UltraHybrid Level 5 — Repair Dashboard Data");
        console.log(JSON.stringify(data, null, 2));
    });
}
