# Use Bun runtime (handles TypeScript natively)
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

# Expose the port
EXPOSE 8080

# Start with Bun
CMD ["bun", "run", "apps/api/index.ts"]andles TypeScript natively)
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
