from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ViolationBase(BaseModel):
    violation_type: str
    confidence: float
    camera_source: str
    image_path: Optional[str] = None

class ViolationCreate(ViolationBase):
    pass

class Violation(ViolationBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
