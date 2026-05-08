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
# Background prisma db push so npm start binds PORT=8080 immediately.
# Push completes in ~5s; Next.js startup takes ~3s — tables ready before
# first request. Output goes to stdout via tee so it appears in kessel logs.
CMD ["sh", "-c", "npx prisma db push --accept-data-loss 2>&1 | tee /tmp/prisma-push.log & exec npm start"]
