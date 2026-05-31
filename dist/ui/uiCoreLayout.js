// ------------------------------------------------------------
// GIDION UI v1 — CORE LAYOUT (NEON ARC-REACTOR STYLE) v1
// ------------------------------------------------------------
// Tämä moduuli määrittelee Gidion UI:n perusrakenteen ja visuaalisen
// identiteetin. Se ei ole sidottu mihinkään UI-frameworkiin.
//
// Se tuottaa UIConfig-olion, jota dashboardit ja paneelit käyttävät.
// ------------------------------------------------------------
export function getUICoreLayout() {
    return {
        style: {
            background: "radial-gradient(circle at 50% 50%, #0a0f1f, #000000)",
            panelBackground: "rgba(20, 30, 60, 0.35)",
            neonPrimary: "#00eaff",
            neonSecondary: "#0077ff",
            glowIntensity: 0.85,
            borderRadius: "14px",
            blur: "backdrop-filter: blur(18px)"
        },
        layout: {
            headerHeight: "72px",
            sidebarWidth: "260px",
            contentPadding: "32px",
            maxContentWidth: "1600px"
        }
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("Gidion UI v1 — Core Layout");
    console.log(JSON.stringify(getUICoreLayout(), null, 2));
}
