from fastapi import APIRouter, File, HTTPException, UploadFile, Depends, Security, Request
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel
from typing import Dict, List
import os

router = APIRouter()

API_KEY_NAME = "X-API-Key"
API_KEY = os.getenv("API_KEY", "sk-emotion-api-9f8d7c6b5a41")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(status_code=403, detail="Could not validate API Key")

MAX_UPLOAD_MB = 10
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/bmp"}

class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    probabilities: Dict[str, float]

class ClassesResponse(BaseModel):
    classes: List[str]

@router.get("/classes", response_model=ClassesResponse, tags=["Model"], dependencies=[Depends(get_api_key)])
def classes(request: Request):
    predictor = request.app.state.emotion_predictor
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    return {"classes": predictor.class_names}

@router.post("/predict", response_model=PredictionResponse, tags=["Model"], dependencies=[Depends(get_api_key)])
async def predict(request: Request, file: UploadFile = File(...)):
    predictor = request.app.state.emotion_predictor
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
