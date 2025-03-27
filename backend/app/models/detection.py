from app.models.base import BaseModel
from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Detection(BaseModel):
    __tablename__ = "detections"

    timestamp = Column(DateTime, default=func.now(), nullable=False)
    num_people = Column(Integer, nullable=False)
    image_path = Column(String, nullable=False)
    original_filename = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    processing_time = Column(Float, nullable=True)
    image_width = Column(Integer, nullable=True)
    image_height = Column(Integer, nullable=True)

    # relationship
    details = relationship("DetectionDetail", back_populates="detection")
