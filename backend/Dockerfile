# Use Node.js 20 with Debian (has apt)
FROM node:20-bullseye

# Install system dependencies for pdf-poppler and tesseract
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
