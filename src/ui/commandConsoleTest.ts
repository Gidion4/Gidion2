// ------------------------------------------------------------
// GIDION LEVEL 3 â€” COMMAND CONSOLE TEST HARNESS v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ tiedosto testaa koko komentoriviketjun:
//   - commandConsole.ts (parseConsoleInput + handleConsoleInput)
//   - uiBridge.ts
//   - organizationController.ts
//   - autonomyLoop.ts
//   - pipelineEngine v2
//   - agenttien yhtenÃ¤inen rajapinta
//
// TÃ¤mÃ¤ simuloi komentorivin kÃ¤yttÃ¶Ã¤ ilman oikeaa CLI:tÃ¤.
// ------------------------------------------------------------

import { handleConsoleInput } from "./commandConsole.js";

async function run() {
  console.log("=== GIDION LEVEL 3 â€” COMMAND CONSOLE TEST ===");

  // ------------------------------------------------------------
  // LUODAAN TAVOITTEET KOMENTORIVIN KAUTTA
  // ------------------------------------------------------------

  const c1 = await handleConsoleInput("tee testi pipeline");

  const c2 = await handleConsoleInput(
    "tee jÃ¤rjestelmÃ¤ joka analysoi videoita url linkin kautta nÃ¤kemÃ¤llÃ¤ koko videon, ja tekee sen pohjalta toimenpiteet alusta loppuun halutulla tavalla"
  );

  const c3 = await handleConsoleInput(
    "tee raportti tehtÃ¤vistÃ¤, jotka perustuvat gidionin kehittÃ¤miseen ja pÃ¤ivittÃ¤miseen"
  );

  console.log("\n=== LUODUT TAVOITTEET (CONSOLE) ===");
  console.log(JSON.stringify([c1, c2, c3], null, 2));

  // ------------------------------------------------------------
  // LISTATAAN TAVOITTEET
  // ------------------------------------------------------------

  const list = await handleConsoleInput("listaa tavoitteet");

  console.log("\n=== LIST GOALS (CONSOLE) ===");
  console.log(JSON.stringify(list, null, 2));

  // ------------------------------------------------------------
  // SUORITETAAN TAVOITTEET AUTONOMISESTI
  // ------------------------------------------------------------

  const run1 = await handleConsoleInput(`aja ${c1.result.id}`);
  const run2 = await handleConsoleInput(`aja ${c2.result.id}`);
  const run3 = await handleConsoleInput(`aja ${c3.result.id}`);

  console.log("\n=== AUTONOMY EXECUTION RESULTS (CONSOLE) ===");
  console.log(JSON.stringify([run1, run2, run3], null, 2));

  // ------------------------------------------------------------
  // HAE TAVOITTEIDEN TILAT
  // ------------------------------------------------------------

  const s1 = await handleConsoleInput(`status ${c1.result.id}`);
  const s2 = await handleConsoleInput(`status ${c2.result.id}`);
  const s3 = await handleConsoleInput(`status ${c3.result.id}`);

  console.log("\n=== GOAL STATUS RESULTS (CONSOLE) ===");
  console.log(JSON.stringify([s1, s2, s3], null, 2));
}

run();

