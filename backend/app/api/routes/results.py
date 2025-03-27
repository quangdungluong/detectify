from app.db.base import get_db
from app.models.detection import Detection
from app.models.schemas import DetectionResponse, PaginateResponse
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=PaginateResponse)
async def get_results(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    detections = (
        db.query(Detection)
        .order_by(Detection.timestamp.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    total = db.query(Detection).count()
    pages = (total + limit - 1) // limit

    return PaginateResponse(
        total=total, page=page, limit=limit, pages=pages, data=detections
    )


@router.get("/{detection_id}", response_model=DetectionResponse)
async def get_result(detection_id: int, db: Session = Depends(get_db)):
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")

    return detection
