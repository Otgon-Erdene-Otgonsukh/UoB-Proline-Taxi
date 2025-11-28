FROM node:25-alpine AS deps
WORKDIR /app
# Copy dependency files.
COPY package.json package-lock.json* ./
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else npm install; \
    fi

# Build stage
FROM node:25-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass env vars needed for build (Neon / Prisma)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma schema and files.
RUN npx prisma generate

# Build the next.js project.
RUN npm run build


# Production
FROM node:25-alpine AS runner
WORKDIR /app

# Env variable to make next.js run as production.
ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone server output and modules.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Open port 3000
EXPOSE 3000

CMD ["node", "server.js"]