# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy the rest of the application code
COPY . .

# Disable ESLint during build in Docker (works in Linux environment)
ENV NEXT_DISABLE_ESLINT=1

# Build the Next.js application
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]