export function createPipeline(idOrSteps, steps, description = "") {
    if (Array.isArray(idOrSteps)) {
        return { steps: idOrSteps, description };
    }
    if (Array.isArray(steps)) {
        return { id: idOrSteps, steps, description };
    }
    return { steps: [], description };
}
export async function runPipeline(pipeline, input) {
    let result = input;
    for (const step of pipeline.steps) {
        if (step.action) {
            result = await step.action(result);
        }
    }
    return { ok: true, result, steps: pipeline.steps };
}
