#!/bin/bash

echo "=========================================="
echo "Naukri Job Automation - Setup Script"
echo "=========================================="

# Install Node.js dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Create required directories
echo ""
echo "Creating required directories..."
mkdir -p logs
mkdir -p resumes
mkdir -p src/assets/config

# Check if config file exists
if [ ! -f "src/assets/config/app-config.json" ]; then
  echo "Config file not found, creating default..."
  cp src/assets/config/app-config.json.example src/assets/config/app-config.json 2>/dev/null || echo "Please configure src/assets/config/app-config.json"
fi

echo ""
echo "=========================================="
echo "Setup completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update credentials in src/assets/config/app-config.json"
echo "2. Add your resume to resumes/resume.pdf"
echo "3. Run: npm start"
echo ""
