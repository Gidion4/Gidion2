// ------------------------------------------------------------
// INSPECTOR PATTERN DETECTOR
// ------------------------------------------------------------
// Tunnistaa:
//   - duplikaatit
//   - require()-kutsut (ESM-varoitus)
//   - käyttämättömät importit
//   - tyhjät funktiot
// ------------------------------------------------------------

import { ModuleSource } from "./inspectorModules.js";

export interface InspectorPattern {
  type: string;
  detail: string;
}

export function detectPatterns(src: ModuleSource): InspectorPattern[] {
  const patterns: InspectorPattern[] = [];

  const seen = new Set<string>();
  for (const line of src.lines) {
    const trimmed = line.trim();

    // Duplikaatit
    if (seen.has(trimmed)) {
      patterns.push({
        type: "duplicate-line",
        detail: trimmed
      });
    }
    seen.add(trimmed);

    // require() ESM-ongelma
    if (trimmed.startsWith("const ") && trimmed.includes("require(")) {
      patterns.push({
        type: "esm-warning",
        detail: "require() detected: " + trimmed
      });
    }

    // Tyhjät funktiot
    if (trimmed.match(/^export function .*{\s*}$/)) {
      patterns.push({
        type: "empty-function",
        detail: trimmed
      });
    }
  }

  // Käyttämättömät importit
  if (src.code.includes("import") && !src.code.includes("export")) {
    patterns.push({
      type: "unused-imports",
      detail: "Module imports but does not export anything."
    });
  }

  return patterns;
}
