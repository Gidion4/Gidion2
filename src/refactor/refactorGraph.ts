// ------------------------------------------------------------
// REFACTOR GRAPH PRO
// ------------------------------------------------------------
// Rakentaa dependency-graafin:
//   - importit
//   - exportit
//   - symbolit
//   - syklit
// ------------------------------------------------------------

import fs from "fs/promises";

export async function buildDependencyGraph(path: string) {
  const code = await fs.readFile(path, "utf8");
  const lines = code.split("\n");

  const imports: string[] = [];
  const exports: string[] = [];
  const symbols: any[] = [];

  lines.forEach((line, idx) => {
    const t = line.trim();

    if (t.startsWith("import ")) imports.push(t);
    if (t.startsWith("export ")) exports.push(t);

    if (t.startsWith("export function ")) {
      symbols.push({ kind: "function", line: idx + 1 });
    }
    if (t.startsWith("export class ")) {
      symbols.push({ kind: "class", line: idx + 1 });
    }
    if (t.startsWith("export interface ")) {
      symbols.push({ kind: "interface", line: idx + 1 });
    }
    if (t.startsWith("export const ")) {
      symbols.push({ kind: "const", line: idx + 1 });
    }
  });

  // Erittäin yksinkertainen syklidetektio (PRO-versio laajennettavissa)
  const cycles = imports.filter((i) => i.includes(path.split("/").pop() || ""));

  return {
    path,
    lines: lines.length,
    imports,
    exports,
    symbols,
    cycles
  };
}
