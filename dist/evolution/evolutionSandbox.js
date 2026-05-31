// ------------------------------------------------------------
// EVOLUTION SANDBOX PRO
// ------------------------------------------------------------
// Generoi patch-ehdotuksia ja kirjoittaa ne .evo-tiedostoon.
// TÄRKEÄÄ:
//   - Ei koskaan koske alkuperäiseen tiedostoon
//   - Kaikki muutokset ovat ehdotuksia, ei automaattisia korjauksia
// ------------------------------------------------------------
import fs from "fs/promises";
export async function runInSandbox(ctx, issues) {
    const patches = [];
    for (const issue of issues) {
        if (issue.id === "esm-require") {
            patches.push({
                issueId: issue.id,
                description: "Replace require() with ESM import.",
                hint: "Use: import X from 'module'; instead of const X = require('module');"
            });
        }
        else if (issue.id === "duplicate-line") {
            patches.push({
                issueId: issue.id,
                description: "Remove or refactor duplicate line.",
                hint: "Keep only one instance of this line, or extract shared logic."
            });
        }
        else if (issue.id === "imports-no-exports") {
            patches.push({
                issueId: issue.id,
                description: "Either export something or remove unused imports.",
                hint: "Check if this module should expose an API or if imports are unnecessary."
            });
        }
        else if (issue.id === "empty-function") {
            patches.push({
                issueId: issue.id,
                description: "Implement or remove empty exported function.",
                hint: "Add logic or remove the function if not needed."
            });
        }
        else if (issue.id === "unused-symbol") {
            patches.push({
                issueId: issue.id,
                description: "Consider removing or using the unused exported symbol.",
                hint: "If this symbol is part of public API, ensure it is used somewhere."
            });
        }
        else {
            patches.push({
                issueId: issue.id,
                description: "General issue detected.",
                hint: issue.message
            });
        }
    }
    const sandboxPath = ctx.path + ".evo";
    const header = "// ------------------------------------------------------------\n" +
        "// GIDION EVOLUTION SANDBOX FILE\n" +
        "// Alkuperäistä tiedostoa EI OLE MUOKATTU.\n" +
        "// Nämä ovat ehdotuksia, ei automaattisia muutoksia.\n" +
        "// ------------------------------------------------------------\n\n";
    const issueBlock = "// Issues:\n" +
        issues
            .map((i) => `// [${i.severity.toUpperCase()}] ${i.id}: ${i.message}${i.line ? " (line " + i.line + ")" : ""}`)
            .join("\n") +
        "\n\n";
    const patchBlock = "// Suggested patches:\n" +
        patches
            .map((p, idx) => `// Patch ${idx + 1} for issue ${p.issueId}:\n//   ${p.description}\n//   Hint: ${p.hint}\n`)
            .join("\n") +
        "\n";
    const newContent = header + issueBlock + patchBlock + "// Original code:\n\n" + ctx.code;
    await fs.writeFile(sandboxPath, newContent, "utf8");
    return { patches, sandboxPath };
}
