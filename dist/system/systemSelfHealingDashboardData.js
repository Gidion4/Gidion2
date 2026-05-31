// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 â€” SELF HEALING DASHBOARD DATA v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli yhdistÃ¤Ã¤ koko self-healing -ketjun datan
// yhdeksi UI-valmiiksi dashboard-rakenteeksi.
//
// Se EI tee logiikkaa, EI tee korjauksia â€” vain muotoilee datan.
//
// Dashboard sisÃ¤ltÃ¤Ã¤:
//   - jÃ¤rjestelmÃ¤n terveystilan yhteenvedon
//   - ongelmalistan
//   - suunnitellut korjaustoimet
//   - dry-run -suoritusraportin
//   - kokonaisarvion
//
// TÃ¤mÃ¤ toimii Gidion UI:n "Self-Healing Dashboard" -paneelin datalÃ¤hteenÃ¤.
// ------------------------------------------------------------
import { runSelfHealingOrchestration } from "./systemSelfHealingOrchestrator.js";
export async function getSelfHealingDashboardData() {
    const orchestration = await runSelfHealingOrchestration();
    return {
        timestamp: orchestration.timestamp,
        systemStatus: {
            healthy: orchestration.coreReport.healthy,
            issueCount: orchestration.coreReport.issues.length,
            requiresManualReview: orchestration.healingPlan.requiresManualReview
        },
        issues: orchestration.coreReport.issues.map(i => ({
            key: i.key,
            description: i.description,
            severity: i.severity
        })),
        plannedActions: orchestration.healingPlan.actions.map(a => ({
            issueKey: a.issueKey,
            severity: a.severity,
            steps: a.steps
        })),
        execution: {
            allSuccessful: orchestration.executionReport.allSuccessful,
            actions: orchestration.executionReport.actions.map(a => ({
                issueKey: a.issueKey,
                severity: a.severity,
                steps: a.results.map(r => ({
                    step: r.step,
                    success: r.success,
                    message: r.message
                }))
            }))
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    getSelfHealingDashboardData().then((data) => {
        console.log("Gidion UltraHybrid Level 4 â€” Self Healing Dashboard Data");
        console.log(JSON.stringify(data, null, 2));
    });
}
