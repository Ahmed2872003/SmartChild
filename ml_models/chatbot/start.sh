#!/bin/bash

# Exit if any command fails
set -e

echo "========================================="
echo " Starting SmartChild Backend Deployment "
echo "========================================="

# 1. Download Model Weights if DRIVE_URL is provided
if [ -n "$DRIVE_URL" ]; then
    echo "DRIVE_URL detected! Downloading weights from Google Drive..."
    python scripts/download_model.py --drive_url "$DRIVE_URL"
else
    echo "No DRIVE_URL provided. Assuming model weights are already in ./model/weights or using base model."
fi

# 2. Start the FastAPI Server
echo "Starting Uvicorn Server..."
exec uvicorn main:app --host 0.0.0.0 --port 5001
