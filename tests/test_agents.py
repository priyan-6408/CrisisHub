from backend.agents.triage_agent import triage_incident


def test_triage_high_priority():
    incident = {
        "incident_type": "flood",
        "description": "Several residents are trapped inside flooded houses.",
        "people_affected": 120
    }

    result = triage_incident(incident)

    assert result["severity"] == "HIGH"
    assert result["priority"] == 1
    assert result["agent"] == "triage_agent"


def test_triage_medium_priority():
    incident = {
        "incident_type": "flood",
        "description": "Water entering a residential area.",
        "people_affected": 30
    }

    result = triage_incident(incident)

    assert result["severity"] == "MEDIUM"
    assert result["priority"] == 2


def test_triage_low_priority():
    incident = {
        "incident_type": "accident",
        "description": "Minor road accident.",
        "people_affected": 2
    }

    result = triage_incident(incident)

    assert result["severity"] == "LOW"
    assert result["priority"] == 3

from backend.agents.verification_agent import verify_incident


def test_verification_valid_incident():
    incident = {
        "incident_type": "flood",
        "description": "Residents are trapped in a flooded house.",
        "latitude": 12.845,
        "longitude": 80.226
    }

    result = verify_incident(incident)

    assert result["status"] == "VERIFIED"
    assert result["verified"] is True
    assert result["missing_fields"] == []


def test_verification_missing_information():
    incident = {
        "incident_type": "flood",
        "description": "",
        "latitude": None,
        "longitude": None
    }

    result = verify_incident(incident)

    assert result["status"] == "NEEDS_REVIEW"
    assert result["verified"] is False
    assert "description" in result["missing_fields"]
    assert "latitude" in result["missing_fields"]
    assert "longitude" in result["missing_fields"]


def test_verification_old_location_field():
    incident = {
        "type": "fire",
        "description": "Fire reported in a building.",
        "location": "Chennai"
    }

    result = verify_incident(incident)

    assert result["status"] == "VERIFIED"
    assert result["verified"] is True
    assert result["missing_fields"] == []

from backend.agents.prediction_agent import predict_impact


def test_prediction_flood():
    incident = {
        "incident_type": "flood",
        "people_affected": 50
    }

    result = predict_impact(incident)

    assert result["agent"] == "prediction_agent"
    assert "Road blockage" in result["possible_risks"]
    assert "Power disruption" in result["possible_risks"]
    assert "Need for temporary shelter" in result["possible_risks"]
    assert result["risk_count"] == 3


def test_prediction_fire():
    incident = {
        "incident_type": "fire",
        "people_affected": 20
    }

    result = predict_impact(incident)

    assert "Fire spread" in result["possible_risks"]
    assert "Smoke exposure" in result["possible_risks"]
    assert "Need for evacuation" in result["possible_risks"]
    assert result["risk_count"] == 3


def test_prediction_earthquake():
    incident = {
        "incident_type": "earthquake",
        "people_affected": 60
    }

    result = predict_impact(incident)

    assert "Building damage" in result["possible_risks"]
    assert "Aftershocks" in result["possible_risks"]
    assert "Blocked roads" in result["possible_risks"]
    assert result["risk_count"] == 3


def test_prediction_large_scale_emergency():
    incident = {
        "incident_type": "flood",
        "people_affected": 120
    }

    result = predict_impact(incident)

    assert "Large-scale emergency response required" in result["possible_risks"]
    assert result["risk_count"] == 4

from backend.agents.resource_agent import recommend_resources


def test_resource_recommendation_flood():
    result = recommend_resources({
        "incident_type": "flood",
        "people_affected": 20
    })

    assert result["agent"] == "resource_agent"
    assert "Rescue boats" in result["recommended_resources"]
    assert "Life jackets" in result["recommended_resources"]
    assert "Drinking water" in result["recommended_resources"]
    assert "Temporary shelters" in result["recommended_resources"]


def test_resource_recommendation_fire():
    result = recommend_resources({
        "incident_type": "fire",
        "people_affected": 20
    })

    assert "Fire engines" in result["recommended_resources"]
    assert "Firefighters" in result["recommended_resources"]
    assert "Medical support" in result["recommended_resources"]


def test_resource_recommendation_earthquake():
    result = recommend_resources({
        "incident_type": "earthquake",
        "people_affected": 20
    })

    assert "Search and rescue teams" in result["recommended_resources"]
    assert "Medical teams" in result["recommended_resources"]
    assert "Emergency shelters" in result["recommended_resources"]


def test_resource_recommendation_cyclone():
    result = recommend_resources({
        "incident_type": "cyclone",
        "people_affected": 20
    })

    assert "Emergency shelters" in result["recommended_resources"]
    assert "Rescue teams" in result["recommended_resources"]
    assert "Drinking water" in result["recommended_resources"]
    assert "Medical teams" in result["recommended_resources"]


def test_resource_recommendation_unknown_incident():
    result = recommend_resources({
        "incident_type": "accident",
        "people_affected": 2
    })

    assert "Emergency response team" in result["recommended_resources"]
    assert "Medical support" in result["recommended_resources"]


def test_resource_recommendation_large_scale():
    result = recommend_resources({
        "incident_type": "flood",
        "people_affected": 120
    })

    assert "Additional emergency personnel" in result["recommended_resources"]

from backend.agents.vision_agent import analyze_image


def test_vision_no_image():
    result = analyze_image()

    assert result["agent"] == "vision_agent"
    assert result["status"] == "NO_IMAGE"
    assert result["findings"] == []


def test_vision_fire_detection():
    result = analyze_image("A large fire is visible in the building.")

    assert result["status"] == "ANALYZED"
    assert "Possible fire detected" in result["findings"]


def test_vision_flood_detection():
    result = analyze_image("Water has flooded the road.")

    assert result["status"] == "ANALYZED"
    assert "Possible flooding detected" in result["findings"]


def test_vision_building_damage():
    result = analyze_image("A building has collapsed.")

    assert result["status"] == "ANALYZED"
    assert "Possible building damage detected" in result["findings"]


def test_vision_people_detection():
    result = analyze_image("Many people are present at the disaster site.")

    assert result["status"] == "ANALYZED"
    assert "People present in affected area" in result["findings"]


def test_vision_multiple_findings():
    result = analyze_image(
        "A fire has caused flooding near a collapsed building with many people."
    )

    assert result["status"] == "ANALYZED"
    assert len(result["findings"]) == 4
    assert "Possible fire detected" in result["findings"]
    assert "Possible flooding detected" in result["findings"]
    assert "Possible building damage detected" in result["findings"]
    assert "People present in affected area" in result["findings"]