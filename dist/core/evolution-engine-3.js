import { runDeterministicAnalysis } from "./evolution-analysis.js";
import { buildEvolutionPlan } from "./evolution-planner.js";
export async function runEvolution3(ctx, inspection, suggestions, moduleMetrics, architectureMap) {
    const analysis = runDeterministicAnalysis(moduleMetrics, architectureMap);
    const plan = buildEvolutionPlan(analysis);
    return plan;
}
