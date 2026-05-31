// ------------------------------------------------------------
// SYSTEM SNAPSHOT (FULL REPLACEMENT, PRO)
// ------------------------------------------------------------

import { runHealthcheck } from "./systemHealthcheck.js";

export function systemSnapshot() {
  const health = runHealthcheck();

  return {
    ok: true,
    timestamp: Date.now(),
    snapshot: {
      health,
      uptime: "stable",
      agentsActive: true
    }
  };
}

// Alias, jotta kaikki createSystemSnapshot-importit toimivat
export function createSystemSnapshot() {
  return systemSnapshot();
}



