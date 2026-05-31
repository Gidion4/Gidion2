// ------------------------------------------------------------
// GIDION ULTRAHYBRID v5 — VISION ENGINE TEST (PRO)
// ------------------------------------------------------------
// Tämä testi varmistaa, että Vision Engine toimii ja että
// järjestelmän meta-tason analyysi ja roadmapin generointi
// toimivat oikein.
// ------------------------------------------------------------

import { runVisionEngine } from "./visionEngine.js";
import { GidionSystem } from "../system/systemIntegration.js";

async function main() {
  console.log("=== GIDION ULTRAHYBRID v5 — VISION ENGINE TEST ===\n");

  // ------------------------------------------------------------
  // 1) Ajetaan Vision Engine
  // ------------------------------------------------------------
  console.log("Running Vision Engine...\n");

  const vision = runVisionEngine();

  console.log("Vision Insights:");
  console.log(JSON.stringify(vision.insights, null, 2), "\n");

  console.log("Vision Roadmap:");
  console.log(JSON.stringify(vision.roadmap, null, 2), "\n");

  // ------------------------------------------------------------
  // 2) Haetaan järjestelmän tila Integration Layerin kautta
  // ------------------------------------------------------------
  console.log("Fetching System Snapshot...\n");
  const snapshot = GidionSystem.snapshot();
  console.log(JSON.stringify(snapshot, null, 2), "\n");

  console.log("Fetching Diagnostics...\n");
  const diagnostics = GidionSystem.diagnostics();
  console.log(JSON.stringify(diagnostics, null, 2), "\n");

  console.log("Fetching Healthcheck...\n");
  const health = GidionSystem.health();
  console.log(JSON.stringify(health, null, 2), "\n");

  console.log("Fetching Self-Healing Report...\n");
  const healing = GidionSystem.selfHeal();
  console.log(JSON.stringify(healing, null, 2), "\n");

  // ------------------------------------------------------------
  // 3) Vision Engine sanity checks
  // ------------------------------------------------------------
  console.log("Performing Vision Engine sanity checks...\n");

  if (!Array.isArray(vision.insights)) {
    console.error("ERROR: Vision insights missing or invalid.");
  }

  if (!Array.isArray(vision.roadmap)) {
    console.error("ERROR: Vision roadmap missing or invalid.");
  }

  console.log("Sanity checks complete.\n");

  console.log("=== VISION ENGINE TEST COMPLETE ===");
}

main();
