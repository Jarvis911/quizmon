# Use an official node.js runtime as a parent image
FROM node:24-alpine

WORKDIR /app

# Copy package.js and package-lock.json to container, . is /app
COPY package*.json . 

# Install the dependency
RUN npm install 

# Copy the rest of the applications code
COPY . .

# Expose
EXPOSE 5000

# Command to run our application
CMD ["node", "./src/server.js"]