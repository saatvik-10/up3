# Use Node.js as the base
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json files first (for better caching)
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/

# Install all dependencies
RUN npm install

# Copy the actual code
COPY apps/api ./apps/api

# Expose the port your app runs on
EXPOSE 8080

# Command to start your app
CMD ["npm", "start", "--prefix", "apps/api"]
