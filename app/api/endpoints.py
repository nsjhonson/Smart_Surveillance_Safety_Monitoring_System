from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.violation import Violation, ViolationType
from app.schemas.violation import Violation as ViolationSchema
from app.cv.processor import VideoProcessor
from typing import List

router = APIRouter()

# Global Processor Instance
# In a real production app, this might be managed by a dependency or singleton manager.
video_processor = VideoProcessor(source=0) # Default to webcam 0

@router.get("/video_feed")
async def video_feed():
    """
    Stream video from the active processor.
    """
    if not video_processor.running:
        # Return a placeholder or 404 if not running (or could stream a static image)
        # For now, we'll just return a 404 to indicate no stream
        raise HTTPException(status_code=404, detail="Video processing is not running")

    return StreamingResponse(
        video_processor.generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.post("/control/start")
async def start_detection(source: str = "0"):
    """
    Start detection.
    :param source: Camera index (e.g. "0") or video file path.
    """
    if video_processor.running:
        return {"message": "Detection is already running."}
    
    # Update source if provided
    try:
        # Try to convert to int if it's a number (camera index)
        final_source = int(source)
    except ValueError:
        final_source = source

    video_processor.source = final_source
    video_processor.start()
    return {"message": f"Detection started on source {final_source}."}

@router.post("/control/stop")
async def stop_detection():
    if not video_processor.running:
        return {"message": "Detection is not running."}
    
    video_processor.stop()
    return {"message": "Detection stopped."}

@router.get("/alerts", response_model=List[ViolationSchema])
async def get_alerts(db: AsyncSession = Depends(get_db), limit: int = 50):
    result = await db.execute(select(Violation).order_by(Violation.timestamp.desc()).limit(limit))
    violations = result.scalars().all()
    return violations

