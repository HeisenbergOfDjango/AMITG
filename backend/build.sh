#!/usr/bin/env bash
# build.sh - Custom build script for Render.com deployment

# Exit on error
set -e

# Print commands
set -x

# Make direct_install.sh executable
chmod +x direct_install.sh

# Run the direct installation script
echo "Running direct installation script"
./direct_install.sh

echo "Build completed successfully"
