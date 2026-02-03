from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app.include_router(api_router)

# Mount Static Files (React Build)
# Ensure frontend is built first!
static_dir = os.path.join(os.getcwd(), "frontend", "dist")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

@app.get("/")
async def serve_spa():
    return FileResponse(os.path.join(static_dir, "index.html"))

# Catch-all for SPA routing (React Router)
@app.get("/{full_path:path}")
async def serve_spa_path(full_path: str):
    # If API path, let it fall through (handled by router above? No, router is included first)
    # Actually, router is included first, so specific matches should be handled.
    # But generic path match might occlude.
    # Better strategy: API router first. Static second.
    # Since API starts with /video_feed, /alerts, /control - unique enough.
    possible_file = os.path.join(static_dir, full_path)
    if os.path.exists(possible_file) and os.path.isfile(possible_file):
        return FileResponse(possible_file)
    return FileResponse(os.path.join(static_dir, "index.html"))
