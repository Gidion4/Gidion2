// ------------------------------------------------------------
// GIDION LEVEL 4 â€” ORGANIZATION KERNEL v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli toimii Gidionin keskushermostona.
//
// Vastuut:
//   - yhdistÃ¤Ã¤ ProjectEngine + AutonomyLoop
//   - valvoo jÃ¤rjestelmÃ¤n tilaa
//   - tekee korkean tason pÃ¤Ã¤tÃ¶ksiÃ¤
//   - toimii pohjana agenttien orkestroinnille
//   - toimii Level 5 -autonomian perustana
// ------------------------------------------------------------

import { ProjectEngine } from "../project/projectEngine.js";
import { AutonomyLoop } from "../autonomy/autonomyLoop.js";

export interface KernelStatus {
  activeProjects: number;
  pendingProjects: number;
  completedProjects: number;
  autonomyRunning: boolean;
}

export class OrganizationKernel {
  private engine: ProjectEngine;
  private loop: AutonomyLoop;
  private running: boolean = false;

  constructor() {
    this.engine = new ProjectEngine();
    this.loop = new AutonomyLoop(this.engine);
  }

  addProject(name: string, priority: number, tasks: string[]) {
    return this.engine.addProject(name, priority, tasks);
  }

  startAutonomy() {
    if (this.running) return;
    this.loop.start(1500);
    this.running = true;
    console.log("OrganizationKernel: Autonomy started.");
  }

  stopAutonomy() {
    if (!this.running) return;
    this.loop.stop();
    this.running = false;
    console.log("OrganizationKernel: Autonomy stopped.");
  }

  getStatus(): KernelStatus {
    return {
      activeProjects: this.engine.getActiveProjects().length,
      pendingProjects: this.engine.getPendingProjects().length,
      completedProjects: this.engine.getCompletedProjects().length,
      autonomyRunning: this.running
    };
  }

  getEngine() {
    return this.engine;
  }

  getLoop() {
    return this.loop;
  }
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const kernel = new OrganizationKernel();

  kernel.addProject("Initialize Level 4", 1, ["selfInspector", "selfTestRunner"]);
  kernel.addProject("Build Project Engine", 2, ["design", "implement", "test"]);
  kernel.addProject("Upgrade Autonomy Loop", 3, ["analysis", "rewrite"]);

  kernel.startAutonomy();

  setInterval(() => {
    console.log("\nKernel Status:", kernel.getStatus());
  }, 2000);

  // PysÃ¤ytÃ¤ 12 sekunnin jÃ¤lkeen
  setTimeout(() => kernel.stopAutonomy(), 12000);
}

