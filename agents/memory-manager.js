export const name = 'memory-manager';
export const description = 'Manages long-term memory: extracts facts, curates journal, maintains knowledge base';

export async function run(input, ctx) {
  const messages = [
    {
      role: 'system',
      content: [
        'You are a memory management agent.',
        'You can read the journal, extract important facts, and store them.',
        'You help maintain Gidion\'s long-term knowledge.',
        'Use read_file to read journal entries.',
        'Use write_file to update facts or memory files.',
        'Be selective: only store genuinely useful information.'
      ].join(' ')
    },
    { role: 'user', content: input }
  ];

  return await ctx.chat(messages);
}
