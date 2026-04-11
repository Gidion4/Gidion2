export default {
  assistantName: 'Gidion',
  version: '2.0.0',

  mode: 'balanced',

  providers: {
    default: 'ollama',
    ollama: {
      endpoint: 'http://127.0.0.1:11434',
      chatModel: 'llama3.1:8b',
      deepModel: 'llama3.1:8b',
      visionModel: 'llava:7b'
    },
  },

  // Free APIs - no keys needed
  freeApis: {
    crypto: {
      coingecko: 'https://api.coingecko.com/api/v3',
      binancePublic: 'https://api.binance.com/api/v3',
      jupiter: 'https://price.jup.ag/v6',
      dexscreener: 'https://api.dexscreener.com/latest',
    },
    news: {
      rss: [
        'https://cointelegraph.com/rss',
        'https://cryptonews.com/news/feed/',
        'https://decrypt.co/feed',
      ],
      hackernews: 'https://hacker-news.firebaseio.com/v0',
    },
    market: {
      fearGreed: 'https://api.alternative.me/fng/',
      coinpaprika: 'https://api.coinpaprika.com/v1',
    },
    ai: {
      // Free AI model APIs
      groq: { endpoint: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', needsKey: true },
      openrouter: { endpoint: 'https://openrouter.ai/api/v1', model: 'meta-llama/llama-3.3-70b-instruct:free', needsKey: true },
      together: { endpoint: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', needsKey: true },
    },
    weather: {
      openmeteo: 'https://api.open-meteo.com/v1/forecast',
      wttr: 'https://wttr.in',
    },
    search: {
      duckduckgo: 'https://api.duckduckgo.com/',
      wikipedia: 'https://en.wikipedia.org/api/rest_v1',
    },
    solana: {
      helius: 'https://api.helius.xyz/v0',
      solscan: 'https://public-api.solscan.io',
      raydium: 'https://api-v3.raydium.io',
    }
  },

  memory: {
    journalDir: './data/memory/journal',
    factsPath: './data/memory/facts.json',
    maxContextTokens: 4096
  },

  modules: {
    autoDiscover: true,
    dir: './modules'
  },

  agents: {
    dir: './agents'
  },

  security: {
    confirmDestructive: true,
    allowSelfModify: true,
    allowExternalNetwork: true,
    allowExternalPosting: false
  },

  runtime: {
    mode: 'api',
    apiPort: 3210
  }
};
