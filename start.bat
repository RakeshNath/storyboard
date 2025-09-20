@echo off
REM Storyboard Application Startup Script for Windows
REM This script installs dependencies and starts the development server

echo.
echo 🎬 Starting Storyboard Application...
echo ==================================

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo [INFO] Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm version: %NPM_VERSION%

REM Install dependencies
echo [INFO] Installing dependencies...
if exist "package.json" (
    echo [INFO] Running npm install...
    npm install
    
    if %errorlevel% equ 0 (
        echo [SUCCESS] Dependencies installed successfully!
    ) else (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo [ERROR] package.json not found in current directory.
    pause
    exit /b 1
)

REM Start the development server
echo [INFO] Starting development server...
echo [WARNING] The application will be available at: http://localhost:3000
echo [WARNING] Press Ctrl+C to stop the server
echo.

REM Start the Next.js development server
npm run dev
