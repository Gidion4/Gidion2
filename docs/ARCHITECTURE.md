# Gidion AI Assistant Core — Architecture

## Overview

Gidion is an open-source, local-first, modular multi-agent AI system.
Not a chatbot. A personal AI operating system.

## Structure

```
gidion/
├── core/
│   ├── main.js            # CLI entrypoint
│   ├── orchestrator.js    # Central brain: routing, tool calls, agent delegation
│   ├── provider.js        # LLM provider abstraction (Ollama, future others)
│   ├── memory.js          # Journal + facts persistence
│   ├── module-loader.js   # Auto-discovers and loads modules/
│   └── agent-loader.js    # Auto-discovers and loads agents/
├── modules/
│   ├── _spec.js           # Module interface specification
│   ├── shell.js           # Shell command execution
│   ├── files.js           # File read/write/list
│   ├── web.js             # Web fetch + search
│   └── vibe-coder.js      # Self-modification capabilities
├── agents/
│   ├── planner.js         # Task decomposition
│   └── coder.js           # Code writing/editing
├── config/
│   └── default.js         # Default configuration
└── package.json           # MIT licensed
```

## How it works

1. User input → Orchestrator
2. Orchestrator builds system prompt with available tools + agents
3. Sends to LLM provider (Ollama default, stub fallback)
4. If LLM responds with tool/agent JSON → executes it
5. Otherwise returns text response
6. All turns logged to journal memory

## Extending

### Add a module
Drop a `.js` file in `modules/` exporting: `name`, `description`, `version`, `tools[]`, `init(ctx)`

### Add an agent
Drop a `.js` file in `agents/` exporting: `name`, `description`, `run(input, ctx)`

### Add a provider
Add adapter in `core/provider.js` and config in `config/default.js`

## CLI commands

- `/tools` — list loaded tools
- `/modules` — list loaded modules
- `/agents` — list loaded agents
- `exit` — quit

## Self-modification

When `security.allowSelfModify` is true, the vibe-coder module and coder agent
can read and write Gidion's own source files. This enables vibe coding:
point Gidion at a goal and it plans, writes, tests, and commits changes to itself.

## Future roadmap

- API server mode (Express/Fastify)
- Web UI
- Telegram/Discord connectors
- Docker Compose for VPS deployment
- Encrypted secrets vault
- Vision/multimodal support
- Learning/feedback loop
```
