from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_get_incidents():
    response = client.get("/incidents/")
    assert response.status_code == 200

    data = response.json()

    assert "incidents" in data
    assert "total" in data
    assert data["total"] == len(data["incidents"])


def test_get_single_incident():
    response = client.get("/incidents/CR-1048")
    assert response.status_code == 200

    data = response.json()

    assert data["incident_id"] == "CR-1048"
    assert data["incident_type"] == "Flood + Medical"
    assert data["priority_score"] == 97


def test_create_approval():
    response = client.post(
        "/approvals",
        json={
            "incident_id": "CR-1048",
            "action": "Send rescue team",
            "approved": True,
            "approved_by": "admin"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["incident_id"] == "CR-1048"
    assert data["approved"] is True
    assert data["status"] == "approved"


def test_create_action():
    response = client.post(
        "/actions",
        json={
            "incident_id": "CR-1048",
            "action_type": "rescue",
            "description": "Send rescue team to incident location"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["incident_id"] == "CR-1048"
    assert data["action_type"] == "rescue"
    assert data["status"] == "pending"