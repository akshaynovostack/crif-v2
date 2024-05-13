# Use an official Node.js runtime as the base image
FROM node:18.20.2

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm i

# Copy the rest of the application code to the working directory
COPY . .

COPY .env ./.env

# Expose the port your app runs on
EXPOSE 4003

# Start the Node.js application
CMD ["node", "-r", "dotenv/config", "server.js"]