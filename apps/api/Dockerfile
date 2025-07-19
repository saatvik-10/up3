# Use Bun runtime (handles TypeScript natively)
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy everything (monorepo)
COPY . .

# Install dependencies for the whole monorepo
RUN bun install

# Generate Prisma client (this was missing!)
RUN cd packages/db && bunx prisma generate

# Expose the port
EXPOSE 8080

# Start with Bun
CMD ["bun", "run", "apps/api/index.ts"]
