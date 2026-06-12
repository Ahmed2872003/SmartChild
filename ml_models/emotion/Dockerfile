FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libgl1 unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY start.sh .
RUN chmod +x start.sh

COPY app/ ./app/

ENV MODEL_PATH=best_model.pth
ENV MAPPING_PATH=label_mapping.json
ENV SCALER_PATH=feature_scaler.pkl
ENV DEVICE=auto

# Hugging Face Spaces use port 7860
EXPOSE 7860

CMD ["./start.sh"]