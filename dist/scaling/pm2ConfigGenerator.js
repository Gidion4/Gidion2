// ------------------------------------------------------------
// PM2 CONFIG GENERATOR PRO
// ------------------------------------------------------------
// Luo PM2-konfiguraation automaattisesti:
//   - scale-up
//   - scale-down
//   - cluster-mode
// ------------------------------------------------------------
export function generatePM2Config(mode = "default") {
    const base = {
        name: "gidion-ultrahybrid",
        script: "./dist/index.js",
        exec_mode: "cluster",
        instances: 1
    };
    if (mode === "scale-up") {
        base.instances = 4;
    }
    if (mode === "scale-down") {
        base.instances = 1;
    }
    return JSON.stringify(base, null, 2);
}
