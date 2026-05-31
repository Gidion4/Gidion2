// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — CODEGEN ENGINE
// ------------------------------------------------------------
// Vastaa:
//   - Patchien generoinnista
//   - Uusien moduulien luonnista
//   - Refaktorointiehdotusten tuottamisesta
//   - Turvallisesta diff-mallin rakentamisesta
// ------------------------------------------------------------
import { buildTemplate } from "./codegenTemplates.js";
import { applyStrategy } from "./codegenStrategies.js";
import { generateDiff } from "./codegenDiff.js";
export async function runCodegen(req) {
    try {
        // 1) Luo perusmalli
        const template = buildTemplate(req);
        // 2) Sovella strategiaa (fix/refactor/new)
        const generated = applyStrategy(req, template);
        // 3) Luo diff alkuperäiseen
        const diff = await generateDiff(req.modulePath, generated);
        return {
            ok: true,
            message: "Codegen completed.",
            generated,
            diff
        };
    }
    catch (err) {
        return {
            ok: false,
            message: "Codegen failed: " + (err?.message ?? String(err)),
            generated: "",
            diff: ""
        };
    }
}
