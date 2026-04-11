# GIDION // BLACKSMITH

**Autonomous AI Assistant with Integrated Trading System**

An open-source, self-hostable AI agent that runs on your own machine. No cloud dependency, no subscription fees, your data stays with you.

## Features

### Gidion Core (AI Assistant)
- **21 modules, 77+ tools** for autonomous operation
- Natural language interface
- File management, shell commands, web browsing
- Email (ProtonMail), Telegram, Discord integrations
- Solana wallet monitoring (read-only)
- Self-upgrading capabilities

### Blacksmith Trading System (14 modules)
- **Market Structure** — HH/HL/BOS/MSS detection
- **Wick Analyzer** — Wick significance, level mapping
- **Liquidity Sweep** — Liquidity zones, sweep detection
- **Volume/Orderflow** — Delta, CVD, absorption analysis
- **Execution Intel** — Fill probability, slippage estimation
- **Trade Manager** — Position lifecycle, stops, partial exits
- **High Leverage Optimizer** — Kelly criterion, risk of ruin
- **RL Decision Layer** — Trade journal, pattern learning
- **Meme Coin Factory** — Create coins about trends
- **Sniper Bot** — Optimal entry timing
- **Night Mode** — 24/7 market scanning
- **Social Monitor** — Trending topics detection
- **Trading Bot** — RSI/MACD/SMA signals
- **Portfolio Allocator** — Capital bucketing

## Quick Start

### Option 1: Docker
```bash
docker build -t gidion .
docker run -p 3210:3210 -v ./data:/app/data --name gidion -d gidion
```

### Option 2: Node.js (no dependencies)
```bash
node start.js
```

Then open: http://localhost:3210

## Requirements

- Node.js 18+ (or Docker)
- 4GB RAM minimum
- Internet connection (for AI providers)

## Configuration

Optional API keys in `data/vault/keys.json`:
- OpenAI API key
- Anthropic API key
- Telegram bot token

## Tech Stack

- Pure Node.js (no external dependencies beyond stdlib)
- Express-free (uses built-in http module)
- ES Modules
- Docker-ready

## License

MIT

---

*Built with autonomous operation in mind. Gidion works while you sleep.*
