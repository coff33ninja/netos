# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Installing..."
    
    # Check if winget is available
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install OpenJS.NodeJS
    } else {
        # Fallback to direct download
        $nodeUrl = "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi"
        $nodeInstaller = "$env:TEMP\node-installer.msi"
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller
        Start-Process msiexec.exe -Wait -ArgumentList "/i $nodeInstaller /quiet"
        Remove-Item $nodeInstaller
    }
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Install ts-node globally
npm install -g ts-node typescript

# Run the setup script
ts-node setup.ts