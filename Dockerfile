FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Add --no-cache to save space
RUN apk add --no-cache libc6-compat python3 make g++ gcc libc-dev linux-headers udev eudev-dev

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Clean npm cache after installation to save space
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application using standard npm command
RUN npm run build
# Verify the standalone output was created
RUN ls -la .next

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create app directory with proper permissions
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Install sharp for image processing
RUN npm install --no-save sharp@latest

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application with standard npm command
CMD ["npm", "start"] 