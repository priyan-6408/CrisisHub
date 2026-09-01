from fastapi import APIRouter
from backend.shared.schemas import IncidentResponse, IncidentListResponse

router = APIRouter(prefix="/incidents", tags=["incidents"])


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