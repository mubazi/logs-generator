# Use the official Node.js image with Alpine as the base image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and lock files to leverage Docker cache
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on the lock file
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    else npm install; fi

# Copy all files from the current directory to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Environment variables (adjust as needed)
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]