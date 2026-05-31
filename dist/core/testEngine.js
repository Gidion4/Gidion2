// ------------------------------------------------------------
// GIDION INTERNAL TEST ENGINE v1
// ------------------------------------------------------------
// Tätä kutsuvat agentit, evoluutiokerros ja CI-pipeline.
// Se ajaa master-test runnerin ja palauttaa tuloksen
// ohjelmallisesti.
// ------------------------------------------------------------
import { execSync } from "child_process";
export function runGidionTests() {
    const tests = [
        "src/system/systemOptimizationDashboardDataTest.ts",
        "src/system/systemHealthCheckTest.ts",
        "src/system/systemRepairEngineTest.ts",
        "src/system/systemSelfHealingEngineTest.ts",
        "src/system/systemOptimizationEngineTest.ts",
        "src/ui/uiCoreLayoutTest.ts",
        "src/ui/uiNavigationMenuTest.ts",
        "src/ui/uiHeaderBarTest.ts",
        "src/ui/uiPanelScaffoldTest.ts",
        "src/ui/uiSystemStatusPanelTest.ts",
        "src/ui/uiSelfHealingPanelTest.ts",
        "src/ui/uiRepairPanelTest.ts",
        "src/ui/uiOptimizationPanelTest.ts"
    ];
    for (const test of tests) {
        try {
            execSync(`node ${test}`, { stdio: "ignore" });
        }
        catch {
            return { success: false, failedTest: test };
        }
    }
    return { success: true };
}
// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const result = runGidionTests();
    console.log(JSON.stringify(result, null, 2));
}
