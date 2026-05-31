// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — REFACTOR PLANNER (FULL REPLACEMENT)
// ------------------------------------------------------------
// Tämä moduuli luo konkreettisen refaktorointisuunnitelman
// analysoitujen ongelmien perusteella. Suunnitelma ei tee
// muutoksia tuotantokoodiin — se on vain ehdotus, joka
// kirjoitetaan sandboxiin (.evo-refactor).
// ------------------------------------------------------------
export function planRefactor(graph, issues) {
    const plan = [];
    for (const issue of issues) {
        // Sykliset riippuvuudet
        if (issue.id === "cyclic-dependency") {
            plan.push({
                action: "break-cycle",
                detail: "Extract shared logic into a new module to eliminate cyclic dependency."
            });
        }
        // Liian suuri moduuli
        if (issue.id === "large-module") {
            plan.push({
                action: "split-module",
                detail: "Split the module into smaller files grouped by responsibility."
            });
        }
        // Liian monimutkainen moduuli
        if (issue.id === "complex-module") {
            plan.push({
                action: "reduce-symbols",
                detail: "Move some exported symbols into dedicated modules to reduce complexity."
            });
        }
        // Sekalaiset vastuualueet
        if (issue.id === "mixed-responsibility") {
            plan.push({
                action: "separate-concerns",
                detail: "Group related logic and move it into separate modules to improve cohesion."
            });
        }
    }
    return plan;
}
