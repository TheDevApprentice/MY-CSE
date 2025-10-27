# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install && pnpm install -D terser 

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Use a lightweight web server to serve the application
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]