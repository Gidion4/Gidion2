export const name = 'planner';
export const description = 'Breaks complex tasks into steps and delegates to tools/agents';

export async function run(input, ctx) {
  const messages = [
    {
      role: 'system',
      content: [
        'You are a task planner. Given a goal, break it into concrete steps.',
        'Each step should specify either a tool call or a sub-agent delegation.',
        'Respond with a JSON array of steps.',
        'Format: [{"step": 1, "action": "tool|agent", "target": "name", "input": "..."}]'
      ].join(' ')
    },
    { role: 'user', content: input }
  ];

  const response = await ctx.chat(messages);
  return response;
}
