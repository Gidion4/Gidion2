// ------------------------------------------------------------
// EVOLUTION RULES PRO
// ------------------------------------------------------------
// Heuristiikat, jotka tunnistavat:
//   - duplikaatit
//   - require()-käytön ESM-moduulissa
//   - käyttämättömät importit (perustaso)
//   - tyhjät funktiot
//   - symbolit ilman käyttöä (pinta-analyysi)
// ------------------------------------------------------------
export function analyzeWithRules(ctx) {
    const issues = [];
    // 1) Duplikaattirivit
    const seen = new Map();
    ctx.lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed)
            return;
        if (seen.has(trimmed)) {
            issues.push({
                id: "duplicate-line",
                severity: "warning",
                message: `Duplicate line: "${trimmed}" (first at line ${seen.get(trimmed)}, again at line ${idx + 1})`,
                line: idx + 1
            });
        }
        else {
            seen.set(trimmed, idx + 1);
        }
    });
    // 2) require() ESM-moduulissa
    ctx.lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.includes("require(")) {
            issues.push({
                id: "esm-require",
                severity: "error",
                message: `require() detected in ESM module: "${trimmed}"`,
                line: idx + 1
            });
        }
    });
    // 3) Importit ilman exportteja
    if (ctx.imports.length > 0 && ctx.exports.length === 0) {
        issues.push({
            id: "imports-no-exports",
            severity: "warning",
            message: "Module imports symbols but does not export anything."
        });
    }
    // 4) Tyhjät funktiot
    ctx.lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.match(/^export function .*{\s*}$/)) {
            issues.push({
                id: "empty-function",
                severity: "warning",
                message: `Empty exported function: "${trimmed}"`,
                line: idx + 1
            });
        }
    });
    // 5) Symbolit ilman käyttöä (pinta-analyysi: nimi ei esiinny muualla kuin määrittelyssä)
    ctx.symbols.forEach((sym) => {
        const occurrences = ctx.code.split(sym.name).length - 1;
        if (occurrences <= 1) {
            issues.push({
                id: "unused-symbol",
                severity: "info",
                message: `Exported symbol "${sym.name}" appears only in its definition (kind: ${sym.kind}).`,
                line: sym.line
            });
        }
    });
    return issues;
}
