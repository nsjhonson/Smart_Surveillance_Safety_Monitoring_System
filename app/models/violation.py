from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from app.core.database import Base
from datetime import datetime
import enum

class ViolationType(str, enum.Enum):
    HELMET = "Helmet Violation"
    MASK = "Mask Violation"
    INTRUSION = "Restricted Zone Intrusion"

class Violation(Base):
    __tablename__ = "violations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    violation_type = Column(String, index=True) # Storing as string to be simple, could interpret Enum
    confidence = Column(Float)
    camera_source = Column(String)
    image_path = Column(String, nullable=True)

    def __repr__(self):
        return f"<Violation {self.violation_type} at {self.timestamp}>"
