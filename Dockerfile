# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the application with nodemon
CMD ["npm", "run", "start:dev"]
