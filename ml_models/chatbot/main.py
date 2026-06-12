import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware

from model.loader import ModelLoader
from routes.chat_routes import router as chat_router
from routes.health_routes import router as health_router

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    expected_key = os.getenv("API_KEY", "sc-live-8f9d2a1b4c7e5f0a9b8c7d6e5f4a3b2c")
    if api_key != expected_key:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing X-API-Key header"
        )

# Logging setup
logging.basicConfig(
    level   = logging.INFO,
    format  = '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt = '%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger('smartchild')


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load config
    model_path     = os.getenv('MODEL_PATH', './model/weights')
    base_model     = os.getenv('BASE_MODEL', 'Qwen/Qwen2.5-1.5B-Instruct')
    use_4bit       = os.getenv('USE_4BIT', 'true').lower() == 'true'
    device         = os.getenv('DEVICE', 'auto')

    app.state.MAX_NEW_TOKENS = int(os.getenv('MAX_NEW_TOKENS', 150))
    app.state.TEMPERATURE    = float(os.getenv('TEMPERATURE', 0.7))

    logger.info('Loading SmartChild chatbot model...')
    loader = ModelLoader(
        model_path = model_path,
        base_model = base_model,
        use_4bit   = use_4bit,
        device     = device,
    )
    app.state.model_loader = loader
    logger.info('Model loaded successfully')
    
    yield
    # Cleanup if needed
    logger.info('Shutting down SmartChild backend...')

app = FastAPI(
    title="SmartChild API",
    description="FastAPI backend for SmartChild chatbot.",
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

# Register routers
app.include_router(chat_router, prefix="/chat", dependencies=[Depends(verify_api_key)])
app.include_router(health_router, prefix="")

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv('PORT', 5001))
    logger.info(f'Starting SmartChild API on port {port}')
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
