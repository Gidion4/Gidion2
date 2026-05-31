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
    walk(root);
    return result;
}
function extractImports(content) {
    const lines = content.split(/\r?\n/);
    const imports = [];
    for (const line of lines) {
        const m = line.match(/import .* from ["'](.+)["']/);
        if (m)
            imports.push(m[1]);
    }
    return imports;
}
export function buildArchitectureMap(roots) {
    const nodes = [];
    for (const r of roots) {
        const abs = path.resolve(r);
        const files = collectTsFiles(abs);
        for (const f of files) {
            try {
                const content = fs.readFileSync(f, "utf8");
                const imports = extractImports(content);
                nodes.push({
                    file: path.relative(process.cwd(), f),
                    imports
                });
            }
            catch {
                // ignore
            }
        }
    }
    return {
        nodes,
        totalFiles: nodes.length
    };
}
export function printArchitectureMap(roots) {
    const map = buildArchitectureMap(roots);
    console.log("=== Gidion Architecture Map ===");
    console.log("Total TS files:", map.totalFiles);
    console.log("");
    for (const n of map.nodes) {
        console.log(`FILE: ${n.file}`);
        if (n.imports.length === 0) {
            console.log("  imports: (none)");
        }
        else {
            for (const i of n.imports) {
                console.log("  →", i);
            }
        }
        console.log("");
    }
}
