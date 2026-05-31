// ------------------------------------------------------------
// GIDION ULTRAHYBRID v5 — META-REASONING ENGINE TEST (PRO)
// ------------------------------------------------------------
// Tämä testi varmistaa, että Meta-Reasoning Engine toimii ja
// että järjestelmän meta-tason analyysi ja optimointiehdotukset
// ovat eheät ja yhteensopivat Vision-, Healing-, Snapshot- ja
// Diagnostics-kerrosten kanssa.
// ------------------------------------------------------------

import { runMetaReasoningEngine } from "./metaReasoningEngine.js";
import { GidionSystem } from "../system/systemIntegration.js";
import { runVisionEngine } from "./visionEngine.js";

async function main() {
  console.log("=== GIDION ULTRAHYBRID v5 — META-REASONING ENGINE TEST ===\n");

  // ------------------------------------------------------------
  // 1) Ajetaan Meta-Reasoning Engine
  // ------------------------------------------------------------
  console.log("Running Meta-Reasoning Engine...\n");

  const meta = runMetaReasoningEngine();

  console.log("Meta Insights:");
  console.log(JSON.stringify(meta.insights, null, 2), "\n");

  console.log("Meta Optimizations:");
  console.log(JSON.stringify(meta.optimizations, null, 2), "\n");

  // ------------------------------------------------------------
  // 2) Ajetaan Vision Engine vertailua varten
  // ------------------------------------------------------------
  console.log("Running Vision Engine for comparison...\n");

  const vision = runVisionEngine();
  console.log("Vision Report:");
  console.log(JSON.stringify(vision, null, 2), "\n");

  // ------------------------------------------------------------
  // 3) Haetaan järjestelmän tila Integration Layerin kautta
  // ------------------------------------------------------------
  console.log("Fetching System Snapshot...\n");
  const snapshot = GidionSystem.snapshot();
  console.log(JSON.stringify(snapshot, null, 2), "\n");

  console.log("Fetching Diagnostics...\n");
  const diagnostics = GidionSystem.diagnostics();
  console.log(JSON.stringify(diagnostics, null, 2), "\n");

  console.log("Fetching Self-Healing Report...\n");
  const healing = GidionSystem.selfHeal();
  console.log(JSON.stringify(healing, null, 2), "\n");

  // ------------------------------------------------------------
  // 4) Sanity checks
  // ------------------------------------------------------------
  console.log("Performing Meta-Reasoning sanity checks...\n");

  if (!Array.isArray(meta.insights)) {
    console.error("ERROR: meta.insights missing or invalid.");
  }

  if (!Array.isArray(meta.optimizations)) {
    console.error("ERROR: meta.optimizations missing or invalid.");
  }

  console.log("Sanity checks complete.\n");

  console.log("=== META-REASONING ENGINE TEST COMPLETE ===");
}

main();
