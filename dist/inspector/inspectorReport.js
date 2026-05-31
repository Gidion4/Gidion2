// ------------------------------------------------------------
// INSPECTOR REPORT BUILDER
// ------------------------------------------------------------
// Muodostaa yhtenäisen raportin Inspector Enginelle.
// ------------------------------------------------------------
export function buildInspectorReport(modulePath, src, patterns) {
    return {
        ok: true,
        module: modulePath,
        issues: patterns,
        summary: `Found ${patterns.length} issue(s) in ${modulePath}`
    };
}
