# Use Bun runtime 
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy everything (monorepo)
COPY . .

# Install dependencies for validator
RUN cd apps/validator && bun install

# Start the validator
CMD ["bun", "run", "apps/validator/index.ts"]
