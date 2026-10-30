# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:26-alpine AS build

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:26-alpine AS runtime

# Non-root user for security (Code Engine runs as non-root by default)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy deps from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy application source
COPY server.js      ./
COPY openapi.json   ./
COPY routes/        ./routes/
COPY data/          ./data/
COPY public/        ./public/

# Set ownership
RUN chown -R appuser:appgroup /app
USER appuser

# ── Runtime config ────────────────────────────────────────────────────────────
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Healthcheck for Code Engine / Kubernetes liveness probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "server.js"]
