# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files from root directory
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy frontend source code from root
COPY public/ ./public/
COPY src/ ./src/

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration from root directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
