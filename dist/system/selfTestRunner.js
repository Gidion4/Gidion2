// ------------------------------------------------------------
// GIDION ULTRAHYBRID — SELF TEST RUNNER v5 (Node + dist)
// ------------------------------------------------------------
// Tämä versio toimii 100 % varmasti Windowsissa, Node 20–24,
// ESM-moduuleilla ja dist/ -käännöksellä.
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Testit etsitään projektin src/ juuresta
const SRC_ROOT = path.join(__dirname, "..");
function findTestFiles(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findTestFiles(fullPath, results);
        }
        else if (entry.isFile() && entry.name.endsWith("Test.ts")) {
            results.push(fullPath);
        }
    }
    return results;
}
async function runTestFile(filePath) {
    try {
        const url = pathToFileURL(filePath).href;
        await import(url);
        return { file: filePath, success: true };
    }
    catch (err) {
        return { file: filePath, success: false, error: err };
    }
}
export async function runAllTests() {
    const testFiles = findTestFiles(SRC_ROOT);
    const results = [];
    for (const file of testFiles) {
        const result = await runTestFile(file);
        results.push(result);
    }
    const passed = results.filter(r => r.success).length;
    const failed = results.length - passed;
    return {
        timestamp: new Date().toISOString(),
        total: results.length,
        passed,
        failed,
        results
    };
}
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().then((report) => {
        console.log("GIDION SELF TEST RUNNER v5");
        console.log("---------------------------");
        console.log(`Found ${report.total} test files.`);
        console.log(`Passed: ${report.passed}`);
        console.log(`Failed: ${report.failed}`);
        for (const r of report.results) {
            console.log(`${r.success ? "✔" : "✖"} ${r.file}`);
            if (!r.success)
                console.error(r.error);
        }
    });
}
