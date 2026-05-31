// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 6 — OPTIMIZATION ORCHESTRATOR v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli yhdistää koko optimointiketjun:
//
//   1. Metrics → collectOptimizationMetrics()
//   2. Advisor → generateOptimizationAdvice()
//   3. Executor → executeOptimizations()
//
// Se suorittaa vain turvallisia, whitelistattuja toimia.
// Se tuottaa OptimizationOrchestrationReport-olion.
// ------------------------------------------------------------
import { collectOptimizationMetrics } from "./systemOptimizationMetrics.ts";
import { generateOptimizationAdvice } from "./systemOptimizationAdvisor.ts";
import { executeOptimizations } from "./systemOptimizationExecutor.ts";
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
        console.log("Gidion UltraHybrid Level 6 — Optimization Orchestrator");
        console.log("Timestamp:", report.timestamp);
        console.log("Fully optimized:", report.fullyOptimized);
        console.log("\nMetrics:", report.metrics);
        console.log("\nAdvice count:", report.advice.advice.length);
        console.log("\nExecuted steps:", report.execution.steps.length);
    });
}
