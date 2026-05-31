import { runDeterministicAnalysis } from "./evolution-analysis";
import { buildEvolutionPlan } from "./evolution-planner";
export async function runEvolution3(ctx, inspection, suggestions, moduleMetrics, architectureMap) {
    const analysis = runDeterministicAnalysis(moduleMetrics, architectureMap);
    const plan = buildEvolutionPlan(analysis);
    return plan;
}
