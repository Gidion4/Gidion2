// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — SCALING CONTROLLER
// ------------------------------------------------------------
// Vastaa:
//   - kuormituksen seurannasta
//   - skaalausehdotusten tekemisestä
//   - PM2-konfiguraation generoinnista
//   - palautumisen käynnistämisestä
// ------------------------------------------------------------

import { generatePM2Config } from "./pm2ConfigGenerator.js";
import { runHealthCheck } from "./healthCheck.js";
import { triggerRecovery } from "./recoveryEngine.js";

export interface ScalingDecision {
  ok: boolean;
  message: string;
  action?: "scale-up" | "scale-down" | "restart" | "none";
  pm2Config?: string;
}

export async function evaluateScaling(): Promise<ScalingDecision> {
  const health = await runHealthCheck();

  if (!health.ok) {
    return {
      ok: false,
      message: "System unhealthy. Triggering recovery.",
      action: "restart"
    };
  }

  if (health.cpu > 85 || health.memory > 85) {
    const config = generatePM2Config("scale-up");
    return {
      ok: true,
      message: "High load detected. Scaling up.",
      action: "scale-up",
      pm2Config: config
    };
  }

  if (health.cpu < 20 && health.memory < 20) {
    const config = generatePM2Config("scale-down");
    return {
      ok: true,
      message: "Low load detected. Scaling down.",
      action: "scale-down",
      pm2Config: config
    };
  }

  return {
    ok: true,
    message: "Load normal. No scaling needed.",
    action: "none"
  };
}
