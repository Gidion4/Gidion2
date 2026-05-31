// ------------------------------------------------------------
// INSPECTOR REPORT BUILDER
// ------------------------------------------------------------
// Muodostaa yhtenäisen raportin Inspector Enginelle.
// ------------------------------------------------------------

import { ModuleSource } from "./inspectorModules.js";
import { InspectorPattern } from "./inspectorPatterns.js";

export interface InspectorReport {
  ok: boolean;
  module: string;
  issues: InspectorPattern[];
  summary: string;
}

export function buildInspectorReport(
  modulePath: string,
  src: ModuleSource,
  patterns: InspectorPattern[]
): InspectorReport {
  return {
    ok: true,
    module: modulePath,
    issues: patterns,
    summary: `Found ${patterns.length} issue(s) in ${modulePath}`
  };
}
