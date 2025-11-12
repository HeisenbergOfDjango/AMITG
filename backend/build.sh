#!/usr/bin/env bash
# build.sh - Custom build script for Render.com deployment

# Exit on error
set -e

# Print commands
set -x

# Install Python dependencies with binary preference
pip install --upgrade pip

# Use the Render-specific requirements file
if [ -f "requirements-render.txt" ]; then
  echo "Using Render-specific requirements file"
  pip install --prefer-binary -r requirements-render.txt
else
  echo "Using standard requirements file"
  pip install --prefer-binary -r requirements.txt
fi

echo "Build completed successfully"
