from app.models.base import BaseModel
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class DetectionDetail(BaseModel):
    __tablename__ = "detection_details"

    detection_id = Column(Integer, ForeignKey("detections.id"), nullable=False)
    confidence = Column(Float, nullable=False)
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    class_name = Column(String, nullable=False)
    class_id = Column(Integer, nullable=False)

    # relationship
    detection = relationship("Detection", back_populates="details")
