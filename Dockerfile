# Use a lightweight Node.js base image
FROM node:alpine3.20 AS builder

# Set working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Use a clean Node.js image for production
FROM node:alpine3.20

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