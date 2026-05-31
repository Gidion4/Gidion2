import axios from "axios";

// ------------------------------------------------------------
// askOllama(prompt)
// ------------------------------------------------------------
// Palauttaa aina STRING-muotoisen vastauksen.
// Ei optional chainingia â†’ ei TS-virheitÃ¤.
// Ei unknown-tyyppejÃ¤ â†’ codegen/evolution/inspector toimivat.
// ------------------------------------------------------------

export async function askOllama(prompt: string): Promise<string> {
  const res = await axios.post("http://localhost:11434/api/generate", { prompt });

  // Axiosin res.data voi olla mitÃ¤ tahansa â†’ typitetÃ¤Ã¤n any:ksi
  const data: any = res.data;

  // Ollama palauttaa yleensÃ¤:
  // { response: "..." }
  if (data && typeof data.response === "string") {
    return data.response;
  }

  // Jos ei ole response-kenttÃ¤Ã¤ â†’ palautetaan koko data stringinÃ¤
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


