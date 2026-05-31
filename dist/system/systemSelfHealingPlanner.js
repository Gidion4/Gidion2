// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 â€” SELF HEALING PLANNER v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli muodostaa self-healing-jÃ¤rjestelmÃ¤n suunnittelukerroksen.
// Se EI tee korjauksia, mutta:
//   - ottaa SelfHealingCore-raportin
//   - muuntaa issue-listan konkreettisiksi korjaussuunnitelmiksi
//   - tuottaa HealingPlan-objektin
// ------------------------------------------------------------
import { analyzeSystemState } from "./systemSelfHealingCore.js";
export async function generateHealingPlan() {
    const report = await analyzeSystemState();
    const actions = [];
    for (const issue of report.issues) {
        const steps = [];
        switch (issue.key) {
            case "kernel":
                steps.push("Inspect kernel logs");
                steps.push("Restart kernel module safely");
                steps.push("Verify kernel dependencies");
                break;
            case "autonomyLoop":
                steps.push("Check autonomy loop scheduler");
                steps.push("Verify event triggers");
                steps.push("Restart autonomy loop subsystem");
                break;
            case "projectEngine":
                steps.push("Inspect project engine initialization");
                steps.push("Verify module dependencies");
                steps.push("Reload project engine");
                break;
            case "agents":
                steps.push("Check agent registry");
                steps.push("Verify agent modules exist");
                steps.push("Reload agent subsystem");
                break;
            case "diagnostics":
                steps.push("Review diagnostics output");
                steps.push("Verify module integrity");
                steps.push("Run module-level healthcheck");
                break;
            default:
                steps.push("General inspection required");
                break;
        }
        actions.push({
            issueKey: issue.key,
            description: issue.description,
            severity: issue.severity,
            steps
        });
    }
    return {
        timestamp: new Date().toISOString(),
        actions,
        requiresManualReview: actions.some(a => a.severity === "high")
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    generateHealingPlan().then((plan) => {
        console.log("Gidion UltraHybrid Level 4 â€” Self Healing Planner");
        console.log("Timestamp:", plan.timestamp);
        console.log("Requires manual review:", plan.requiresManualReview);
        console.log("\nActions:");
        if (plan.actions.length === 0) {
            console.log("âœ” No actions required.");
        }
        else {
            for (const action of plan.actions) {
                console.log(`- [${action.severity}] ${action.issueKey}: ${action.description}`);
                for (const step of action.steps) {
                    console.log(`    â†’ ${step}`);
                }
            }
        }
    });
}
