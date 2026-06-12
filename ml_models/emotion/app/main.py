import os
from contextlib import asynccontextmanager
from typing import Dict, List
import secrets

from fastapi import FastAPI, File, HTTPException, UploadFile, Security, Depends
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.predictor import EmotionPredictor

MODEL_PATH   = os.getenv("MODEL_PATH",   "best_model.pth")
MAPPING_PATH = os.getenv("MAPPING_PATH", "label_mapping.json")
SCALER_PATH  = os.getenv("SCALER_PATH",  "feature_scaler.pkl")
DEVICE       = os.getenv("DEVICE",       "auto")

# --- Security ---
API_KEY_NAME = "X-API-Key"
API_KEY = os.getenv("API_KEY", "sk-emotion-api-9f8d7c6b5a41")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(status_code=403, detail="Could not validate API Key")
# ----------------

MAX_UPLOAD_MB = 10
ALLOWED_MIME  = {"image/jpeg", "image/png", "image/webp", "image/bmp"}

predictor: EmotionPredictor = None  # type: ignore


@asynccontextmanager
async def lifespan(app: FastAPI):
    global predictor
    predictor = EmotionPredictor(
        model_path=MODEL_PATH,
        label_mapping_path=MAPPING_PATH,
        scaler_path=SCALER_PATH,
        device=DEVICE,
    )
    print(f"Model loaded | device: {predictor.device}")
    yield


app = FastAPI(
    title="Children's Drawing Emotion Analysis API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    probabilities: Dict[str, float]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

class ClassesResponse(BaseModel):
    classes: List[str]


@app.get("/health", response_model=HealthResponse, tags=["System"])
def health():
    return {"status": "ok", "model_loaded": predictor is not None}


@app.get("/classes", response_model=ClassesResponse, tags=["Model"], dependencies=[Depends(get_api_key)])
def classes():
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    return {"classes": predictor.class_names}


@app.post("/predict", response_model=PredictionResponse, tags=["Model"], dependencies=[Depends(get_api_key)])
async def predict(file: UploadFile = File(...)):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(status_code=415, detail=f"Unsupported file type '{file.content_type}'.")
    image_bytes = await file.read()
    if len(image_bytes) > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_UPLOAD_MB} MB limit.")
    try:
        return predictor.predict(image_bytes)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

