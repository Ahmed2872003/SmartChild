from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "SmartChild API is running (FastAPI)"}

@router.get("/model/info")
async def model_info(request: Request):
    loader = request.app.state.model_loader
    if loader:
        info = loader.info()
        info["status"] = "ok"
        return info
    return {"status": "error", "message": "Model not loaded"}, 503
