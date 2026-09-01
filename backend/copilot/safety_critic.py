
    return {
        "message": "CrisisCopilot backend is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/recommend")
def recommend(incident: Incident):
