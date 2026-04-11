# GIDION // BLACKSMITH - Windows Installation Guide

## Vaihtoehto 1: Docker (Suositeltu)

### 1. Asenna Docker Desktop
1. Lataa: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
2. Asenna ja käynnistä Docker Desktop

### 2. Lataa ja pura Gidion
```powershell
# Luo kansio
mkdir C:\Gidion
cd C:\Gidion

# Lataa paketti (korvaa URL oikealla)
curl -L -o gidion.tar.gz "LATAUS_LINKKI"
tar -xzf gidion.tar.gz
```

### 3. Buildaa ja aja Dockerissa
```powershell
cd gidion
docker build -t gidion .
docker run -p 3210:3210 -v C:\GidionData:/app/data --name gidion -d gidion
```

### 4. Avaa selaimessa
- Gidion UI: http://localhost:3210
- Blacksmith: http://localhost:3210/blacksmith.html

---

## Vaihtoehto 2: Suora Node.js (Ei vaadi Dockeria)

### 1. Asenna Node.js 20+
1. Lataa: https://nodejs.org/
2. Asenna (valitse "Add to PATH")

### 2. Lataa ja pura Gidion
```powershell
mkdir C:\Gidion
cd C:\Gidion
curl -L -o gidion.tar.gz "LATAUS_LINKKI"
tar -xzf gidion.tar.gz
```

### 3. Käynnistä
```powershell
cd gidion
node start.js
```

### 4. Avaa selaimessa
- Gidion UI: http://localhost:3210
- Blacksmith: http://localhost:3210/blacksmith.html

---

## Tiedostorakenne

```
C:\Gidion\gidion\
├── start.js              # Käynnistyspiste
├── package.json         # Konfiguraatio
├── Dockerfile          # Docker-kuva
├── docker-compose.yml  # Docker Compose
├── core/               # Gidion ydin
│   ├── server.js       # API-palvelin
│   ├── orchestrator.js  # Työkalujen hallinta
│   ├── provider.js     # AI-provider (Ollama/OpenAI)
│   ├── memory.js       # Muisti
│   └── ...
├── modules/            # Toiminnallisuudet
│   ├── shell.js        # Shell-komennot
│   ├── files.js       # Tiedostonhallinta
│   ├── web.js        # Web-selailu
│   ├── search.js     # Haku
│   ├── email.js      # Sähköposti
│   ├── telegram.js   # Telegram
│   ├── solana.js    # Solana (vain luku)
│   ├── trading-sim.js # Paper trading
│   ├── tasks.js     # Tehtävälista
│   ├── voice.js    # Puhe
│   └── blacksmith/ # TRADING SYSTEM
│       ├── market-structure.js
│       ├── wick-analyzer.js
│       ├── liquidity-sweep.js
│       ├── volume-orderflow.js
│       ├── execution-intel.js
│       ├── trade-manager.js
│       ├── high-leverage-optimizer.js
│       ├── rl-decision-layer.js
│       ├── memecoin-factory.js
│       ├── sniper-bot.js
│       ├── night-mode.js
│       ├── social-monitor.js
│       ├── trading-bot.js
│       ├── portfolio-allocator.js
│       ├── autonomous-scheduler.js
│       ├── blacksmith.js
│       └── api-routes.js
├── agents/            # AI agentit
│   ├── planner.js
│   ├── coder.js
│   ├── researcher.js
│   └── ...
├── ui/               # Web-käyttöliittymät
│   ├── index.html    # Pää-UI (Jarvis-tyylinen)
│   └── blacksmith.html # Trading dashboard
└── data/             # Data (tallennetaan erikseen)
    ├── memory/
    ├── solana/
    └── blacksmith/
```

---

## Konfigurointi

### API-avaimet (valinnainen)
Luo `data/vault/keys.json`:
```json
{
  "openai": "sk-...",
  "anthropic": "sk-ant-...",
  "telegram": "bot-token"
}
```

### Solana-lompakko (vain luku)
Luo `data/solana/wallet.json`:
```json
{
  "address": "SINUN_PUBLIC_KEY"
}
```

---

## Ongelmatilanteita

### "node: command not found"
Node.js ei ole PATH:ssä. Käynnistä uusi terminali tai asenna uudelleen.

### Port 3210 käytössä
```powershell
set PORT=3211
node start.js
```

### Docker ei käynnisty
1. Käynnistä Docker Desktop uudelleen
2. Tarkista tehtävähallinnasta ettei vanhoja Docker-prosesseja ole

---

## Päivitykset

Gidion päivittyy automaattisesti kun ajat `npm start` — se tarkistaa uusimman version.
