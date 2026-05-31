// ------------------------------------------------------------
// GIDION LEVEL 4 â€” ORGANIZATION KERNEL TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa organizationKernel.ts -moduulin keskeiset toiminnot:
//   - projektien lisÃ¤Ã¤minen
//   - autonomyLoopin kÃ¤ynnistys ja pysÃ¤ytys
//   - status-raportointi
//   - integraatio ProjectEngineen
//
// Satunnaisuus mockataan deterministiseksi.
// ------------------------------------------------------------

import { OrganizationKernel } from "./organizationKernel.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running OrganizationKernel tests...");

  // Mockataan Math.random â†’ deterministinen
  const originalRandom = Math.random;
  Math.random = () => 0.99;

  const kernel = new OrganizationKernel();

  // --- Test 1: Projektin lisÃ¤Ã¤minen ---
  kernel.addProject("Kernel Test Project", 1, ["taskA"]);
  const status1 = kernel.getStatus();
  assert(status1.pendingProjects === 1, "Project not added to pending list");

  // --- Test 2: Autonomian kÃ¤ynnistys ---
  kernel.startAutonomy();
  assert(kernel.getStatus().autonomyRunning === true, "Autonomy did not start");

  // Odotetaan 500ms â†’ autonomyLoop aktivoi projektin
  await new Promise((resolve) => setTimeout(resolve, 500));

  const status2 = kernel.getStatus();
  assert(status2.activeProjects === 1, "Autonomy did not activate project");

  // --- Test 3: Autonomian pysÃ¤ytys ---
  kernel.stopAutonomy();
  assert(kernel.getStatus().autonomyRunning === false, "Autonomy did not stop");

  // Palautetaan alkuperÃ¤inen random
  Math.random = originalRandom;

  console.log("âœ” All OrganizationKernel tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

