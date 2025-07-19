# Use Bun runtime 
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy everything (monorepo)
COPY . .

# Install dependencies for whole monorepo
RUN bun install

# Generate Prisma client (important!)
RUN cd packages/db && bunx prisma generate

# Start the validator
CMD ["bun", "run", "apps/validator/index.ts"]
