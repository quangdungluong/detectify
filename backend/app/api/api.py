from app.api.routes.detection import router as detection_router
from fastapi import APIRouter

router = APIRouter()
router.include_router(detection_router, prefix="/detection", tags=["detection"])
