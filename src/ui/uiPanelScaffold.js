// ------------------------------------------------------------
// GIDION UI v1 — PANEL SCAFFOLD (NEON ARC-REACTOR STYLE) v1
// ------------------------------------------------------------
// Tämä moduuli määrittelee kaikkien dashboard-paneelien
// perusrakenteen ja visuaalisen identiteetin.
//
// Paneeli sisältää:
//   - neon-reunat
//   - glassmorphism-taustan
//   - Arc-Reactor -valon "inner glow"
//   - otsikon ja sisällön rungon
//
// Tämä on täysin framework-agnostinen konfiguraatiomoduuli.
// ------------------------------------------------------------
export function createPanelScaffold(title) {
    return {
        title,
        style: {
            background: "rgba(15, 25, 45, 0.35)",
            border: "1px solid rgba(0, 234, 255, 0.35)",
            borderRadius: "16px",
            padding: "24px",
            glowColor: "#00eaff",
            glowIntensity: 0.75,
            blur: "backdrop-filter: blur(14px)"
        },
        header: {
            fontSize: "22px",
            fontWeight: "600",
            neonUnderline: true
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("Gidion UI v1 — Panel Scaffold");
    console.log(JSON.stringify(createPanelScaffold("Example Panel"), null, 2));
}
