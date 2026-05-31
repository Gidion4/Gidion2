// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM MANIFEST v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä tiedosto toimii järjestelmän virallisena manifestina.
//
// Se sisältää:
//   - täydellisen listan kaikista moduuleista
//   - polut
//   - kategoriat
//   - dependency-kartan
//
// Tämä toimii:
//   - introspektion juurena
//   - dokumentaation pohjana
//   - selfHealing-järjestelmän perustana
// ------------------------------------------------------------

export interface ManifestEntry {
  name: string;
  path: string;
  category: string;
}

export const systemManifest: ManifestEntry[] = [
  // Project Engine
  { name: "ProjectEngine", path: "../project/projectEngine.ts", category: "core" },
  { name: "ProjectEngineTest", path: "../project/projectEngineTest.ts", category: "test" },

  // Autonomy Loop
  { name: "AutonomyLoop", path: "../autonomy/autonomyLoop.ts", category: "core" },
  { name: "AutonomyLoopTest", path: "../autonomy/autonomyLoopTest.ts", category: "test" },

  // Kernel
  { name: "OrganizationKernel", path: "../kernel/organizationKernel.ts", category: "core" },
  { name: "OrganizationKernelTest", path: "../kernel/organizationKernelTest.ts", category: "test" },

  // Agents
  { name: "AgentCore", path: "../agents/agentCore.ts", category: "agent" },
  { name: "AgentCoreTest", path: "../agents/agentCoreTest.ts", category: "test" },
  { name: "AgentOrchestrator", path: "../agents/agentOrchestrator.ts", category: "agent" },
  { name: "AgentOrchestratorTest", path: "../agents/agentOrchestratorTest.ts", category: "test" },

  // System
  { name: "SelfInspector", path: "./selfInspector.ts", category: "system" },
  { name: "SelfInspectorTest", path: "./selfInspectorTest.ts", category: "test" },
  { name: "SelfTestRunner", path: "./selfTestRunner.ts", category: "system" },

  // Bootstrap
  { name: "Bootstrap", path: "../bootstrap/bootstrap.ts", category: "bootstrap" },
  { name: "BootstrapTest", path: "../bootstrap/bootstrapTest.ts", category: "test" },

  // Index
  { name: "SystemIndex", path: "./systemIndex.ts", category: "system" },
  { name: "SystemIndexTest", path: "./systemIndexTest.ts", category: "test" }
];

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Gidion UltraHybrid Level 4 — System Manifest");
  console.table(systemManifest);
}

