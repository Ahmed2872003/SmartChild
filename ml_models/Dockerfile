FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libgl1 \
    libglib2.0-0 \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Download and extract model weights from Google Drive
RUN python setup_models.py

# Expose the HF Space port
EXPOSE 7860

# Run the API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
