import axios from "axios";

// ------------------------------------------------------------
// askOllama(prompt)
// ------------------------------------------------------------
// Palauttaa aina STRING-muotoisen vastauksen.
// Ei optional chainingia → ei TS-virheitä.
// Ei unknown-tyyppejä → codegen/evolution/inspector toimivat.
// ------------------------------------------------------------

export async function askOllama(prompt: string): Promise<string> {
  const res = await axios.post("http://localhost:11434/api/generate", { prompt });

  // Axiosin res.data voi olla mitä tahansa → typitetään any:ksi
  const data: any = res.data;

  // Ollama palauttaa yleensä:
  // { response: "..." }
  if (data && typeof data.response === "string") {
    return data.response;
  }

  // Jos ei ole response-kenttää → palautetaan koko data stringinä
  return String(data);
}

// ------------------------------------------------------------
// callOllama(prompt)
// ------------------------------------------------------------
// Alias askOllama-funktiolle.
// ------------------------------------------------------------

export async function callOllama(prompt: string): Promise<string> {
  return askOllama(prompt);
}

