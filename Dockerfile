# Use a specific version of Node.js
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set execute permissions on entrypoint script
RUN chmod +x /app/docker/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/app/docker/entrypoint.sh"]
