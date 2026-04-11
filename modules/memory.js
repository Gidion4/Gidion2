/**
 * MEMORY MODULE v2.0 - Enhanced Semantic Memory
 */

export const name = 'memory';
export const description = 'Enhanced semantic memory with relationship mapping';
export const version = '2.0.0';

const MAX_FACTS = 5000;
const MIN_CONFIDENCE = 0.6;

const memory = {
  facts: [],
  relations: [],
  entities: {}
};

export function init(ctx) {
  loadMemory(ctx);
  ctx.registerHeartbeat?.('memory_consolidate', 3600000);
  ctx.on('heartbeat:memory_consolidate', () => consolidateMemory(ctx));

  return {
    tools: [
      { name: 'memory_store', params: { fact: 'string', tags: 'array', confidence: 'number' } },
      { name: 'memory_recall', params: { query: 'string', limit: 'number' } },
      { name: 'memory_learn', params: { subject: 'string', predicate: 'string', object: 'string' } },
      { name: 'memory_stats', params: {} },
      { name: 'memory_forget', params: { id: 'string' } }
    ]
  };
}

function loadMemory(ctx) {
  try {
    const facts = ctx.loadData?.('memory/facts.json');
    if (facts) memory.facts = JSON.parse(facts);
    const relations = ctx.loadData?.('memory/relations.json');
    if (relations) memory.relations = JSON.parse(relations);
  } catch (e) {}
}

function saveMemory(ctx) {
  try {
    ctx.saveData?.('memory/facts.json', JSON.stringify(memory.facts));
    ctx.saveData?.('memory/relations.json', JSON.stringify(memory.relations));
  } catch (e) {}
}

function tokenize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
}

function similarity(t1, t2) {
  const s1 = new Set(t1), s2 = new Set(t2);
  const inter = [...s1].filter(x => s2.has(x)).length;
  return inter / new Set([...s1, ...s2]).size;
}

function consolidateMemory(ctx) {
  const seen = new Map();
  memory.facts = memory.facts.filter(f => {
    const key = tokenize(f.content).sort().join(' ');
    const ex = seen.get(key);
    if (ex && f.confidence > ex.confidence) seen.set(key, f);
    else if (!ex) seen.set(key, f);
    return !ex || f.confidence <= ex.confidence;
  });
  if (memory.facts.length > MAX_FACTS) memory.facts = memory.facts.sort((a,b) => b.confidence - a.confidence).slice(0, MAX_FACTS);
  saveMemory(ctx);
}

export async function handleTool(name, params, ctx) {
  switch (name) {
    case 'memory_store': {
      const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      const fact = {
        id,
        content: params.fact,
        tags: params.tags || [],
        confidence: params.confidence || 0.8,
        created: new Date().toISOString(),
        accessed: new Date().toISOString(),
        access_count: 0
      };
      memory.facts.push(fact);
      saveMemory(ctx);
      return { stored: true, id, total: memory.facts.length };
    }

    case 'memory_recall': {
      const q = params.query || '';
      const lim = params.limit || 10;
      let results = memory.facts.filter(f => f.confidence >= MIN_CONFIDENCE);
      if (q) {
        results = results.map(f => ({ ...f, relevance: similarity(tokenize(q), tokenize(f.content)) }))
          .filter(f => f.relevance > 0.1)
          .sort((a, b) => b.relevance - a.relevance);
      }
      results.slice(0, lim).forEach(f => { f.access_count++; f.accessed = new Date().toISOString(); });
      saveMemory(ctx);
      return { results: results.slice(0, lim), total: results.length };
    }

    case 'memory_learn': {
      const id = Math.random().toString(36).substr(2, 9);
      memory.relations.push({ id, subject: params.subject, predicate: params.predicate, object: params.object, strength: 0.8 });
      saveMemory(ctx);
      return { learned: true, id };
    }

    case 'memory_stats':
      return {
        facts: memory.facts.length,
        relations: memory.relations.length,
        avg_confidence: memory.facts.length ? memory.facts.reduce((s,f) => s + f.confidence, 0) / memory.facts.length : 0
      };

    case 'memory_forget': {
      const idx = memory.facts.findIndex(f => f.id === params.id);
      if (idx !== -1) { memory.facts.splice(idx, 1); saveMemory(ctx); return { forgotten: true }; }
      return { forgotten: false };
    }
  }
}
