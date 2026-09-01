from fastapi import APIRouter
from backend.shared.schemas import ActionCreate, ActionResponse

router = APIRouter(prefix="/actions", tags=["Actions"])


@router.post("", response_model=ActionResponse)
def create_action(action: ActionCreate):
    return ActionResponse(
        incident_id=action.incident_id,
        action_type=action.action_type,
        description=action.description,
        responder_id=action.responder_id,
        action_id="ACT-001",
        status="pending",
    )


@router.get("/{action_id}", response_model=ActionResponse)
def get_action(action_id: str):
    return ActionResponse(
        incident_id="CR-1048",
        action_type="rescue",
        description="Send rescue team to incident location",
        responder_id=None,
        action_id=action_id,
        status="pending",
    )