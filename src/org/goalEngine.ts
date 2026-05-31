// ------------------------------------------------------------
// GIDION LEVEL 3 — GOAL ENGINE v3 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Vastaa:
//   - goalien luonnista
//   - goalien tallennuksesta
//   - goalien hakemisesta
//   - goalien listauksesta
// ------------------------------------------------------------

export interface Goal {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  status: "pending" | "in-progress" | "done";
  priority?: number;
  tags?: string[];
}

const goalStore: Record<string, Goal> = {};

// ------------------------------------------------------------
// LUO TAVOITE
// ------------------------------------------------------------
export function createGoal(data: {
  title: string;
  description?: string;
  priority?: number;
  tags?: string[];
}): Goal {
  const id = "goal-" + Math.random().toString(36).substring(2);

  const goal: Goal = {
    id,
    title: data.title,
    description: data.description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: "pending",
    priority: data.priority ?? 1,
    tags: data.tags ?? []
  };

  goalStore[id] = goal;
  return goal;
}

// ------------------------------------------------------------
// HAE TAVOITE
// ------------------------------------------------------------
export function getGoal(id: string): Goal | undefined {
  return goalStore[id];
}

// ------------------------------------------------------------
// LISTAA TAVOITTEET
// ------------------------------------------------------------
export function listGoals(): Goal[] {
  return Object.values(goalStore);
}

// ------------------------------------------------------------
// PÄIVITÄ TAVOITE
// ------------------------------------------------------------
export function updateGoal(id: string, patch: Partial<Goal>): Goal | undefined {
  const g = goalStore[id];
  if (!g) return undefined;

  const updated = {
    ...g,
    ...patch,
    updatedAt: Date.now()
  };

  goalStore[id] = updated;
  return updated;
}

// ------------------------------------------------------------
// EI CLI-BLOKKIA (ESM-YHTEENSOPIVA)
// ------------------------------------------------------------

