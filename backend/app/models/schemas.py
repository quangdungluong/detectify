from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class DetectionDetailResponse(BaseModel):
    id: int
    detection_id: int
    confidence: float
    x1: float
    y1: float
    x2: float
    y2: float
    class_name: str
    class_id: int

    class Config:
        from_attributes = True


class DetectionResponse(BaseModel):
    id: int
    timestamp: datetime
    num_people: int
    image_path: str
    original_filename: str
    confidence: Optional[float] = None
    processing_time: Optional[float] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None
    details: Optional[List[DetectionDetailResponse]] = None

    class Config:
        from_attributes = True


class PaginateResponse(BaseModel):
    total: int
    page: int
    limit: int
    pages: int
    data: list[DetectionResponse]

    class Config:
        from_attributes = True


class ImageUrlRequest(BaseModel):
    image_url: HttpUrl
