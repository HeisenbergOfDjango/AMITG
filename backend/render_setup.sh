#!/usr/bin/env bash
# render_setup.sh - Complete setup script for Render deployment

# Exit on error
set -e

# Print commands for debugging
set -x

# Show current directory and files
echo "Current directory: $(pwd)"
ls -la

# Rename the problematic requirements.txt to prevent Render from using it
echo "Renaming requirements.txt to prevent automatic processing"
if [ -f "requirements.txt" ]; then
  mv requirements.txt requirements.txt.bak
fi

# Upgrade pip
pip install --upgrade pip

# Install packages individually without dependencies that might require compilation
echo "Installing packages individually..."
pip install --no-deps fastapi==0.95.2
pip install --no-deps uvicorn==0.22.0
pip install --no-deps python-dotenv==1.0.0
pip install --no-deps starlette==0.27.0
pip install --no-deps click==8.1.3
pip install --no-deps h11==0.14.0
pip install --no-deps pydantic==1.10.8
pip install --no-deps python-multipart==0.0.6
pip install --no-deps requests==2.31.0
pip install --no-deps typing-extensions==4.5.0
pip install --no-deps idna==3.4
pip install --no-deps certifi==2023.5.7
pip install --no-deps charset-normalizer==3.1.0
pip install --no-deps urllib3==2.0.3
pip install --no-deps anyio==3.7.0
pip install --no-deps sniffio==1.3.0
pip install --no-deps exceptiongroup==1.1.1

# Install Google API client packages
pip install --no-deps google-api-python-client==2.97.0
pip install --no-deps google-auth==2.22.0
pip install --no-deps google-auth-httplib2==0.1.0
pip install --no-deps google-auth-oauthlib==1.0.0

echo "All packages installed successfully"
