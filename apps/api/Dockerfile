# Use Bun runtime (handles TypeScript natively)
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy everything (monorepo)
COPY . .

# Install dependencies for API
RUN cd apps/api && bun install

# Expose the port
EXPOSE 8080

# Start with Bun (can run .ts files directly)
CMD ["bun", "run", "apps/api/index.ts"]
