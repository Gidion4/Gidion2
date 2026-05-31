import { FileOpsEngine } from "./filesystem.js";
import { ProjectGeneratorEngine } from "../projectgen/projectGeneratorEngine.js";

const fileOps = new FileOpsEngine();
const projectGen = new ProjectGeneratorEngine(fileOps);

export const Tools = {
  fileOps,
  projectGen,
  async createProjectSafe(name: string) {
    try {
      const res = await projectGen.generateProject(name);
      return { ok: res.ok, details: res };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};

