# Use Bun runtime (like Node.js but faster)
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy everything (since it's a monorepo)
COPY . .

# Install dependencies for hub
RUN cd apps/hub && bun install

# Expose WebSocket port
EXPOSE 8081

# Start the hub
CMD ["bun", "run", "apps/hub/index.ts"]
