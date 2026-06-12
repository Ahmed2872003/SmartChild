---
title: Emotion API
emoji: 🦀
colorFrom: red
colorTo: blue
sdk: docker
pinned: false
---

# Children's Drawing Emotion Analysis — API

REST API for predicting emotional state from children's drawings, built with FastAPI and served via Uvicorn. The model is an EfficientNet-B3 backbone fused with a 79-dimensional hand-crafted feature vector (HSV statistics, composition, LBP texture, spatial placement, drawing complexity, and Emotional Gradient Flow) through a learned Attention Fusion layer.

## Project Structure

```
deployment/
├── app/
│   ├── main.py                   # FastAPI application and endpoints
│   ├── model.py                  # Model architecture (must match training)
│   ├── predictor.py              # Inference wrapper
│   └── utils/
│       └── feature_extractor.py  # Hand-crafted feature pipeline
├── Dockerfile
├── requirements.txt
├── README.md
└── (Model files are downloaded dynamically from Google Drive)
```

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Security / API Key

The `/classes` and `/predict` endpoints are secured by an API key.
You must pass the header `X-API-Key` in all requests. By default, the key is `sk-emotion-api-9f8d7c6b5a41`, but you can change this via the `API_KEY` environment variable.

## Endpoints

| Method | Path       | Description                              | Auth Required |
|--------|------------|------------------------------------------|---------------|
| GET    | `/health`  | Service liveness check                   | No            |
| GET    | `/classes` | Returns the three emotion class labels   | Yes           |
| POST   | `/predict` | Accepts an image, returns prediction     | Yes           |
| GET    | `/docs`    | Interactive Swagger UI                   | No            |

## Request / Response

```bash
curl -X POST http://localhost:8000/predict \
  -H "X-API-Key: sk-emotion-api-9f8d7c6b5a41" \
  -F "file=@drawing.jpg"
```

```json
{
  "emotion": "happiness",
  "confidence": 0.923,
  "probabilities": {
    "happiness": 0.923,
    "anxiety_depression": 0.051,
    "anger_aggression": 0.026
  }
}
```

## Hugging Face Spaces Deployment

1. Create a new **Docker** Space on Hugging Face.
2. Upload the project files (`app/` folder, `Dockerfile`, `requirements.txt`, `README.md`) to the repository.
3. Hugging Face will automatically build the Docker image. During the build, it will download the `model_files.zip` directly from Google Drive and unzip the model weights.
4. The API will start on port `7860`.
5. Make requests to `https://<your-username>-<your-space-name>.hf.space/predict` using the `X-API-Key` header.

## Environment Variables

| Variable       | Default                        | Description               |
|----------------|--------------------------------|---------------------------|
| `API_KEY`      | `sk-emotion-api-9f8d7c6b5a41`  | API Authentication Key    |
| `MODEL_PATH`   | `best_model.pth`               | Path to model weights     |
| `MAPPING_PATH` | `label_mapping.json`           | Path to label mapping     |
| `SCALER_PATH`  | `feature_scaler.pkl`           | Path to feature scaler    |
| `DEVICE`       | `auto`                         | `cpu`, `cuda`, or `auto`  |

