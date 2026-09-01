from fastapi import FastAPI
from backend.routes.incident_routes import router as incident_router
from backend.routes.action_routes import router as action_router
from backend.routes.approval_routes import router as approval_router


app = FastAPI(
    title="CrisisHub API",
    version="1.0.0",
)

app.include_router(incident_router)
app.include_router(action_router)
app.include_router(approval_router)


@app.get("/")
def root():
    return {
        "message": "CrisisHub API is running",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
