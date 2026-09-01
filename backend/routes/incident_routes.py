import json
import math
from pathlib import Path

from fastapi import APIRouter
from backend.shared.schemas import IncidentResponse, IncidentListResponse
from backend.copilot.decision_engine import Incident as CopilotIncident
from backend.copilot.plan_generator import generate_recommendation
from backend.copilot.safety_critic import review_recommendation


router = APIRouter(prefix="/incidents", tags=["incidents"])

RESPONDERS_FILE = Path("backend/data/responders.json")


def calculate_distance_km(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float,
) -> float:
    """Calculate the distance between two coordinates using the Haversine formula."""

    earth_radius_km = 6371.0

    lat1 = math.radians(latitude1)
    lat2 = math.radians(latitude2)

    delta_lat = math.radians(latitude2 - latitude1)
    delta_lon = math.radians(longitude2 - longitude1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return earth_radius_km * c


def get_available_responder_distances(
    latitude: float,
    longitude: float,
) -> dict[str, float]:
    """Return distances to all available responders."""

    with open(RESPONDERS_FILE, encoding="utf-8") as file:
        responders = json.load(file)

    distances = {}

    for responder in responders:
        if responder.get("status") != "available":
            continue

        distance = calculate_distance_km(
            latitude,
            longitude,
            responder["latitude"],
            responder["longitude"],
        )

        distances[responder["responder_id"]] = round(distance, 2)

    return distances


@router.get("/", response_model=IncidentListResponse)
def get_incidents():
    incidents = [
        IncidentResponse(
            incident_id="CR-1048",
            title="Flood Medical Emergency",
            incident_type="Flood + Medical",
            description="Elderly person trapped in flooded house",
            severity="critical",
            priority_score=97,
            latitude=12.845,
            longitude=80.226,
            people_affected=2,
            status="active",
            verified=False,
            confidence=0.9,
        ),
        IncidentResponse(
            incident_id="CR-1049",
            title="Flood Emergency",
            incident_type="Flood",
            description="Water entering residential area",
            severity="high",
            priority_score=74,
            latitude=12.850,
            longitude=80.220,
            people_affected=6,
            status="active",
            verified=False,
            confidence=0.85,
        ),
        IncidentResponse(
            incident_id="CR-1050",
            title="Medical Emergency",
            incident_type="Medical",
            description="Minor injury reported",
            severity="moderate",
            priority_score=45,
            latitude=12.840,
            longitude=80.230,
            people_affected=1,
            status="active",
            verified=False,
            confidence=0.8,
        ),
    ]

    return {
        "incidents": incidents,
        "total": len(incidents),
    }


@router.get("/{incident_id}/recommendation")
def get_incident_recommendation(incident_id: str):
    incident = get_incident(incident_id)

    severity_map = {
        "low": 3,
        "moderate": 5,
        "high": 8,
        "critical": 10,
    }

    responder_distances = get_available_responder_distances(
        incident.latitude,
        incident.longitude,
    )

    copilot_incident = CopilotIncident(
        incident_id=incident.incident_id,
        location=f"{incident.latitude},{incident.longitude}",
        incident_type=incident.incident_type,
        severity=severity_map.get(incident.severity.lower(), 5),
        people_affected=incident.people_affected,
        people_trapped=(
            1
            if "trapped" in (incident.description or "").lower()
            else 0
        ),
        elderly_people=(
            1
            if "elderly" in (incident.description or "").lower()
            else 0
        ),
        distance_to_units=responder_distances,
    )

    recommendation = generate_recommendation(copilot_incident)

    safety_review = review_recommendation(
        copilot_incident,
        recommendation,
    )

    return {
        "incident": incident,
        "recommendation": recommendation,
        "safety_review": safety_review,
    }


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str):
    return IncidentResponse(
        incident_id=incident_id,
        title="Flood Medical Emergency",
        incident_type="Flood + Medical",
        description="Elderly person trapped in flooded house",
        severity="critical",
        priority_score=97,
        latitude=12.845,
        longitude=80.226,
        people_affected=2,
        status="active",
        verified=False,
        confidence=0.9,
    )