// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — AGENT MEMORY LAYER
// ------------------------------------------------------------
// Jokaisella agentilla on kolme muistitasoa:
//
// 1) Short-term memory (STM)
//    - säilyy vain yhden tehtävän ajan
//    - nollautuu automaattisesti
//
// 2) Long-term memory (LTM)
//    - säilyy agentin elinkaaren ajan
//    - sisältää oppimista, havaintoja, päätöksiä
//
// 3) Collective memory (CM)
//    - jaettu kaikkien agenttien kesken
//    - sisältää globaalit havainnot ja yhteiset päätökset
//
// Kaikki muistitoiminnot ovat:
//   - deterministisiä
//   - turvallisia
//   - rajattuja
//   - eivät koskaan kirjoita tiedostoihin ilman hyväksyntää
// ------------------------------------------------------------

export interface AgentMemory {
  stm: Map<string, any>; // short-term
  ltm: Map<string, any>; // long-term
}

export interface CollectiveMemory {
  data: Map<string, any>;
}

export const collectiveMemory: CollectiveMemory = {
  data: new Map()
};

// Luo uuden agentin muistirakenteen
export function createAgentMemory(): AgentMemory {
  return {
    stm: new Map(),
    ltm: new Map()
  };
}

// -----------------------------
// Short-term memory (STM)
// -----------------------------

export function stmSet(mem: AgentMemory, key: string, value: any) {
  mem.stm.set(key, value);
}

export function stmGet(mem: AgentMemory, key: string) {
  return mem.stm.get(key);
}

export function stmClear(mem: AgentMemory) {
  mem.stm.clear();
}

// -----------------------------
// Long-term memory (LTM)
// -----------------------------

export function ltmSet(mem: AgentMemory, key: string, value: any) {
  mem.ltm.set(key, value);
}

export function ltmGet(mem: AgentMemory, key: string) {
  return mem.ltm.get(key);
}

export function ltmHas(mem: AgentMemory, key: string) {
  return mem.ltm.has(key);
}

// -----------------------------
// Collective memory (CM)
// -----------------------------

export function cmSet(key: string, value: any) {
  collectiveMemory.data.set(key, value);
}

export function cmGet(key: string) {
  return collectiveMemory.data.get(key);
}

export function cmHas(key: string) {
  return collectiveMemory.data.has(key);
}

export function cmAll() {
  return Array.from(collectiveMemory.data.entries());
}
