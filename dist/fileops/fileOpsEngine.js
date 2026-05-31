// ------------------------------------------------------------
// FILEOPS ENGINE v3 — Automatic Task Registration
// ------------------------------------------------------------
import fs from "node:fs";
import path from "node:path";
export class FileOpsEngine {
    basePath;
    constructor(basePath = "C:\\Gidion\\workspace") {
        this.basePath = basePath;
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }
    // ------------------------------
    // TASK REGISTRATION
    // ------------------------------
    getTasks() {
        return {
            "fileops.create-demo-folder": this.taskCreateDemoFolder,
            "fileops.write-demo-file": this.taskWriteDemoFile
        };
    }
    // ------------------------------
    // TASK IMPLEMENTATIONS
    // ------------------------------
    taskCreateDemoFolder() {
        const folder = path.join(this.basePath, "fileops-demo");
        fs.mkdirSync(folder, { recursive: true });
        return { folder };
    }
    taskWriteDemoFile() {
        const file = path.join(this.basePath, "fileops-demo", "hello.txt");
        fs.writeFileSync(file, "Hello from FileOps Engine v3!", "utf8");
        return { file };
    }
}
