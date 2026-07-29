# ─────────────────────────────────────────────────────────────
# Marhba — Backend Dockerfile
# Base: Node.js 20 LTS (Alpine for minimal image size)
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (layer caching — npm install only
# re-runs when package.json / package-lock.json actually change)
COPY package*.json ./

# Install production + dev dependencies
# (dev deps include nodemon — kept here for flexibility)
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port the app listens on
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
