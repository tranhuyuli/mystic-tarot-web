# ==========================================
# Multi-stage Dockerfile for Mystic Tarot Web
# ==========================================

# --- Stage 1: Build Frontend Assets ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# --- Stage 2: Production Lightweight Runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built static files and server from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
