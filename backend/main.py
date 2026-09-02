import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import HOST, PORT, CORS_ORIGINS, UPLOAD_DIR
from db.mongo import db_manager
from routers.inspection import router as inspection_router

app = FastAPI(
    title="PackGuard Legal Metrology AI Microservice",
    description="Python FastAPI backend serving OpenCV preprocessing, PaddleOCR, Legal Metrology Rules 2011 compliance engine, and ReportLab PDF generation.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for local image uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(inspection_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    await db_manager.connect()

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "PackGuard Legal Metrology Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongo_connected": db_manager.use_mongo
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
