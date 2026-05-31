import { ProjectGeneratorEngine } from "../projectgen/projectGeneratorEngine.js";
import { FileOpsEngine } from "../tools/filesystem.js";

export class AutonomousEngine {
  private projectGen: ProjectGeneratorEngine;

  constructor() {
    const fileOps = new FileOpsEngine();
    this.projectGen = new ProjectGeneratorEngine(fileOps);
  }

  async runAutonomousCycle(projectName: string) {
    const project = await this.projectGen.taskCreateBasicProject(projectName);
    return {
      status: project.ok ? "ok" : "error",
      project
    };
  }
}




