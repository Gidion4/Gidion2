import { PipelineStep, PipelineDefinition } from '../brain/pipelineEngine.js';

export function planGoal(goal: any): PipelineDefinition {
  const steps: PipelineStep[] = [
    {
      name: 'analyze-goal',
      action: async () => ({ ok: true, goal })
    }
  ];

  return {
    id: 'pipeline_' + goal.id,
    steps,
    description: 'Auto-generated pipeline for goal'
  };
}

