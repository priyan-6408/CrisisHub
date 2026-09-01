from fastapi import APIRouter
from backend.shared.schemas import IncidentResponse, IncidentListResponse

router = APIRouter(prefix="/incidents", tags=["Incidents"])


# Get all incidents
@router.get("", response_model=IncidentListResponse)
def get_incidents():
    incidents = [
        IncidentResponse(
            id="CR-1048",
            incident_type="Flood + Medical",
            description="Elderly person trapped in flooded house",
            severity="critical",
            priority=97,
            location="Kelambakkam",
            people_affected=2,
            status="active",
        ),
        IncidentResponse(
            id="CR-1049",
            incident_type="Flood",
            description="Water entering residential area",
            severity="high",
            priority=74,
            location="Navalur",
            people_affected=6,
            status="active",
        ),
        IncidentResponse(
            id="CR-1050",
            incident_type="Medical",
            description="Minor injury reported",
            severity="moderate",
            priority=31,
            location="Sholinganallur",
            people_affected=1,
            status="active",
        ),
    ]

    return {
        "incidents": incidents,
        "total": len(incidents),
    }


# Get one incident
@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str):
    return IncidentResponse(
        incident_id=incident_id,
        title="Flood Medical Emergency",
        incident_type="Flood + Medical",
        description="Elderly person trapped in flooded house",
        severity="critical",
        priority=97,
        location="Kelambakkam",
        latitude=12.845,
        longitude=80.226,
        people_affected=2,
        status="active",
    )