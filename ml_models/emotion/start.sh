#!/bin/bash
if [ ! -f "best_model.pth" ]; then
    echo "Downloading models from Google Drive..."
    # If the user sets DRIVE_FILE_ID as a HF Variable, it will use it. Otherwise defaults to the provided ID.
    FILE_ID=${DRIVE_FILE_ID:-1gz5c49iToqMn7kLDM8qA_mQsbRfLhPgx}
    gdown --id $FILE_ID -O model_files.zip
    unzip -o model_files.zip
    rm model_files.zip
fi

echo "Starting Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 7860
