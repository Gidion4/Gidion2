export function planGoal(goal) {
    const steps = [
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
