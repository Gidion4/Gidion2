const ws = new WebSocket("ws://localhost:3001");

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.type === "architecture") {
    document.getElementById("architectureOutput").textContent = data.payload;
  }

  if (data.type === "metrics") {
    document.getElementById("metricsOutput").textContent = data.payload;
  }

  if (data.type === "evolution") {
    document.getElementById("evolutionOutput").textContent = data.payload;
  }

  if (data.type === "patches") {
    document.getElementById("patchOutput").textContent = data.payload;
  }
};
