// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM OVERVIEW v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli tuottaa yhteenvedon koko järjestelmän rakenteesta.
//
// Se käyttää systemManifestia ja tuottaa:
//   - moduulilistan
//   - kategoriat
//   - riippuvuuskartan (perustaso)
//   - yhteenvedon, jota UI-kerros voi käyttää
//
// Tämä toimii dokumentaation ja introspektion työkaluna.
// ------------------------------------------------------------
import { systemManifest } from "./systemManifest.ts";
export function generateSystemOverview() {
    // Ryhmitellään kategoriat
    const categoriesMap = {};
    for (const entry of systemManifest) {
        if (!categoriesMap[entry.category]) {
            categoriesMap[entry.category] = [];
        }
        categoriesMap[entry.category].push(entry);
    }
    // Luodaan dependencyMap (perustaso)
    const dependencyMap = {};
    for (const entry of systemManifest) {
        dependencyMap[entry.name] = [];
        for (const other of systemManifest) {
            // Perustason heuristiikka: jos polku sisältää nimen
            if (other.path.includes(entry.name) && other.name !== entry.name) {
                dependencyMap[entry.name].push(other.name);
            }
        }
    }
    const categories = Object.keys(categoriesMap).map((cat) => ({
        category: cat,
        modules: categoriesMap[cat]
    }));
    return {
        totalModules: systemManifest.length,
        categories,
        dependencyMap
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    const overview = generateSystemOverview();
    console.log("Gidion UltraHybrid Level 4 — System Overview");
    console.log("Total modules:", overview.totalModules);
    console.log("\nCategories:");
    for (const cat of overview.categories) {
        console.log(`- ${cat.category}: ${cat.modules.length} modules`);
    }
    console.log("\nDependency Map:");
    console.log(overview.dependencyMap);
}
