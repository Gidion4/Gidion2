// Core agent type definitions for deep orchestration

export type Capability = string;

export interface AgentMeta {
  id: string;
  name: string;
  role?: string;
  capabilities?: Capability[];
  description?: string;
  version?: string;
}

export interface AgentInvokeContext {
  input: any;
  sessionId?: string;
  traceId?: string;
  timeoutMs?: number;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  ok: boolean;
  output?: any;
  error?: string;
  meta?: Record<string, any>;
  durationMs?: number;
}

export interface Agent {
  meta: AgentMeta;
  invoke(ctx: AgentInvokeContext): Promise<AgentResult>;
  init?(): Promise<void>;
  shutdown?(): Promise<void>;
}




