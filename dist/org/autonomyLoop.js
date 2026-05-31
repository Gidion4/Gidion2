// ------------------------------------------------------------
// GIDION LEVEL 3 — AUTONOMY LOOP v3 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä kerros:
//   1) Muuntaa goal → pipeline (taskPlanner)
//   2) Suorittaa pipelineEngine:n kautta
//   3) Palauttaa yhtenäisen tulosobjektin
// ------------------------------------------------------------
import { planGoal } from "./taskPlanner.js";
import { runPipeline } from "../brain/pipelineEngine.js";
export async function runAutonomyLoop(goal, input = {}) {
    // 1) Luo pipeline goalin perusteella
    const pipeline = planGoal(goal);
    // 2) Suorita pipeline
    const result = await runPipeline(pipeline, input);
    // 3) Palauta yhtenäinen tulosobjekti
    return {
        ok: result.ok,
        message: "Autonomy loop completed.",
        pipelineId: pipeline.id,
        output: result.result
    };
}
