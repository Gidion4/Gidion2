/**
 * Simple session memory store.
 * - in‑memory map keyed by sessionId
 * - TTL support (basic)
 * - placeholder for vector store integration
 */
const store = new Map();
export function setSessionValue(sessionId, key, value, ttlMs) {
    if (!store.has(sessionId))
        store.set(sessionId, new Map());
    const map = store.get(sessionId);
    map.set(key, { value, expiresAt: ttlMs ? Date.now() + ttlMs : null });
}
export function getSessionValue(sessionId, key) {
    const map = store.get(sessionId);
    if (!map)
        return undefined;
    const entry = map.get(key);
    if (!entry)
        return undefined;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
        map.delete(key);
        return undefined;
    }
    return entry.value;
}
export function clearSession(sessionId) {
    store.delete(sessionId);
}
