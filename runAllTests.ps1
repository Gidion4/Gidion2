Write-Host "=== GIDION POWERSHELL TEST ORCHESTRATOR v1 ===" -ForegroundColor Cyan

$tests = @(
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
)

foreach ($test in $tests) {
    Write-Host "→ Running $test" -ForegroundColor Yellow
    node $test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✖ Test failed: $test" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✔ ALL TESTS PASSED — SYSTEM IS HEALTHY" -ForegroundColor Green
