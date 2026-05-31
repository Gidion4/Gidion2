// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 â€” SYSTEM OVERVIEW v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli tuottaa yhteenvedon koko jÃ¤rjestelmÃ¤n rakenteesta.
//
// Se kÃ¤yttÃ¤Ã¤ systemManifestia ja tuottaa:
//   - moduulilistan
//   - kategoriat
//   - riippuvuuskartan (perustaso)
//   - yhteenvedon, jota UI-kerros voi kÃ¤yttÃ¤Ã¤
//
// TÃ¤mÃ¤ toimii dokumentaation ja introspektion tyÃ¶kaluna.
// ------------------------------------------------------------

import { systemManifest, ManifestEntry } from "./systemManifest.js";

export interface OverviewCategory {
  category: string;
  modules: ManifestEntry[];
}

export interface SystemOverview {
  totalModules: number;
  categories: OverviewCategory[];
  dependencyMap: Record<string, string[]>;
}

export function generateSystemOverview(): SystemOverview {
  // RyhmitellÃ¤Ã¤n kategoriat
  const categoriesMap: Record<string, ManifestEntry[]> = {};

  for (const entry of systemManifest) {
    if (!categoriesMap[entry.category]) {
      categoriesMap[entry.category] = [];
    }
    categoriesMap[entry.category].push(entry);
  }

  // Luodaan dependencyMap (perustaso)
  const dependencyMap: Record<string, string[]> = {};
  for (const entry of systemManifest) {
    dependencyMap[entry.name] = [];

    for (const other of systemManifest) {
      // Perustason heuristiikka: jos polku sisÃ¤ltÃ¤Ã¤ nimen
      if (other.path.includes(entry.name) && other.name !== entry.name) {
        dependencyMap[entry.name].push(other.name);
      }
    }
  }

  const categories: OverviewCategory[] = Object.keys(categoriesMap).map((cat) => ({
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
  console.log("Gidion UltraHybrid Level 4 â€” System Overview");
  console.log("Total modules:", overview.totalModules);
  console.log("\nCategories:");
  for (const cat of overview.categories) {
    console.log(`- ${cat.category}: ${cat.modules.length} modules`);
  }
  console.log("\nDependency Map:");
  console.log(overview.dependencyMap);
}


