export interface PipelineStep {
  name: string;
  agent?: any;
  intent?: string;
  input?: any;
  action: (input: any) => Promise<any>;
}

export interface PipelineDefinition {
  id?: string;
  steps: PipelineStep[];
  description?: string;
}

export function createPipeline(idOrSteps?: any, steps?: any, description = ""): PipelineDefinition {
  if (Array.isArray(idOrSteps)) {
    return { steps: idOrSteps, description };
  }
  if (Array.isArray(steps)) {
    return { id: idOrSteps, steps, description };
  }
  return { steps: [], description };
}

export async function runPipeline(pipeline: PipelineDefinition, input: any): Promise<any> {
  let result = input;
  for (const step of pipeline.steps) {
    if (step.action) {
      result = await step.action(result);
    }
  }
  return { ok: true, result, steps: pipeline.steps };
}
