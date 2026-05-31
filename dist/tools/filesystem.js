import fs from "fs";
import path from "path";
import { saveState, loadState } from "../system/systemStateManager.js";
export class FileOpsEngine {
    ensureDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    async writeFile(filePath, content) {
        const dir = path.dirname(filePath);
        this.ensureDir(dir);
        return fs.promises.writeFile(filePath, content, "utf8");
    }
    async readFile(filePath) {
        return fs.promises.readFile(filePath, "utf8");
    }
    async deleteFile(filePath) {
        if (fs.existsSync(filePath)) {
            return fs.promises.unlink(filePath);
        }
    }
    createFolder(folderPath) {
        this.ensureDir(folderPath);
    }
    async createFile(filePath, content) {
        await this.writeFile(filePath, content);
    }
    saveSystemState(state, filePath) {
        return saveState(state, filePath);
    }
    loadSystemState(filePath) {
        return loadState(filePath);
    }
}
