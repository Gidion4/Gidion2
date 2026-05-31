// ------------------------------------------------------------
// SYSTEM HEALTHCHECK TEST (FULL REPLACEMENT)
// ------------------------------------------------------------

import { runHealthcheck } from "./systemHealthcheck.js";

async function main() {
  console.log("=== SYSTEM HEALTHCHECK TEST ===");

  const result = runHealthcheck();

  console.log(JSON.stringify(result, null, 2));
}

main();


