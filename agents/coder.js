export const name = 'coder';
export const description = 'Writes, edits, and reviews code. Can modify Gidion itself when allowed.';

export async function run(input, ctx) {
  const messages = [
    {
      role: 'system',
      content: [
        'You are a coding agent. You write clean, minimal code.',
        'When asked to modify Gidion, you can read and write files via tools.',
        'Always explain what you changed and why.',
        'Prefer small, focused changes over large rewrites.'
      ].join(' ')
    },
    { role: 'user', content: input }
  ];

  const response = await ctx.chat(messages);
  return response;
}
