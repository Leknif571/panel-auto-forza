#!/bin/bash

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if the current directory is an npm project
if [ ! -f "package.json" ]; then
    echo "No package.json found! Please make sure you're in a Node.js project directory."
    exit 1
fi

# Install 'serve' globally if not already installed
if ! command -v serve &> /dev/null
then
    echo "'serve' is not installed. Installing 'serve' globally..."
    npm install -g serve
fi

# Run npm build
echo "Running npm build..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build completed successfully."
else
    echo "Build failed. Please check the logs for errors."
    exit 1
fi

# Serve the build directory on port 4000
echo "Serving the build directory on http://localhost:4000..."
serve -s build -l 4000 &

# Wait a moment for the server to start
sleep 3

# Open localhost:4000 in the default browser
echo "Opening http://localhost:4000 in the browser..."
open http://localhost:4000

echo "The app is running and has been opened in the browser."
