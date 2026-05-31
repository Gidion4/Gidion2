// ------------------------------------------------------------
// GIDION UI v1 — NAVIGATION MENU (NEON ARC-REACTOR STYLE) v1
// ------------------------------------------------------------
// Tämä moduuli määrittelee Gidion UI:n vasemman sivupalkin
// navigaatiokonfiguraation. Se ei ole sidottu mihinkään UI-frameworkiin.
//
// Se tuottaa NavigationMenuConfig-olion, jota UI-kerros käyttää
// renderöidäkseen neon-glow-tyylisen navigaation.
// ------------------------------------------------------------

export interface NavigationItem {
  key: string;
  label: string;
  icon: string;          // neon-icon identifier
  route: string;         // UI route
  glow: boolean;         // enable neon glow
}

export interface NavigationMenuConfig {
  items: NavigationItem[];
  style: {
    width: string;
    background: string;
    neonGlowColor: string;
    hoverGlowIntensity: number;
  };
}

export function getNavigationMenu(): NavigationMenuConfig {
  return {
    items: [
      {
        key: "dashboard.systemStatus",
        label: "System Status",
        icon: "arc-reactor-core",
        route: "/system-status",
        glow: true
      },
      {
        key: "dashboard.selfHealing",
        label: "Self-Healing",
        icon: "healing-pulse",
        route: "/self-healing",
        glow: true
      },
      {
        key: "dashboard.repair",
        label: "Repair Engine",
        icon: "wrench-neon",
        route: "/repair",
        glow: true
      },
      {
        key: "dashboard.optimization",
        label: "Optimization",
        icon: "optimizer-node",
        route: "/optimization",
        glow: true
      },
      {
        key: "dashboard.agents",
        label: "Agents",
        icon: "agent-swarm",
        route: "/agents",
        glow: false
      },
      {
        key: "dashboard.settings",
        label: "Settings",
        icon: "settings-gear",
        route: "/settings",
        glow: false
      }
    ],

    style: {
      width: "260px",
      background: "rgba(10, 20, 40, 0.45)",
      neonGlowColor: "#00eaff",
      hoverGlowIntensity: 0.85
    }
  };
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Gidion UI v1 — Navigation Menu");
  console.log(JSON.stringify(getNavigationMenu(), null, 2));
}
