export interface AnalysisResult {
  bigFiles: { path: string; lines: number }[]
  cycles: string[]
}

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

export function runDeterministicAnalysis(
  moduleMetrics: ModuleMetrics,
  architectureMap: ArchitectureMap
): AnalysisResult {
  const avg = moduleMetrics.avgLinesPerFile
  const bigFiles = moduleMetrics.largestFiles.filter(f => f.lines > avg * 1.5)

  const graph = new Map<string, string[]>()
  for (const n of architectureMap.nodes) {
    graph.set(n.file, n.imports)
  }

  const cycles: string[] = []
  const visited = new Set<string>()
  const stack = new Set<string>()

  function dfs(node: string, path: string[]) {
    if (stack.has(node)) {
      cycles.push([...path, node].join(" -> "))
      return
    }
    if (visited.has(node)) return
    visited.add(node)
    stack.add(node)
    for (const nb of graph.get(node) || []) {
      dfs(nb, [...path, nb])
    }
    stack.delete(node)
  }

  for (const n of graph.keys()) {
    dfs(n, [n])
  }

  return { bigFiles, cycles }
}
