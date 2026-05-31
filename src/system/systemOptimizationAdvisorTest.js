// ------------------------------------------------------------
// GIDION LEVEL 6 — OPTIMIZATION ADVISOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemOptimizationAdvisor.ts -moduulin keskeiset toiminnot:
//   - generateOptimizationAdvice palauttaa validin objektin
//   - metrics on mukana ja oikeassa muodossa
//   - advice-lista on olemassa ja validi
//   - kaikki kentät ovat deterministisiä ja UI-valmiita
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateOptimizationAdvice } from "./systemOptimizationAdvisor.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running OptimizationAdvisor tests...");
    // --- Test 1: systemOptimizationAdvisor.ts olemassa ---
    const modulePath = path.join(__dirname, "systemOptimizationAdvisor.ts");
    assert(fs.existsSync(modulePath), "systemOptimizationAdvisor.ts is missing");
    // --- Test 2: generateOptimizationAdvice toimii ---
    const advice = await generateOptimizationAdvice();
    assert(typeof advice === "object", "generateOptimizationAdvice did not return an object");
    // --- Test 3: timestamp on validi ---
    assert(typeof advice.timestamp === "string", "timestamp missing or invalid");
    // --- Test 4: metrics on validi ---
    assert(typeof advice.metrics === "object", "metrics missing or invalid");
    // health
    assert(typeof advice.metrics.health === "object", "metrics.health invalid");
    assert(typeof advice.metrics.health.healthy === "boolean", "metrics.health.healthy invalid");
    assert(typeof advice.metrics.health.issues === "number", "metrics.health.issues invalid");
    assert(typeof advice.metrics.health.requiresManualReview === "boolean", "metrics.health.requiresManualReview invalid");
    // selfHealing
    assert(typeof advice.metrics.selfHealing === "object", "metrics.selfHealing invalid");
    assert(typeof advice.metrics.selfHealing.plannedActions === "number", "metrics.selfHealing.plannedActions invalid");
    assert(typeof advice.metrics.selfHealing.executedDryRunActions === "number", "metrics.selfHealing.executedDryRunActions invalid");
    assert(typeof advice.metrics.selfHealing.dryRunAllSuccessful === "boolean", "metrics.selfHealing.dryRunAllSuccessful invalid");
    // repair
    assert(typeof advice.metrics.repair === "object", "metrics.repair invalid");
    assert(typeof advice.metrics.repair.plannedActions === "number", "metrics.repair.plannedActions invalid");
    assert(typeof advice.metrics.repair.executedSteps === "number", "metrics.repair.executedSteps invalid");
    assert(typeof advice.metrics.repair.fullyRepaired === "boolean", "metrics.repair.fullyRepaired invalid");
    // --- Test 5: advice-lista on validi ---
    assert(Array.isArray(advice.advice), "advice.advice is not an array");
    if (advice.advice.length > 0) {
        for (const item of advice.advice) {
            assert(typeof item.key === "string", "advice.key invalid");
            assert(typeof item.description === "string", "advice.description invalid");
            assert(item.recommendedAction === null || typeof item.recommendedAction === "string", "advice.recommendedAction invalid");
            assert(["low", "medium", "high"].includes(item.severity), "advice.severity invalid");
        }
    }
    console.log("✔ All OptimizationAdvisor tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
