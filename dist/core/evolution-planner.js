export function buildEvolutionPlan(analysis) {
    const lines = [];
    lines.push("EVOLUTION ENGINE 3.1");
    lines.push("");
    lines.push("Deterministinen analyysi suoritettu.");
    lines.push("");
    if (analysis.bigFiles.length > 0) {
        lines.push("Refaktorointikandidaatit:");
        for (const f of analysis.bigFiles) {
            lines.push(`- ${f.path} (${f.lines} riviÃ¤)`);
        }
    }
    else {
        lines.push("Ei selvÃ¤sti keskiarvoa suurempia tiedostoja.");
    }
    if (analysis.cycles.length > 0) {
        lines.push("");
        lines.push("Mahdollisia syklisiÃ¤ riippuvuuksia:");
        for (const c of analysis.cycles)
            lines.push(`- ${c}`);
    }
    lines.push("");
    lines.push("TÃ¤ssÃ¤ kierroksessa generoidaan ensimmÃ¤inen konkreettinen patch.");
    lines.push("");
    const patches = [
        {
            filePath: "src/core/README_EVOLUTION.md",
            action: "create",
            newContent: `# Gidion Evolution Notes

TÃ¤mÃ¤ tiedosto luotiin Evolution Engine 3.1:n toimesta.

Seuraavat tiedostot ovat refaktorointikandidaatteja:

${analysis.bigFiles.map(f => `- ${f.path} (${f.lines} riviÃ¤)`).join("\n")}

Sykliset riippuvuudet:

${analysis.cycles.length > 0 ? analysis.cycles.join("\n") : "Ei havaittu."}
`
        }
    ];
    return {
        planText: lines.join("\n"),
        patches
    };
}
