// ------------------------------------------------------------
// GIDION ARC CORE — DEV TEST v3 (ESM-COMPATIBLE)
// ------------------------------------------------------------

import { describeBrain, runBrainTask } from "./router.js";

async function main() {
  console.log("=== GIDION BRAIN DIAGNOSTICS ===");
  console.log(JSON.stringify(describeBrain(), null, 2));

  const tasks = [
    { label: "CORE", intent: "analyze", text: "Suunnittele arkkitehtuuri." },
    { label: "CODEX", intent: "generate-code", text: "Luo funktio." },
    { label: "VISION", intent: "prepare-image-generation", text: "Luo kuva." },
    { label: "OPS", intent: "inspect-system", text: "Tarkista järjestelmä." }
  ];

  for (const t of tasks) {
    console.log("\n---");
    console.log(`TASK: ${t.label}`);
    const res = await runBrainTask({ intent: t.intent, text: t.text });
    console.log(JSON.stringify(res, null, 2));
  }

  console.log("\n---");
  console.log("TASK: Example App Pipeline");

  const exampleApp = await (await import("../apps/example-app/handler.js"))
    .runExampleApp("Luo funktio, joka laskee summan.");

  console.log(JSON.stringify(exampleApp, null, 2));

  console.log("\n=== DONE ===");
}

main().catch(err => {
  console.error("DEV TEST FAILED:", err);
  process.exit(1);
});

