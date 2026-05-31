import { EvolutionContext } from "./agent-engine.js"
import { runDeterministicAnalysis } from "./evolution-analysis.js"
import { buildEvolutionPlan, EvolutionPlan3 } from "./evolution-planner.js"

interface InspectionResult { report: string }
interface CodeSuggestionsResult { suggestionsText: string }
interface ModuleMetrics {
  totalFiles: number
  totalLines: number
  avgLinesPerFile: number
  largestFiles: { path: string; lines: number }[]
}
interface ArchitectureMap {
  nodes: { file: string; imports: string[] }[]
  totalFiles: number
}

export async function runEvolution3(
  ctx: EvolutionContext,
  inspection: InspectionResult,
  suggestions: CodeSuggestionsResult,
  moduleMetrics: ModuleMetrics,
  architectureMap: ArchitectureMap
): Promise<EvolutionPlan3> {

  const analysis = runDeterministicAnalysis(moduleMetrics, architectureMap)
  const plan = buildEvolutionPlan(analysis)
  return plan
}

