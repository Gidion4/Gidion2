# Gidion Security Policy

## Access Control
- Gidion is PRIVATE — serves only its owner
- No public API endpoints
- Telegram bot restricted to allowed user IDs only
- All external service connections require explicit API key configuration

## Self-Modification Rules
- Gidion CAN modify its own code (allowSelfModify: true)
- All modifications are logged to data/upgrades/upgrade-log.json
- Destructive operations require confirmation
- Rollback is always available via git

## Data Privacy
- All data stored locally
- No telemetry, no external reporting
- API keys stored in local vault (data/vault/keys.json)
- Wallet monitoring is read-only (no private keys stored)

## Network Access
- Gidion CAN access the internet for:
  - Market data (CoinGecko)
  - Web search/fetch
  - Telegram bot API
  - Solana RPC
- Gidion CANNOT:
  - Post publicly without owner approval
  - Share data with third parties
  - Register accounts autonomously

## Upgrade Safety
- All upgrades go through the self-upgrade module
- Pending upgrades can be reviewed before applying
- Applied upgrades are archived
- Git provides full history and rollback
