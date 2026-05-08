FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Build-time placeholder. Prisma 7's prisma.config.ts validates DATABASE_URL
# exists when `prisma generate` runs (via npm postinstall), but Kessel only
# injects the real URL at runtime — so we provide a dummy here. The runtime
# value supplied by Kessel overrides this.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# Copy prisma schema BEFORE npm install so postinstall (prisma generate) succeeds
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci

FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
# Same build-time placeholder for the explicit `prisma generate` below.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Prisma schema needed at runtime so `prisma db push` can sync prod DB on first start.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 8080
ENV PORT=8080
# Background `prisma db push` so it doesn't block PORT=8080 bind (Cloud Run/Kessel
# kills the container if it doesn't bind within the startup probe timeout).
# Schema sync runs in parallel; output goes to /tmp/prisma-push.log for debugging.
# Idempotent: no-op once tables exist. The runtime DATABASE_URL is auto-injected
# by Kessel; the Dockerfile build-time placeholder doesn't reach runner stage.
CMD ["sh", "-c", "(npx prisma db push > /tmp/prisma-push.log 2>&1 &) && exec npm start"]
