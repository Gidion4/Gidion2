// ------------------------------------------------------------
// GIDION UI v1 — HEADER BAR (NEON ARC-REACTOR STYLE) v1
// ------------------------------------------------------------
// Tämä moduuli määrittelee Gidion UI:n yläreunan header-palkin
// konfiguraation. Se ei ole sidottu mihinkään UI-frameworkiin.
//
// Header sisältää:
//   - Arc-Reactor "core pulse" -elementin
//   - neon-glow -korostukset
//   - otsikon ja tilaelementit
//
// Se tuottaa UIHeaderBarConfig-olion, jota UI-kerros käyttää.
// ------------------------------------------------------------
export function getUIHeaderBar() {
    return {
        title: "GIDION ULTRAHYBRID",
        corePulse: {
            enabled: true,
            color: "#00eaff",
            intensity: 0.9,
            pulseSpeedMs: 1800
        },
        actions: [
            {
                key: "action.notifications",
                label: "Notifications",
                icon: "bell-neon",
                glow: true
            },
            {
                key: "action.systemHealth",
                label: "System Health",
                icon: "heart-pulse",
                glow: true
            },
            {
                key: "action.userMenu",
                label: "User",
                icon: "user-holo",
                glow: false
            }
        ],
        style: {
            height: "72px",
            background: "rgba(10, 20, 40, 0.35)",
            neonPrimary: "#00eaff",
            neonSecondary: "#0077ff",
            blur: "backdrop-filter: blur(14px)"
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("Gidion UI v1 — Header Bar");
    console.log(JSON.stringify(getUIHeaderBar(), null, 2));
}
