# Use the official Node.js 18.3.0 image as the base image
FROM node:18.3.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Install the client dependencies
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

# Go back to the root directory
WORKDIR /app

# Expose the port on which your application listens
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
