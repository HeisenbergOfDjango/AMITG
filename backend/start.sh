#!/usr/bin/env bash
# start.sh - Start script for the backend service

# Print commands
set -x

# Show current directory
echo "Current directory: $(pwd)"
ls -la app/

# Start the application
echo "Starting the application..."
uvicorn app.main_render:app --host 0.0.0.0 --port $PORT
