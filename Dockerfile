FROM node:18.8-alpine as base
# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --ignore-engines; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
#COPY .env.production /.env.production
RUN yarn build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
# Node Modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/yarn.lock* /app/package-lock.json* /app/pnpm-lock.yaml* ./
# Payload artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
# Next.js artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/cache ./.next/cache
COPY --from=builder /app/src/utils/image-loader.js ./src/utils/image-loader.js
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /app/csp.js ./csp.js
COPY --from=builder /app/redirects.js ./redirects.js
RUN chown -R nextjs:nodejs .next
USER nextjs

EXPOSE 3004

CMD ["yarn", "run", "serve"]
