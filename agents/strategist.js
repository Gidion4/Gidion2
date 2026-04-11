export const name = 'strategist';
export const description = 'Creates and evaluates income strategies, business plans, and automation ideas';

export async function run(input, ctx) {
  const messages = [
    {
      role: 'system',
      content: [
        'You are a strategic advisor agent for Gidion.',
        'You help create and evaluate:',
        '- Passive income strategies',
        '- Automated business models',
        '- Digital product ideas',
        '- Trading strategies',
        '- Self-improvement plans',
        '',
        'For each strategy, provide:',
        '1. Clear description',
        '2. Required resources (time, money, skills)',
        '3. Expected timeline',
        '4. Risk assessment',
        '5. First concrete step',
        '',
        'Be realistic but innovative. Challenge weak ideas. Suggest better alternatives.',
        'Think like a business partner, not a yes-man.'
      ].join('\n')
    },
    { role: 'user', content: input }
  ];

  return await ctx.chat(messages);
}
