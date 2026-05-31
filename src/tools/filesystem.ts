import fs from "fs";
import path from "path";
import { saveState, loadState, LoadResult } from "../system/systemStateManager.js";

export class FileOpsEngine {
  ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async writeFile(filePath: string, content: string) {
    const dir = path.dirname(filePath);
    this.ensureDir(dir);
    return fs.promises.writeFile(filePath, content, "utf8");
  }

  async readFile(filePath: string): Promise<string> {
    return fs.promises.readFile(filePath, "utf8");
  }

  async deleteFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      return fs.promises.unlink(filePath);
    }
  }

  createFolder(folderPath: string) {
    this.ensureDir(folderPath);
  }

  async createFile(filePath: string, content: string) {
    await this.writeFile(filePath, content);
  }

  saveSystemState(state: any, filePath: string) {
    return saveState(state, filePath);
  }

  loadSystemState(filePath: string): LoadResult {
    return loadState(filePath);
  }
}




