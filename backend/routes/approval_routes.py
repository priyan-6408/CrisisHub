from fastapi import APIRouter
from backend.shared.schemas import ApprovalRequest

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.post("")
def create_approval(request: ApprovalRequest):
    return {
        "incident_id": request.incident_id,
        "action": request.action,
        "approved": request.approved,
        "approved_by": request.approved_by,
        "status": "approved" if request.approved else "rejected",
    }