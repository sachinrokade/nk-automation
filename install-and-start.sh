#!/bin/bash

set -e

echo "=========================================="
echo "Naukri Job Automation - Install & Start"
echo "=========================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo ""
  echo "Installing dependencies (this may take a few minutes)..."
  npm install --legacy-peer-deps
else
  echo "Dependencies already installed"
fi

# Create required directories
echo ""
echo "Creating required directories..."
mkdir -p logs
mkdir -p resumes
mkdir -p src/assets/config

# Check configuration
if [ ! -f "src/assets/config/app-config.json" ]; then
  echo ""
  echo "⚠️  WARNING: src/assets/config/app-config.json not found!"
  echo "Please update the config file with your Naukri credentials before starting."
fi

echo ""
echo "=========================================="
echo "Starting Angular development server..."
echo "=========================================="
echo ""
echo "The application will be available at: http://localhost:4200"
echo ""

npm start
