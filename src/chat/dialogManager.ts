import { MultiAgentPipeline } from "../agents/multiAgentPipeline.js";
import { getSessionValue, setSessionValue } from "../memory/sessionMemory.js";
import { codexAgent } from "../agents/codexAgent.js";
import { plannerAgent } from "../agents/planner.js";
import { inspectorAgent } from "../agents/inspector.js";

/**
 * DialogManager
 * - safe turn handling
 * - uses session memory
 * - does not access or log browser metadata
 */

export class DialogManager {
  private pipelineFactory() {
    const pipeline = new MultiAgentPipeline();
    pipeline.addHook((event, meta) => {
      console.log(`[dialog.pipeline] ${event} ${meta?.stepId ?? ""} ${meta?.summary ?? ""}`);
    });
    return pipeline;
  }

  private buildStepsForTurn(userInput: any) {
    return [
      { id: "planner", agent: plannerAgent, retries: 1, timeoutMs: 5000 },
      { id: "codex", agent: codexAgent, retries: 1, timeoutMs: 15000 },
      { id: "inspector", agent: inspectorAgent, retries: 0, timeoutMs: 3000 }
    ];
  }

  async handleTurn(sessionId: string, userInput: any): Promise<{ ok: boolean; reply: any; details?: any }> {
    const convo = getSessionValue(sessionId, "conversation") ?? [];
    convo.push({ role: "user", text: userInput, ts: Date.now() });
    setSessionValue(sessionId, "conversation", convo, 1000 * 60 * 60);

    const pipeline = this.pipelineFactory();
    const steps = this.buildStepsForTurn(userInput);
    for (const s of steps) pipeline.addStep(s);

    const result = await pipeline.run({ sessionId, userInput }, sessionId);

    const codexRes = result.results?.["codex"] ?? null;
    const plannerRes = result.results?.["planner"] ?? null;

    let reply = null;
    if (codexRes && codexRes.ok) reply = codexRes.output;
    else if (plannerRes && plannerRes.ok) reply = plannerRes.output;
    else reply = { text: "En saanut luotua vastausta." };

    convo.push({ role: "assistant", text: reply, ts: Date.now() });
    setSessionValue(sessionId, "conversation", convo, 1000 * 60 * 60);

    return { ok: result.ok, reply, details: { pipelineSummary: result.ok ? "ok" : "error" } };
  }
}

