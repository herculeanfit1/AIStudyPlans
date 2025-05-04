FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Add non-privileged user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodeuser -G nodejs

# Install dependencies with explicit ignore of scripts for security
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund && \
    npm cache clean --force

# Copy source files and build
COPY . .
RUN npm run build

# Production image with minimal dependencies
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Set Node.js to run in production mode
ENV NODE_ENV=production

# Add non-privileged user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodeuser -G nodejs

# Copy package files and install only production dependencies
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --ignore-scripts --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy built code from builder stage
COPY --from=builder /app/dist ./dist

# Copy security configuration
COPY --from=builder /app/tsconfig.json ./

# Set proper permissions
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose MCP server port
EXPOSE 3333

# Run with least privilege
CMD ["node", "dist/index.js"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3333/health || exit 1 