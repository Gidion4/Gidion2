// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — EVOLUTION ENGINE
// ------------------------------------------------------------
// Vastaa koko evoluutioprosessin orkestroinnista:
//   1) Kontekstin rakentaminen (koodi, symbolit, importit/exportit)
//   2) Heuristinen analyysi (evolutionRules)
//   3) Patch-ehdotusten generointi (sandbox)
//   4) Turvallinen, ei-destruktiivinen kirjoitus .evo-tiedostoon
// ------------------------------------------------------------
import { createEvolutionContext } from "./evolutionContext.js";
import { analyzeWithRules } from "./evolutionRules.js";
import { runInSandbox } from "./evolutionSandbox.js";
export async function evolveModule(modulePath) {
    try {
        // 1) Rakenna konteksti
        const ctx = await createEvolutionContext(modulePath);
        // 2) Analysoi heuristiikoilla
        const issues = analyzeWithRules(ctx);
        if (issues.length === 0) {
            return {
                ok: true,
                message: "No evolution needed. Module looks clean.",
                issues,
                patches: []
            };
        }
        // 3) Generoi patch-ehdotukset sandboxissa
        const { patches, sandboxPath } = await runInSandbox(ctx, issues);
        return {
            ok: true,
            message: `Evolution completed with ${patches.length} patch(es).`,
            issues,
            patches,
            sandboxPath
        };
    }
    catch (err) {
        return {
            ok: false,
            message: "Evolution failed: " + (err?.message ?? String(err)),
            issues: [],
            patches: []
        };
    }
}
