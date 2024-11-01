# Set the desired Node.js and npm versions
$NODE_VERSION = "14.21.2"
$NPM_VERSION = "6.14.17"

# Function to check Node.js and npm versions
function Check-Versions {
    Write-Host "Checking Node.js and npm versions..."
    $NODE_VERSION_INSTALLED = node -v
    $NPM_VERSION_INSTALLED = npm -v

    if ($NODE_VERSION_INSTALLED -ne "v$NODE_VERSION" -or $NPM_VERSION_INSTALLED -ne $NPM_VERSION) {
        Write-Host "Required Node.js version: $NODE_VERSION, npm version: $NPM_VERSION"
        Write-Host "Installed Node.js version: $NODE_VERSION_INSTALLED, npm version: $NPM_VERSION_INSTALLED"
        exit 1
    }
    Write-Host "Node.js and npm versions are correct."
}

# Function to execute commands in a directory and show current directory
function Execute-In-Directory($command) {
    Write-Host "Current directory: $(Get-Location)"
    Write-Host "Executing: $command"
    Invoke-Expression $command
    Write-Host "--------------------------------"
}

# Step 1: Check versions
Check-Versions

# Step 2: Install npm packages and build project in root directory
Execute-In-Directory "npm install"
Execute-In-Directory "npm run build"

# Step 3: Go to child directory
cd "dashboard_code"
Execute-In-Directory "npm install"
Execute-In-Directory "npm run build"

# Step 4: Move back to the root directory
cd ..

# Step 5: Start the server
Execute-In-Directory "nodemon ecosystem.config.js"
