# GIDION // BLACKSMITH - Docker Image
FROM node:20-slim

WORKDIR /app

# Copy application
COPY . .

# No npm install needed - pure Node.js with built-in modules

# Create data directories
RUN mkdir -p data/blacksmith/{trades,portfolio,social,autonomous,memecoin,rl,sniper,hl,bot} \
    data/memory \
    data/vault

EXPOSE 3210

CMD ["node", "core/server.js"]
