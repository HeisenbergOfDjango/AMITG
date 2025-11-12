#!/usr/bin/env bash
# start_worker.sh - Start script for the keep-alive worker

# Print commands
set -x

# Show current directory
echo "Current directory: $(pwd)"
ls -la

# Start the keep-alive worker
echo "Starting the keep-alive worker..."
python keep_alive.py
