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

# Run npm build
echo "Running npm build..."
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully."
else
    echo "Build failed. Please check the logs for errors."
    exit 1
fi
