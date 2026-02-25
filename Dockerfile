FROM node:25-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Development stage for testing and local development
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Set environment and copy appropriate env file if it exists
ARG NODE_ENV=production
ARG ENVIRONMENT_FILE=.env.production
ENV NODE_ENV=${NODE_ENV}

# Copy environment file if it exists
RUN if [ -f "$ENVIRONMENT_FILE" ]; then \
      echo "Using environment file: $ENVIRONMENT_FILE"; \
      if [ "$ENVIRONMENT_FILE" != ".env.production" ]; then \
        cp $ENVIRONMENT_FILE .env.production; \
      fi; \
    else \
      echo "No environment file found at $ENVIRONMENT_FILE"; \
    fi

# Create the CI build script for Docker environment - necessary because COPY can be inconsistent with script files
RUN echo '#!/bin/sh' > docker-ci-build.sh && \
    echo 'set -e' >> docker-ci-build.sh && \
    echo 'echo "Running Docker-specific CI build script..."' >> docker-ci-build.sh && \
    echo 'export SKIP_AUTH=true' >> docker-ci-build.sh && \
    echo 'NODE_ENV=production npm run build' >> docker-ci-build.sh && \
    chmod +x docker-ci-build.sh

# Use Docker CI build script for production builds in CI environment
RUN if [ "$NODE_ENV" = "production" ]; then \
      echo "Running production build with Docker CI build script"; \
      ./docker-ci-build.sh; \
    else \
      echo "Running standard development build"; \
      npm run build; \
    fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy the entire .next directory and set permissions
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Add a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the Next.js server
CMD ["npm", "run", "start"] 