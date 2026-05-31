// ------------------------------------------------------------
// SYSTEM DIAGNOSTICS TEST (FULL REPLACEMENT, PRO)
// ------------------------------------------------------------

import { runDiagnostics } from "./systemDiagnostics.js";

async function main() {
  console.log("=== SYSTEM DIAGNOSTICS TEST ===");

  const result = runDiagnostics();

  console.log(JSON.stringify(result, null, 2));
}

main();


