// ------------------------------------------------------------
// SYSTEM INTROSPECTION (FULL REPLACEMENT)
// ------------------------------------------------------------

import { runHealthcheck } from "./systemHealthcheck.js";

export function systemIntrospection() {
  const health = runHealthcheck();

  return {
    ok: true,
    timestamp: Date.now(),
    introspection: {
      health,
      modules: ["agents", "pipeline", "orchestrator", "memory"],
      version: "v4"
    }
  };
}



