import { runInspection } from "./inspector.js"
import { generateCodeSuggestions } from "./codegen.js"
import { applyPatches } from "./writer.js"
import { printModuleMetrics, computeModuleMetrics } from "./modularity.js"
import { printArchitectureMap, buildArchitectureMap } from "./architecture-map.js"
import { saveEvolutionRecord } from "./evolution-memory.js"
import { runEvolution3 } from "./evolution-engine-3.js"
import { broadcast } from "./server.js"

export interface EvolutionContext {
  goal: string
  scopePaths: string[]
}

async function main() {
  const ctx: EvolutionContext = {
    goal: "Paranna Gidionin arkkitehtuuria ja lisÃ¤Ã¤ itsekehityskykyÃ¤",
    scopePaths: ["src/core", "src/tools"]
  }

  console.log("=== Gidion Evolution Engine 3.0 ===")

  const moduleMetrics = computeModuleMetrics(ctx.scopePaths)
  broadcast("metrics", JSON.stringify(moduleMetrics, null, 2))

  const architectureMap = buildArchitectureMap(ctx.scopePaths)
  broadcast("architecture", JSON.stringify(architectureMap, null, 2))

  const inspection = await runInspection(ctx)

  const suggestions = await generateCodeSuggestions(ctx, inspection)

  const evolutionPlan = await runEvolution3(
    ctx,
    inspection,
    suggestions,
    moduleMetrics,
    architectureMap
  )

  broadcast("evolution", evolutionPlan.planText)
  broadcast("patches", JSON.stringify(evolutionPlan.patches, null, 2))

  saveEvolutionRecord({
    timestamp: new Date().toISOString(),
    moduleMetrics,
    architectureMap,
    inspectionReport: inspection.report,
    codeSuggestions: suggestions.suggestionsText,
    evolutionPlan: evolutionPlan.planText,
    appliedPatches: evolutionPlan.patches.map(p => p.filePath)
  })

  if (evolutionPlan.patches.length === 0) return

  await applyPatches(evolutionPlan.patches)
}

main().catch(err => console.error(err))







