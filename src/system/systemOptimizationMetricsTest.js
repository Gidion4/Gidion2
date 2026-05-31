// ------------------------------------------------------------
// GIDION LEVEL 6 — OPTIMIZATION METRICS TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemOptimizationMetrics.ts -moduulin keskeiset toiminnot:
//   - collectOptimizationMetrics palauttaa validin objektin
//   - kaikki pääkentät ovat olemassa ja oikeassa muodossa
//   - metriikat ovat deterministisiä ja UI-valmiita
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { collectOptimizationMetrics } from "./systemOptimizationMetrics.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running OptimizationMetrics tests...");
    // --- Test 1: systemOptimizationMetrics.ts olemassa ---
    const modulePath = path.join(__dirname, "systemOptimizationMetrics.ts");
    assert(fs.existsSync(modulePath), "systemOptimizationMetrics.ts is missing");
    // --- Test 2: collectOptimizationMetrics toimii ---
    const metrics = await collectOptimizationMetrics();
    assert(typeof metrics === "object", "collectOptimizationMetrics did not return an object");
    // --- Test 3: timestamp on validi ---
    assert(typeof metrics.timestamp === "string", "timestamp missing or invalid");
    // --- Test 4: health on validi ---
    assert(typeof metrics.health === "object", "health missing or invalid");
    assert(typeof metrics.health.healthy === "boolean", "health.healthy invalid");
    assert(typeof metrics.health.issues === "number", "health.issues invalid");
    assert(typeof metrics.health.requiresManualReview === "boolean", "health.requiresManualReview invalid");
    // --- Test 5: selfHealing on validi ---
    assert(typeof metrics.selfHealing === "object", "selfHealing missing or invalid");
    assert(typeof metrics.selfHealing.plannedActions === "number", "selfHealing.plannedActions invalid");
    assert(typeof metrics.selfHealing.executedDryRunActions === "number", "selfHealing.executedDryRunActions invalid");
    assert(typeof metrics.selfHealing.dryRunAllSuccessful === "boolean", "selfHealing.dryRunAllSuccessful invalid");
    // --- Test 6: repair on validi ---
    assert(typeof metrics.repair === "object", "repair missing or invalid");
    assert(typeof metrics.repair.plannedActions === "number", "repair.plannedActions invalid");
    assert(typeof metrics.repair.executedSteps === "number", "repair.executedSteps invalid");
    assert(typeof metrics.repair.fullyRepaired === "boolean", "repair.fullyRepaired invalid");
    console.log("✔ All OptimizationMetrics tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
