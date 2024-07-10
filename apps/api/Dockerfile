FROM node:20-alpine AS base


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY . .

RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./

RUN pnpm run --filter=database generate
RUN pnpm run --filter=api build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs ./app/apps/api/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ./app/apps/api/.next/static ./apps/api/.next/static

USER nextjs

EXPOSE ${PORT}

ENV PORT ${PORT}
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/api/server.js"]
