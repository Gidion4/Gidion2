"use strict";
// ------------------------------------------------------------
// GIDION MASTER TEST RUNNER v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
console.log("=== GIDION MASTER TEST RUNNER v2 ===\n");
// Etsi kaikki testit src-kansiosta
const testDir = "./src";
const testFiles = [];
function scan(dir) {
    const entries = (0, node_fs_1.readdirSync)(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = (0, node_path_1.join)(dir, entry.name);
        if (entry.isDirectory()) {
            scan(full);
        }
        else if (entry.name.endsWith("Test.ts")) {
            testFiles.push(full);
        }
    }
}
scan(testDir);
// Suorita testit yksi kerrallaan
for (const file of testFiles) {
    console.log(`→ Running: ${file}`);
    try {
        (0, node_child_process_1.execSync)(`ts-node ${file}`, { stdio: "inherit" });
    }
    catch (err) {
        console.error(`✖ Test failed: ${file}`);
        process.exit(1);
    }
}
console.log("\n✔ All tests passed.");
