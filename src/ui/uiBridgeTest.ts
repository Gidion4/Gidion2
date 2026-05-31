// ------------------------------------------------------------
// GIDION UI BRIDGE TEST v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä testaa UI-komentojen perustoiminnan ilman Jest-työkaluja.
// ------------------------------------------------------------

import { handleUICommand } from "./commandConsole.js";

async function main() {
  console.log("=== GIDION UI BRIDGE TEST ===");

  const result = await handleUICommand({
    type: "run",
    text: "test"
  });

  console.log("UI TEST RESULT:");
  console.log(JSON.stringify(result, null, 2));
}

main();
