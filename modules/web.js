export const name = 'web';
export const description = 'Fetch web pages and search the internet';
export const version = '1.0.0';

export const tools = [
  {
    name: 'web_fetch',
    description: 'Fetch a URL and return text content',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        maxChars: { type: 'number', default: 20000 }
      },
      required: ['url']
    },
    execute: async (params) => {
      const res = await fetch(params.url);
      if (!res.ok) return { error: `HTTP ${res.status}` };
      const text = await res.text();
      return { content: text.slice(0, params.maxChars || 20000) };
    }
  },
  {
    name: 'web_search',
    description: 'Search the web via DuckDuckGo lite',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        count: { type: 'number', default: 5 }
      },
      required: ['query']
    },
    execute: async (params) => {
      const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(params.query)}`;
      const res = await fetch(url);
      const text = await res.text();
      return { raw: text.slice(0, 10000) };
    }
  }
];

export async function init(ctx) {
  ctx.log('web module loaded');
}
