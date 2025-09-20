#!/bin/bash

# Storyboard Application Startup Script
# This script installs dependencies and starts the development server

set -e  # Exit on any error

echo "🎬 Starting Storyboard Application..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    print_status "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Install dependencies
print_status "Installing dependencies..."
if [ -f "package.json" ]; then
    print_status "Running npm install..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies."
        exit 1
    fi
else
    print_error "package.json not found in current directory."
    exit 1
fi

# Start the development server
print_status "Starting development server..."
print_warning "The application will be available at: http://localhost:3000"
print_warning "Press Ctrl+C to stop the server"
echo ""

# Start the Next.js development server
npm run dev
