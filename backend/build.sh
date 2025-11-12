#!/usr/bin/env bash
# build.sh - Custom build script for Render.com deployment

# Exit on error
set -e

# Print commands
set -x

# Install Python dependencies with binary preference
pip install --upgrade pip
pip install --prefer-binary -r requirements.txt

echo "Build completed successfully"
