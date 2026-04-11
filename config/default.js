export default {
  assistantName: 'Gidion',
  version: '0.2.0',

  mode: 'cheap', // cheap | balanced | deep

  providers: {
    default: 'ollama',
    ollama: {
      endpoint: 'http://127.0.0.1:11434',
      chatModel: 'qwen2.5:3b',
      deepModel: 'qwen2.5:7b',
      visionModel: 'llava:7b'
    },
    // future: openai, anthropic, local-llama-cpp, etc.
  },

  memory: {
    journalDir: '../data/memory/journal',
    factsPath: '../data/memory/facts.json',
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
    mode: 'cli', // cli | api | both
    apiPort: 3210
  }
};
