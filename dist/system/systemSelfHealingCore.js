// ------------------------------------------------------------
// SYSTEM SELF-HEALING CORE v4 PRO (FULL REPLACEMENT)
// ------------------------------------------------------------
// Tämä versio palauttaa:
//   - healthy-flagin
//   - issue-objektit (key, description, severity, suggestion)
//   - yhteensopivuuden dashboardin, plannerin, orchestratorin,
//     optimization metricsin ja testien kanssa.
// ------------------------------------------------------------
import { systemSnapshot } from "./systemSnapshot.js";
import { runDiagnostics } from "./systemDiagnostics.js";
import { runHealthcheck } from "./systemHealthcheck.js";
export function systemSelfHealingCore() {
    const snapshot = systemSnapshot();
    const diagnostics = runDiagnostics();
    const health = runHealthcheck();
    const issues = [];
    // ------------------------------------------------------------
    // HEALTHCHECK
    // ------------------------------------------------------------
    for (const [component, status] of Object.entries(health.components)) {
        if (status !== "ok") {
            issues.push({
                key: `health-${component}`,
                description: `Component '${component}' reported status '${status}'.`,
                severity: "medium",
                suggestion: `Inspect component '${component}' and restart if needed.`
            });
        }
    }
    // ------------------------------------------------------------
    // SNAPSHOT
    // ------------------------------------------------------------
    const snap = snapshot.snapshot;
    if (!snap.agentsActive) {
        issues.push({
            key: "agents-inactive",
            description: "Agents are not active.",
            severity: "high",
            suggestion: "Restart agent subsystem."
        });
    }
    if (snap.uptime !== "stable") {
        issues.push({
            key: "uptime-unstable",
            description: "System uptime is not stable.",
            severity: "medium",
            suggestion: "Check system load and restart if necessary."
        });
    }
    // ------------------------------------------------------------
    // DIAGNOSTICS
    // ------------------------------------------------------------
    const diag = diagnostics.diagnostics;
    if (diag.cpuLoad !== "nominal") {
        issues.push({
            key: "cpu-load",
            description: "CPU load abnormal.",
            severity: "medium",
            suggestion: "Investigate CPU-intensive processes."
        });
    }
    if (diag.memoryUsage !== "stable") {
        issues.push({
            key: "memory-usage",
            description: "Memory usage abnormal.",
            severity: "medium",
            suggestion: "Check memory leaks or restart agents."
        });
    }
    // ------------------------------------------------------------
    // FINAL REPORT
    // ------------------------------------------------------------
    const healthy = issues.length === 0;
    return {
        ok: true,
        timestamp: Date.now(),
        healthy,
        issues,
        actions: healthy
            ? ["none"]
            : ["restart-agents", "flush-stm", "rebuild-pipeline-cache"]
    };
}
// ------------------------------------------------------------
// ALIAS: analyzeSystemState()
// ------------------------------------------------------------
export function analyzeSystemState() {
    return systemSelfHealingCore();
}
