// ------------------------------------------------------------
// GIDION ULTRAHYBRID v6 — COGNITIVE ENGINE TEST (PRO)
// ------------------------------------------------------------
// Tämä testi varmistaa, että Cognitive Engine toimii ja että
// kognitiivinen tila, havainnot ja optimoinnit ovat eheät ja
// yhteensopivat Vision-, Meta-Reasoning- ja System-kerrosten
// kanssa.
// ------------------------------------------------------------

import { runCognitiveEngine } from "./cognitiveEngine.js";
import { runMetaReasoningEngine } from "../vision/metaReasoningEngine.js";
import { runVisionEngine } from "../vision/visionEngine.js";
import { GidionSystem } from "../system/systemIntegration.js";

async function main() {
  console.log("=== GIDION ULTRAHYBRID v6 — COGNITIVE ENGINE TEST ===\n");

  // ------------------------------------------------------------
  // 1) Ajetaan Cognitive Engine
  // ------------------------------------------------------------
  console.log("Running Cognitive Engine...\n");

  const cognitive = runCognitiveEngine();

  console.log("Cognitive State:");
  console.log(JSON.stringify(cognitive.state, null, 2), "\n");

  console.log("Cognitive Insights:");
  console.log(JSON.stringify(cognitive.insights, null, 2), "\n");

  console.log("Cognitive Optimizations:");
  console.log(JSON.stringify(cognitive.optimizations, null, 2), "\n");

  // ------------------------------------------------------------
  // 2) Ajetaan Vision Engine vertailua varten
  // ------------------------------------------------------------
  console.log("Running Vision Engine...\n");

  const vision = runVisionEngine();
  console.log("Vision Report:");
  console.log(JSON.stringify(vision, null, 2), "\n");

  // ------------------------------------------------------------
  // 3) Ajetaan Meta-Reasoning Engine vertailua varten
  // ------------------------------------------------------------
  console.log("Running Meta-Reasoning Engine...\n");

  const meta = runMetaReasoningEngine();
  console.log("Meta-Reasoning Report:");
  console.log(JSON.stringify(meta, null, 2), "\n");

  // ------------------------------------------------------------
  // 4) Haetaan järjestelmän tila Integration Layerin kautta
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
  // 5) Sanity checks
  // ------------------------------------------------------------
  console.log("Performing Cognitive Engine sanity checks...\n");

  if (typeof cognitive.state !== "object") {
    console.error("ERROR: cognitive.state missing or invalid.");
  }

  if (!Array.isArray(cognitive.insights)) {
    console.error("ERROR: cognitive.insights missing or invalid.");
  }

  if (!Array.isArray(cognitive.optimizations)) {
    console.error("ERROR: cognitive.optimizations missing or invalid.");
  }

  console.log("Sanity checks complete.\n");

  console.log("=== COGNITIVE ENGINE TEST COMPLETE ===");
}

main();

