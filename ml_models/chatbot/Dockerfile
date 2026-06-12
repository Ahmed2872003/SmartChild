FROM python:3.10-slim

WORKDIR /app

# Install system dependencies needed for compiling and downloading
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Make the start script executable
RUN chmod +x start.sh

# Expose the API port
EXPOSE 5001

# Run the start script which downloads the model and starts the server
CMD ["./start.sh"]
