// ------------------------------------------------------------
// GIDION LEVEL 6 — OPTIMIZATION ORCHESTRATOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemOptimizationOrchestrator.ts -moduulin keskeiset toiminnot:
//   - runOptimizationOrchestration palauttaa validin raportin
//   - metrics, advice ja execution ovat mukana ja oikeassa muodossa
//   - fullyOptimized on boolean
//   - raportin rakenne on deterministinen ja UI-valmis
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runOptimizationOrchestration } from "./systemOptimizationOrchestrator.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running OptimizationOrchestrator tests...");
    // --- Test 1: systemOptimizationOrchestrator.ts olemassa ---
    const orchestratorPath = path.join(__dirname, "systemOptimizationOrchestrator.ts");
    assert(fs.existsSync(orchestratorPath), "systemOptimizationOrchestrator.ts is missing");
    // --- Test 2: runOptimizationOrchestration toimii ---
    const report = await runOptimizationOrchestration();
    assert(typeof report === "object", "runOptimizationOrchestration did not return an object");
    // --- Test 3: timestamp on validi ---
    assert(typeof report.timestamp === "string", "timestamp missing or invalid");
    // --- Test 4: metrics on validi ---
    assert(typeof report.metrics === "object", "metrics missing or invalid");
    // --- Test 5: advice on validi ---
    assert(typeof report.advice === "object", "advice missing or invalid");
    assert(Array.isArray(report.advice.advice), "advice.advice is not an array");
    // --- Test 6: execution on validi ---
    assert(typeof report.execution === "object", "execution missing or invalid");
    assert(Array.isArray(report.execution.steps), "execution.steps is not an array");
    assert(typeof report.execution.allSuccessful === "boolean", "execution.allSuccessful invalid");
    // --- Test 7: fullyOptimized on boolean ---
    assert(typeof report.fullyOptimized === "boolean", "fullyOptimized is not boolean");
    console.log("✔ All OptimizationOrchestrator tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
