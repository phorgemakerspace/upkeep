# Use a lightweight Node.js base image
FROM node:bullseye AS builder

# Install necessary build tools for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Ensure database folder exists
RUN mkdir -p /app/data

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --build-from-source

# Copy the rest of the app and build it
COPY . .

RUN npm rebuild better-sqlite3 --build-from-source
RUN npm run build

# Use a clean Node.js image for production
FROM node:bullseye

# Set working directory inside the container
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Ensure database folder exists
RUN mkdir -p /app/data

# Expose the port SvelteKit runs on
EXPOSE 5173

# Start the SvelteKit app
CMD ["node", "build"]