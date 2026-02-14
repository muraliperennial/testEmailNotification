# Use the official Playwright image as the base
# This image includes Node.js, Browsers, and OS dependencies
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of your application code
COPY . .

# Ensure the report directory exists and is writable
RUN mkdir -p playwright-report && chmod -R 777 playwright-report

# Default command (can be overridden by the YML file)
CMD ["npx", "playwright", "test"]