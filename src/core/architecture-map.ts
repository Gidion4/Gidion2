import fs from "fs"
import path from "path"

export interface NodeInfo {
  file: string
  imports: string[]
}

export interface ArchitectureMap {
  nodes: NodeInfo[]
  totalFiles: number
}

function collectTsFiles(root: string): string[] {
  const result: string[] = []

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        walk(full)
      } else if (e.isFile() && e.name.endsWith(".ts")) {
        result.push(full)
      }
    }
  }

  walk(root)
  return result
}

function extractImports(content: string): string[] {
  const lines = content.split(/\r?\n/)
  const imports: string[] = []

  for (const line of lines) {
    const m = line.match(/import .* from ["'](.+)["']/)
    if (m) imports.push(m[1])
  }

  return imports
}

export function buildArchitectureMap(roots: string[]): ArchitectureMap {
  const nodes: NodeInfo[] = []

  for (const r of roots) {
    const abs = path.resolve(r)
    const files = collectTsFiles(abs)

    for (const f of files) {
      try {
        const content = fs.readFileSync(f, "utf8")
        const imports = extractImports(content)
        nodes.push({
          file: path.relative(process.cwd(), f),
          imports
        })
      } catch {
        // ignore
      }
    }
  }

  return {
    nodes,
    totalFiles: nodes.length
  }
}

export function printArchitectureMap(roots: string[]) {
  const map = buildArchitectureMap(roots)

  console.log("=== Gidion Architecture Map ===")
  console.log("Total TS files:", map.totalFiles)
  console.log("")

  for (const n of map.nodes) {
    console.log(`FILE: ${n.file}`)
    if (n.imports.length === 0) {
      console.log("  imports: (none)")
    } else {
      for (const i of n.imports) {
        console.log("  →", i)
      }
    }
    console.log("")
  }
}
