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
export const collectiveMemory = {
    data: new Map()
};
// Luo uuden agentin muistirakenteen
export function createAgentMemory() {
    return {
        stm: new Map(),
        ltm: new Map()
    };
}
// -----------------------------
// Short-term memory (STM)
// -----------------------------
export function stmSet(mem, key, value) {
    mem.stm.set(key, value);
}
export function stmGet(mem, key) {
    return mem.stm.get(key);
}
export function stmClear(mem) {
    mem.stm.clear();
}
// -----------------------------
// Long-term memory (LTM)
// -----------------------------
export function ltmSet(mem, key, value) {
    mem.ltm.set(key, value);
}
export function ltmGet(mem, key) {
    return mem.ltm.get(key);
}
export function ltmHas(mem, key) {
    return mem.ltm.has(key);
}
// -----------------------------
// Collective memory (CM)
// -----------------------------
export function cmSet(key, value) {
    collectiveMemory.data.set(key, value);
}
export function cmGet(key) {
    return collectiveMemory.data.get(key);
}
export function cmHas(key) {
    return collectiveMemory.data.has(key);
}
export function cmAll() {
    return Array.from(collectiveMemory.data.entries());
}
