// ------------------------------------------------------------
// REFACTOR RULES PRO
// ------------------------------------------------------------
// Tunnistaa:
//   - sykliset riippuvuudet
//   - liian suuret moduulit
//   - liian monimutkaiset moduulit
//   - moduulit, joilla ei ole selkeää vastuualueetta
// ------------------------------------------------------------

export interface RefactorIssue {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
}

export function analyzeRefactorRules(graph: any): RefactorIssue[] {
  const issues: RefactorIssue[] = [];

  // 1) Sykliset riippuvuudet
  if (graph.cycles.length > 0) {
    issues.push({
      id: "cyclic-dependency",
      message: `Cyclic dependency detected: ${graph.cycles.join(" -> ")}`,
      severity: "error"
    });
  }

  // 2) Liian suuri moduuli
  if (graph.lines > 500) {
    issues.push({
      id: "large-module",
      message: `Module is too large (${graph.lines} lines). Consider splitting.`,
      severity: "warning"
    });
  }

  // 3) Liian monimutkainen moduuli
  if (graph.symbols.length > 40) {
    issues.push({
      id: "complex-module",
      message: `Module contains ${graph.symbols.length} exported symbols. Consider modularization.`,
      severity: "warning"
    });
  }

  // 4) Moduuli ilman selkeää vastuualueetta
  const kinds = new Set(graph.symbols.map((s: any) => s.kind));
  if (kinds.size > 3) {
    issues.push({
      id: "mixed-responsibility",
      message: `Module mixes too many responsibilities (${[...kinds].join(", ")}).`,
      severity: "warning"
    });
  }

  return issues;
}
