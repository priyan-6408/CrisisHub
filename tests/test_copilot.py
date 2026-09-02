from backend.copilot.decision_engine import Incident, calculate_priority
from backend.copilot.plan_generator import (
    generate_recommendation,
    get_relevant_resource_types,
)
from backend.copilot.safety_critic import review_recommendation


def test_calculate_priority():
    incident = Incident(
        incident_id="CR-TEST-001",
        location="Chennai",
        incident_type="flood",
        severity=10,
        people_affected=120,
        people_trapped=2,
        elderly_people=1,
    )

    assert calculate_priority(incident) == 100


def test_generate_recommendation():
    incident = Incident(
        incident_id="CR-TEST-002",
        location="Chennai",
        incident_type="accident",
        severity=5,
        people_affected=2,
        distance_to_units={
            "R-001": 10.0,
            "R-002": 4.0,
        },
    )

    recommendation = generate_recommendation(incident)

    assert recommendation["recommended_unit"] == "R-002"
    assert recommendation["priority_score"] == 60


def test_get_relevant_resource_types():
    resource_types = get_relevant_resource_types("Flood + Medical")

    assert "rescue_boat" in resource_types
    assert "medical_kit" in resource_types
    assert "emergency_personnel" in resource_types


def test_generate_recommendation_with_resources():
    incident = Incident(
        incident_id="CR-TEST-005",
        location="Kelambakkam",
        incident_type="Flood + Medical",
        severity=10,
        people_affected=5,
        people_trapped=2,
        distance_to_units={
            "R-001": 10.0,
            "R-002": 2.0,
        },
        available_resources={
            "rescue_boat": ["Rescue Boats"],
            "medical_kit": ["Emergency Medical Kits"],
            "emergency_personnel": ["Rescue Personnel"],
        },
    )

    recommendation = generate_recommendation(incident)

    assert recommendation["recommended_unit"] == "R-002"
    assert recommendation["priority_score"] == 100

    assert "Rescue Boats" in recommendation["resources"]
    assert "Emergency Medical Kits" in recommendation["resources"]
    assert "Rescue Personnel" in recommendation["resources"]

    assert "Relevant resources available:" in recommendation["reasons"][-1]


def test_generate_recommendation_without_resources():
    incident = Incident(
        incident_id="CR-TEST-006",
        location="Chennai",
        incident_type="medical",
        severity=5,
        people_affected=1,
        distance_to_units={
            "R-001": 4.0,
        },
        available_resources={},
    )

    recommendation = generate_recommendation(incident)

    assert recommendation["recommended_unit"] == "R-001"
    assert recommendation["resources"] == []
    assert recommendation["reasons"][-1] == "No relevant resources available"


def test_safety_critic_needs_review():
    incident = Incident(
        incident_id="CR-TEST-003",
        location="Chennai",
        incident_type="flood",
        severity=10,
        people_affected=100,
        people_trapped=2,
        distance_to_units={"R-001": 5.0},
    )

    recommendation = generate_recommendation(incident)
    review = review_recommendation(incident, recommendation)

    assert review["status"] == "NEEDS_REVIEW"
    assert review["safe_to_execute"] is False


def test_safety_critic_approves_normal_incident():
    incident = Incident(
        incident_id="CR-TEST-004",
        location="Chennai",
        incident_type="accident",
        severity=5,
        people_affected=2,
        distance_to_units={"R-001": 4.0},
    )

    recommendation = generate_recommendation(incident)
    review = review_recommendation(incident, recommendation)

    assert review["status"] == "APPROVED"
    assert review["safe_to_execute"] is True