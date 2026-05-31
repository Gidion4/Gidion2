// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 — INSPECTOR ENGINE
// ------------------------------------------------------------
// Inspector Engine analysoi moduuleja ja tuottaa raportin:
//   - anti-patternit
//   - duplikaatit
//   - ESM-ongelmat
//   - käyttämättömät importit
//   - rakenteelliset varoitukset
// ------------------------------------------------------------
import { loadModuleSource } from "./inspectorModules.js";
import { detectPatterns } from "./inspectorPatterns.js";
import { buildInspectorReport } from "./inspectorReport.js";
export async function inspectModule(modulePath) {
    const source = await loadModuleSource(modulePath);
    const patterns = detectPatterns(source);
    const report = buildInspectorReport(modulePath, source, patterns);
    return report;
}
