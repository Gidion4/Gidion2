import { MultiAgentPipeline, PipelineStep } from "../agents/multiAgentPipeline.js";
import { Agent } from "../agents/agentTypes.js";

/**
 * Example integration: create agents using simple objects
 * and run a pipeline. Demonstrates integration with pipeline API.
 */

export function createDemoAgent(id: string, role: string): Agent {
  return {
    meta: { id, name: `${id}`, role, capabilities: [role] },
    async invoke(ctx) {
      return { ok: true, output: { id, role, received: ctx.input } };
    }
  };
}

export async function runSystemIntegration(input: any) {
  const planner = createDemoAgent("planner", "planning");
  const executor = createDemoAgent("executor", "execution");

  const pipeline = new MultiAgentPipeline();
  const steps: PipelineStep[] = [
    { id: "plan", agent: planner, requiredRole: "planning", retries: 1 },
    { id: "execute", agent: executor, requiredRole: "execution", retries: 1 }
  ];
  for (const s of steps) pipeline.addStep(s);

  pipeline.addHook((event, meta) => {
    console.log("[pipeline hook]", event, meta?.summary ?? "");
  });

  const result = await pipeline.run(input, "session-demo");
  return result;
}



