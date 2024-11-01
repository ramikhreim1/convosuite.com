#!/bin/bash

# Set the desired Node.js and npm versions
NODE_VERSION="14.21.2"
NPM_VERSION="6.14.17"

# Function to check Node.js and npm versions
check_versions() {
    echo "Checking Node.js and npm versions..."
    NODE_VERSION_INSTALLED=$(node -v)
    NPM_VERSION_INSTALLED=$(npm -v)

    if [[ "$NODE_VERSION_INSTALLED" != "v$NODE_VERSION" || "$NPM_VERSION_INSTALLED" != "$NPM_VERSION" ]]; then
        echo "Required Node.js version: $NODE_VERSION, npm version: $NPM_VERSION"
        echo "Installed Node.js version: $NODE_VERSION_INSTALLED, npm version: $NPM_VERSION_INSTALLED"
        exit 1
    fi
    echo "Node.js and npm versions are correct."
}

# Function to execute commands in a directory and show current directory
execute_in_directory() {
    echo "Current directory: $(pwd)"
    echo "Executing: $1"
    eval $1
    echo "--------------------------------"
}

# Step 1: Check versions
check_versions

# Step 2: Install npm packages and build project in root directory
execute_in_directory "npm install"
execute_in_directory "npm run build"

# Step 3: Go to child directory
cd dashboard_code || exit
execute_in_directory "npm install"
execute_in_directory "npm run build"

# Step 4: Move back to the root directory
cd ..

# Step 5: Start the server
execute_in_directory "nodemon ecosystem.config.js"
