// Pieni helper logiin
function logEvent(message) {
  const log = document.getElementById("event-log");
  const line = document.createElement("div");
  const ts = new Date().toISOString().split("T")[1].split(".")[0];
  line.textContent = `[${ts}] ${message}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

// Mock‑agentit ja appit (myöhemmin sidotaan oikeaan Gidion‑ytimen dataan)
const agents = [
  { name: "CORE", role: "Primary brain", status: "online" },
  { name: "CODEX", role: "Code / refactor", status: "idle" },
  { name: "VISION", role: "Image / video", status: "offline" },
  { name: "OPS", role: "System ops", status: "online" }
];

const apps = [
  { name: "Diagnostics", tag: "system" },
  { name: "Evolution Engine", tag: "self‑improve" },
  { name: "Task Orchestrator", tag: "workflow" },
  { name: "App Store (future)", tag: "packages" }
];

function renderAgents() {
  const container = document.getElementById("agent-list");
  container.innerHTML = "";
  agents.forEach(a => {
    const row = document.createElement("div");
    row.className = "agent-item";
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = `${a.name} — ${a.role}`;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = a.status.toUpperCase();
    row.appendChild(label);
    row.appendChild(badge);
    container.appendChild(row);
  });
}

function renderApps() {
  const container = document.getElementById("apps-list");
  container.innerHTML = "";
  apps.forEach(a => {
    const row = document.createElement("div");
    row.className = "app-item";
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = a.name;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = a.tag.toUpperCase();
    row.appendChild(label);
    row.appendChild(badge);
    container.appendChild(row);
  });
}

function openOverlay(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeOverlay(id) {
  document.getElementById(id).classList.add("hidden");
}

function initOverlays() {
  document
    .getElementById("btn-open-console")
    .addEventListener("click", () => {
      openOverlay("overlay-console");
      logEvent("Console opened.");
    });

  document
    .getElementById("btn-open-evolution")
    .addEventListener("click", () => {
      openOverlay("overlay-evolution");
      logEvent("Evolution panel opened.");
    });

  document
    .getElementById("btn-open-diagnostics")
    .addEventListener("click", () => {
      openOverlay("overlay-diagnostics");
      logEvent("Diagnostics panel opened.");
    });

  document.querySelectorAll(".overlay-close").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      closeOverlay(target);
      logEvent(`Panel ${target} closed.`);
    });
  });
}

function initConsole() {
  const input = document.getElementById("console-input");
  const output = document.getElementById("console-output");
  const send = document.getElementById("console-send");

  function write(line) {
    const div = document.createElement("div");
    div.textContent = line;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    write(`> ${trimmed}`);

    if (trimmed === "status") {
      write("CORE: stable, agents: " + agents.length + ", apps: " + apps.length);
    } else if (trimmed === "agents") {
      agents.forEach(a => write(`- ${a.name}: ${a.role} [${a.status}]`));
    } else if (trimmed === "apps") {
      apps.forEach(a => write(`- ${a.name} (${a.tag})`));
    } else {
      write("Unknown command (placeholder). Later: route to real Gidion brain.");
    }
  }

  send.addEventListener("click", () => {
    handleCommand(input.value);
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      handleCommand(input.value);
      input.value = "";
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderAgents();
  renderApps();
  initOverlays();
  initConsole();
  logEvent("Gidion Arc Core UI initialized.");
});
