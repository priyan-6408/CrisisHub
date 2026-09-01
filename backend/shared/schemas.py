from pydantic import BaseModel, Field
from typing import Optional, List


class IncidentCreate(BaseModel):
    title: str
    incident_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    people_affected: int = 0
    severity: str = "moderate"


class IncidentResponse(IncidentCreate):
    incident_id: str
    priority_score: int = Field(default=0, ge=0, le=100)
    status: str = "active"
    verified: bool = False
    confidence: float = Field(default=0.0, ge=0, le=1)


class ApprovalRequest(BaseModel):
    incident_id: str
    action: str
    approved: bool
    approved_by: Optional[str] = None


class ActionCreate(BaseModel):
    incident_id: str
    action_type: str
    description: str
    responder_id: Optional[str] = None


class ActionResponse(ActionCreate):
    action_id: str
    status: str = "pending"


class IncidentListResponse(BaseModel):
    incidents: List[IncidentResponse]
    total: int