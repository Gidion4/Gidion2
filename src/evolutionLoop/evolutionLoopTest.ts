// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — EVOLUTION LOOP TEST
// ------------------------------------------------------------
// Tämä testaa koko itsekehityssilmukan:
//   - Inspector Engine PRO
//   - Evolution Engine PRO
//   - Codegen Engine PRO
//   - Refactor Engine PRO
//   - Scaling Layer PRO
//
// Testi ei tee muutoksia tuotantokoodiin.
// Kaikki tulokset menevät sandbox-tiedostoihin (.evo / .evo-refactor).
// ------------------------------------------------------------

import { runEvolutionLoop } from "./evolutionLoop.js";
import path from "path";
import { fileURLToPath } from "url";

// Selvitetään projektin juuripolku
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Testattava moduuli (voit vaihtaa tämän mihin tahansa .ts tiedostoon)
const targetModule = path.join(__dirname, "..", "evolution", "evolutionEngine.ts");

async function main() {
  console.log("=== GIDION EVOLUTION LOOP TEST (PRO) ===\n");
  console.log("Analysoidaan moduuli:");
  console.log(" → " + targetModule + "\n");

  const result = await runEvolutionLoop(targetModule);

  console.log("=== INSPECT RESULT ===");
  console.log(JSON.stringify(result.inspect, null, 2), "\n");

  console.log("=== EVOLVE RESULT ===");
  console.log(JSON.stringify(result.evolve, null, 2), "\n");

  console.log("=== CODEGEN RESULT ===");
  console.log(JSON.stringify(result.codegen, null, 2), "\n");

  console.log("=== REFACTOR RESULT ===");
  console.log(JSON.stringify(result.refactor, null, 2), "\n");

  console.log("=== SCALING RESULT ===");
  console.log(JSON.stringify(result.scaling, null, 2), "\n");

  console.log("=== EVOLUTION LOOP COMPLETED ===");
}

main();
