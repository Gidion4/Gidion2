/**
 * Simple session memory store.
 * - in‑memory map keyed by sessionId
 * - TTL support (basic)
 * - placeholder for vector store integration
 */

type MemoryEntry = {
  value: any;
  expiresAt?: number | null;
};

const store = new Map<string, Map<string, MemoryEntry>>();

export function setSessionValue(sessionId: string, key: string, value: any, ttlMs?: number) {
  if (!store.has(sessionId)) store.set(sessionId, new Map());
  const map = store.get(sessionId)!;
  map.set(key, { value, expiresAt: ttlMs ? Date.now() + ttlMs : null });
}

export function getSessionValue(sessionId: string, key: string) {
  const map = store.get(sessionId);
  if (!map) return undefined;
  const entry = map.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    map.delete(key);
    return undefined;
  }
  return entry.value;
}

export function clearSession(sessionId: string) {
  store.delete(sessionId);
}

