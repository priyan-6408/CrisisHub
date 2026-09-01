import json
from pathlib import Path


DATA_DIR = Path("backend/data")

DATA_FILES = [
    "incidents.json",
    "responders.json",
    "hospitals.json",
    "shelters.json",
    "resources.json",
]


def test_all_data_files_exist():
    for filename in DATA_FILES:
        assert (DATA_DIR / filename).exists()


def test_all_data_files_are_valid_json():
    for filename in DATA_FILES:
        file_path = DATA_DIR / filename

        with open(file_path, encoding="utf-8") as f:
            data = json.load(f)

        assert isinstance(data, list)
        assert len(data) > 0


def test_incidents_data():
    with open(DATA_DIR / "incidents.json", encoding="utf-8") as f:
        incidents = json.load(f)

    assert len(incidents) == 5

    for incident in incidents:
        assert "incident_id" in incident
        assert "title" in incident
        assert "incident_type" in incident
        assert "latitude" in incident
        assert "longitude" in incident


def test_responders_data():
    with open(DATA_DIR / "responders.json", encoding="utf-8") as f:
        responders = json.load(f)

    assert len(responders) > 0

    for responder in responders:
        assert "responder_id" in responder
        assert "name" in responder
        assert "status" in responder


def test_hospitals_data():
    with open(DATA_DIR / "hospitals.json", encoding="utf-8") as f:
        hospitals = json.load(f)

    assert len(hospitals) > 0

    for hospital in hospitals:
        assert "hospital_id" in hospital
        assert "name" in hospital
        assert "available_beds" in hospital


def test_shelters_data():
    with open(DATA_DIR / "shelters.json", encoding="utf-8") as f:
        shelters = json.load(f)

    assert len(shelters) > 0

    for shelter in shelters:
        assert "shelter_id" in shelter
        assert "name" in shelter
        assert "capacity" in shelter
        assert "current_occupancy" in shelter


def test_resources_data():
    with open(DATA_DIR / "resources.json", encoding="utf-8") as f:
        resources = json.load(f)

    assert len(resources) > 0

    for resource in resources:
        assert "resource_id" in resource
        assert "name" in resource
        assert "quantity" in resource
        assert "available_quantity" in resource