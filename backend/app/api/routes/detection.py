import shutil
import time
from math import ceil
from typing import Optional

from app.db.base import get_db
from app.models.detection import Detection
from app.models.detection_detail import DetectionDetail
from app.models.schemas import DetectionResponse, PaginateResponse
from app.services.detector import PersonDetector
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy import desc
from sqlalchemy.orm import Session

router = APIRouter()
detector = PersonDetector()


@router.post("/detect", response_model=DetectionResponse)
async def detect_people(
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    temp_file = f"/tmp/{file.filename}"
    with open(temp_file, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        start_time = time.time()
        result, output_path = detector.detect(temp_file, conf=0.5)
        processing_time = time.time() - start_time

        # Save to database
        detection = Detection(
            num_people=len(result.boxes),
            image_path=output_path,
            original_filename=file.filename,
            confidence=0.5,
            processing_time=processing_time,
            image_width=result.orig_shape[1],
            image_height=result.orig_shape[0],
        )
        db.add(detection)
        db.flush()

        # Save detection details
        for bbox, conf, cls in zip(
            result.boxes.xyxy, result.boxes.conf, result.boxes.cls
        ):
            bbox = bbox.tolist()
            detail = DetectionDetail(
                detection_id=detection.id,
                confidence=float(conf),
                x1=bbox[0],
                y1=bbox[1],
                x2=bbox[2],
                y2=bbox[3],
                class_name=result.names[int(cls)],
                class_id=int(cls),
            )
            db.add(detail)

        db.commit()

        return detection
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=PaginateResponse)
async def get_detections(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    min_people: Optional[int] = Query(None, ge=0),
    max_people: Optional[int] = Query(None, ge=0),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * limit
    query = db.query(Detection)

    if min_people:
        query = query.filter(Detection.num_people >= min_people)
    if max_people:
        query = query.filter(Detection.num_people <= max_people)
    if search:
        query = query.filter(Detection.original_filename.ilike(f"%{search}%"))

    query = query.order_by(desc(Detection.created_at))
    detections = query.offset(skip).limit(limit).all()
    total = query.count()
    pages = ceil(total / limit) if limit > 0 else 1

    return {
        "total": total,
        "page": page,
        "pages": pages,
        "limit": limit,
        "data": detections,
    }
