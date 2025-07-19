# Use Bun runtime 
FROM oven/bun:latest

# Install OpenSSL (fixes Prisma warning)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy everything (monorepo)
COPY . .

# Install dependencies for whole monorepo
RUN bun install

# Generate Prisma client (important!)
RUN cd packages/db && bunx prisma generate

# Expose WebSocket port
EXPOSE 8081

# Start the hub
CMD ["bun", "run", "apps/hub/index.ts"]
