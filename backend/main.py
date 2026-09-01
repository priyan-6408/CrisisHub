from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI(
    title="CrisisCopilot API",
    description="AI decision support backend for CrisisHub",
    version="1.0.0"
)


class Incident(BaseModel):
    incident_id: str
    location: str
    incident_type: str
    severity: int
    people_affected: int = 0
    people_trapped: int = 0
    elderly_people: int = 0
    mobility_issue: bool = False

    distance_to_units: Dict[str, float] = {}
    available_resources: Dict[str, List[str]] = {}


def calculate_priority(incident: Incident):

    score = 0

    score += incident.severity * 10
    score += min(incident.people_affected * 5, 20)
    score += min(incident.people_trapped * 10, 20)
    score += min(incident.elderly_people * 5, 10)

    if incident.mobility_issue:
        score += 10

    return min(score, 100)


def generate_recommendation(incident: Incident):

    score = calculate_priority(incident)

    reasons = []

    if incident.severity >= 8:
        reasons.append("High severity incident")

    if incident.people_trapped > 0:
        reasons.append("People are trapped")

    if incident.elderly_people > 0:
        reasons.append("Elderly people affected")

    if incident.mobility_issue:
        reasons.append("Mobility assistance required")

    if incident.distance_to_units:

        unit = min(
            incident.distance_to_units,
            key=incident.distance_to_units.get
        )

        distance = incident.distance_to_units[unit]

        reasons.append(
            f"{unit} is approximately {distance} km away"
        )

    else:
        unit = "No unit available"
        reasons.append("No responder distance data available")

    return {
        "incident_id": incident.incident_id,
        "recommended_unit": unit,
        "recommendation": f"Recommend dispatch of {unit}",
        "priority_score": score,
        "reasons": reasons
    }


@app.get("/")
def home():

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

    result = generate_recommendation(incident)

    return {
        "success": True,
        "incident": incident,
        "recommendation": result
    }