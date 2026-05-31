// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 6 â€” OPTIMIZATION ORCHESTRATOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli yhdistÃ¤Ã¤ koko optimointiketjun:
//
//   1. Metrics â†’ collectOptimizationMetrics()
//   2. Advisor â†’ generateOptimizationAdvice()
//   3. Executor â†’ executeOptimizations()
//
// Se suorittaa vain turvallisia, whitelistattuja toimia.
// Se tuottaa OptimizationOrchestrationReport-olion.
// ------------------------------------------------------------
import { collectOptimizationMetrics } from "./systemOptimizationMetrics.js";
import { generateOptimizationAdvice } from "./systemOptimizationAdvisor.js";
import { executeOptimizations } from "./systemOptimizationExecutor.js";
export async function runOptimizationOrchestration() {
    const metrics = await collectOptimizationMetrics();
    const advice = await generateOptimizationAdvice();
    const execution = await executeOptimizations();
    return {
        timestamp: new Date().toISOString(),
        metrics,
        advice,
        execution,
        fullyOptimized: execution.allSuccessful
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runOptimizationOrchestration().then((report) => {
        console.log("Gidion UltraHybrid Level 6 â€” Optimization Orchestrator");
        console.log("Timestamp:", report.timestamp);
        console.log("Fully optimized:", report.fullyOptimized);
        console.log("\nMetrics:", report.metrics);
        console.log("\nAdvice count:", report.advice.advice.length);
        console.log("\nExecuted steps:", report.execution.steps.length);
    });
}
