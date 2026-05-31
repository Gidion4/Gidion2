// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — REFACTOR ENGINE
// ------------------------------------------------------------
// Vastaa koko refaktorointiprosessista:
//   1) Dependency-graafin rakentaminen
//   2) Refaktorointisääntöjen soveltaminen
//   3) Refaktorointisuunnitelman luonti
//   4) Turvallinen ehdotusmalli (.evo-refactor)
// ------------------------------------------------------------
import { buildDependencyGraph } from "./refactorGraph.js";
import { analyzeRefactorRules } from "./refactorRules.js";
import { planRefactor } from "./refactorPlanner.js";
import fs from "fs/promises";
export async function runRefactor(modulePath) {
    try {
        // 1) Rakenna dependency-graafi
        const graph = await buildDependencyGraph(modulePath);
        // 2) Analysoi refaktorointisäännöt
        const issues = analyzeRefactorRules(graph);
        // 3) Luo refaktorointisuunnitelma
        const plan = planRefactor(graph, issues);
        // 4) Kirjoita ehdotukset .evo-refactor tiedostoon
        const outPath = modulePath + ".evo-refactor";
        const content = "// GIDION REFACTOR SANDBOX (PRO)\n" +
            "// Alkuperäistä tiedostoa EI OLE MUOKATTU.\n\n" +
            "// Issues:\n" +
            issues.map((i) => `// - ${i.message}`).join("\n") +
            "\n\n// Plan:\n" +
            plan.map((p) => `// - ${p.action}: ${p.detail}`).join("\n");
        await fs.writeFile(outPath, content, "utf8");
        return {
            ok: true,
            message: "Refactor analysis completed.",
            issues,
            plan,
            outputPath: outPath
        };
    }
    catch (err) {
        return {
            ok: false,
            message: "Refactor failed: " + (err?.message ?? String(err)),
            issues: [],
            plan: []
        };
    }
}
