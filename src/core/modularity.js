import fs from "fs";
import path from "path";
function collectTsFiles(root) {
    const result = [];
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) {
                walk(full);
            }
            else if (e.isFile() && e.name.endsWith(".ts")) {
                result.push(full);
            }
        }
    }
    if (fs.existsSync(root)) {
        walk(root);
    }
    return result;
}
export function computeModuleMetrics(roots) {
    const files = [];
    for (const r of roots) {
        const abs = path.resolve(r);
        const tsFiles = collectTsFiles(abs);
        for (const f of tsFiles) {
            try {
                const content = fs.readFileSync(f, "utf8");
                const lines = content.split(/\r?\n/).length;
                files.push({ path: path.relative(process.cwd(), f), lines });
            }
            catch {
                // ignore read errors
            }
        }
    }
    const totalFiles = files.length;
    const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
    const avgLinesPerFile = totalFiles > 0 ? totalLines / totalFiles : 0;
    const largestFiles = [...files].sort((a, b) => b.lines - a.lines).slice(0, 10);
    return {
        totalFiles,
        totalLines,
        avgLinesPerFile,
        largestFiles
    };
}
export function printModuleMetrics(roots) {
    const m = computeModuleMetrics(roots);
    console.log("=== Gidion Module Metrics ===");
    console.log("Total TS files:", m.totalFiles);
    console.log("Total lines:", m.totalLines);
    console.log("Avg lines/file:", m.avgLinesPerFile.toFixed(1));
    console.log("");
    console.log("Largest files:");
    for (const f of m.largestFiles) {
        console.log(`- ${f.path} (${f.lines} lines)`);
    }
}
