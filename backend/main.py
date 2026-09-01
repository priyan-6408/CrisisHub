from fastapi import FastAPI
from backend.routes.incident_routes import router as incident_router

app = FastAPI(
    title="CrisisHub API",
    version="1.0.0",
)

app.include_router(incident_router)


@app.get("/")
def root():
    return {
        "message": "CrisisHub API is running",
        "status": "ok"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }