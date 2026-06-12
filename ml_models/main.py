import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add chatbot and emotion to path so their internal imports work
sys.path.append(os.path.join(os.path.dirname(__file__), "chatbot"))
sys.path.append(os.path.join(os.path.dirname(__file__), "emotion"))

from chatbot.model.loader import ModelLoader as ChatbotModelLoader
from chatbot.routes.chat_routes import router as chat_router

from emotion.app.predictor import EmotionPredictor
from emotion_routes import router as emotion_router

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger('ml-api')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Load Chatbot Model
    chatbot_model_path = os.getenv('CHATBOT_MODEL_PATH', './chatbot/model/weights')
    chatbot_base_model = os.getenv('CHATBOT_BASE_MODEL', 'Qwen/Qwen2.5-1.5B-Instruct')
    chatbot_use_4bit   = os.getenv('CHATBOT_USE_4BIT', 'true').lower() == 'true'
    chatbot_device     = os.getenv('CHATBOT_DEVICE', 'auto')

    app.state.MAX_NEW_TOKENS = int(os.getenv('MAX_NEW_TOKENS', 150))
    app.state.TEMPERATURE    = float(os.getenv('TEMPERATURE', 0.7))

    logger.info('Loading Chatbot model...')
    try:
        chatbot_loader = ChatbotModelLoader(
            model_path=chatbot_model_path,
            base_model=chatbot_base_model,
            use_4bit=chatbot_use_4bit,
            device=chatbot_device,
        )
        app.state.model_loader = chatbot_loader
        logger.info('Chatbot model loaded successfully')
    except Exception as e:
        logger.error(f'Failed to load Chatbot model: {e}')
        app.state.model_loader = None

    # 2. Load Emotion Model
    emotion_model_path   = os.getenv("EMOTION_MODEL_PATH",   "./emotion/best_model.pth")
    emotion_mapping_path = os.getenv("EMOTION_MAPPING_PATH", "./emotion/label_mapping.json")
    emotion_scaler_path  = os.getenv("EMOTION_SCALER_PATH",  "./emotion/feature_scaler.pkl")
    emotion_device       = os.getenv("EMOTION_DEVICE",       "auto")

    logger.info('Loading Emotion model...')
    try:
        emotion_predictor = EmotionPredictor(
            model_path=emotion_model_path,
            label_mapping_path=emotion_mapping_path,
            scaler_path=emotion_scaler_path,
            device=emotion_device,
        )
        app.state.emotion_predictor = emotion_predictor
        logger.info(f"Emotion model loaded | device: {emotion_predictor.device}")
    except Exception as e:
        logger.error(f'Failed to load Emotion model: {e}')
        app.state.emotion_predictor = None

    yield
    logger.info('Shutting down ML APIs...')


app = FastAPI(
    title="Unified ML API",
    description="Combined FastAPI backend for SmartChild chatbot and emotion detection.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chatbot API key setup
chatbot_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
async def verify_chatbot_api_key(api_key: str = Security(chatbot_api_key_header)):
    expected_key = os.getenv("API_KEY", "sc-live-8f9d2a1b4c7e5f0a9b8c7d6e5f4a3b2c")
    if api_key != expected_key:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing X-API-Key header"
        )

# Register routers
app.include_router(chat_router, prefix="/chatbot", dependencies=[Depends(verify_chatbot_api_key)])
app.include_router(emotion_router, prefix="/emotion")

class HealthResponse(BaseModel):
    status: str
    chatbot_loaded: bool
    emotion_loaded: bool

@app.get("/health", response_model=HealthResponse, tags=["System"])
def health():
    return {
        "status": "ok",
        "chatbot_loaded": getattr(app.state, "model_loader", None) is not None,
        "emotion_loaded": getattr(app.state, "emotion_predictor", None) is not None,
    }

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv('PORT', 5001))
    logger.info(f'Starting Unified ML API on port {port}')
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
