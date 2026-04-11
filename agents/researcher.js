export const name = 'researcher';
export const description = 'Researches topics by searching the web and synthesizing findings';

export async function run(input, ctx) {
  const messages = [
    {
      role: 'system',
      content: [
        'You are a research agent. Given a topic or question:',
        '1. Search the web using the web_search tool',
        '2. Fetch relevant pages with web_fetch',
        '3. Synthesize findings into a clear summary',
        'Respond with your research findings.'
      ].join(' ')
    },
    { role: 'user', content: input }
  ];

  return await ctx.chat(messages);
}
