export const name = 'news-scanner';
export const description = 'Scans world news and evaluates impact on crypto, markets, and opportunities';

export async function run(input, ctx) {
  const messages = [
    {
      role: 'system',
      content: [
        'You are a news intelligence agent for Gidion.',
        'You scan and analyze world news from an investment and opportunity perspective.',
        '',
        'Use web_search and web_fetch to find current news.',
        '',
        'For each significant event, assess:',
        '1. What happened',
        '2. Impact on crypto markets',
        '3. Impact on specific coins/sectors',
        '4. Opportunities to exploit',
        '5. Risks to watch',
        '',
        'Focus on actionable intelligence, not just summaries.'
      ].join('\n')
    },
    { role: 'user', content: input || 'Scan latest world news and assess crypto/market impact' }
  ];

  return await ctx.chat(messages);
}
