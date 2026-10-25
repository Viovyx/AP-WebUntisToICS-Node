ARG NODE_VERSION=26.12.1-alpine

FROM node:${NODE_VERSION}

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json *package-lock.json* ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .

# Expose server port
EXPOSE 3000

# Start application
CMD ["npm", "start"]