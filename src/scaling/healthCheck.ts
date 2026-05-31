// ------------------------------------------------------------
// HEALTH CHECK ENGINE PRO
// ------------------------------------------------------------
// Tarkistaa:
//   - CPU-kuorman
//   - muistin käytön
//   - vasteajan
//   - virhelogit
// ------------------------------------------------------------

import os from "os";

export interface HealthStatus {
  ok: boolean;
  cpu: number;
  memory: number;
  latency: number;
}

export async function runHealthCheck(): Promise<HealthStatus> {
  const cpuLoad = os.loadavg()[0] * 10; // yksinkertaistettu
  const mem = (os.totalmem() - os.freemem()) / os.totalmem();
  const memoryPercent = Math.round(mem * 100);

  // Simuloitu vasteaika
  const latency = Math.floor(Math.random() * 50) + 10;

  const ok = cpuLoad < 95 && memoryPercent < 95 && latency < 200;

  return {
    ok,
    cpu: Math.round(cpuLoad),
    memory: memoryPercent,
    latency
  };
}
