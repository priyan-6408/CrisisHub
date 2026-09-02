from backend.copilot.decision_engine import Incident, calculate_priority


def get_relevant_resource_types(incident_type: str) -> list[str]:
    """Return resource types relevant to an incident."""

    incident_type_lower = incident_type.lower()

    resource_types = []

    if "flood" in incident_type_lower:
        resource_types.append("rescue_boat")

    if "medical" in incident_type_lower:
        resource_types.append("medical_kit")

    if "fire" in incident_type_lower:
        resource_types.append("fire_equipment")

    if "food" in incident_type_lower:
        resource_types.append("food")

    if incident_type_lower:
        resource_types.append("emergency_personnel")

    return resource_types


def generate_recommendation(incident: Incident):
    """Generate a responder and resource recommendation."""

    score = calculate_priority(incident)

    reasons = []

    if incident.severity >= 8:
        reasons.append("High severity incident")

    if incident.people_trapped > 0:
        reasons.append("People are trapped")

    if incident.elderly_people > 0:
        reasons.append("Elderly people affected")

    if incident.mobility_issue:
        reasons.append("Mobility assistance required")

    if incident.distance_to_units:
        unit = min(
            incident.distance_to_units,
            key=incident.distance_to_units.get
        )

        distance = incident.distance_to_units[unit]

        reasons.append(
            f"{unit} is approximately {distance} km away"
        )
    else:
        unit = "No unit available"
        reasons.append("No responder distance data available")

    relevant_resource_types = get_relevant_resource_types(
        incident.incident_type
    )

    selected_resources = []

    for resource_type in relevant_resource_types:
        resources = incident.available_resources.get(resource_type, [])

        for resource in resources:
            if resource not in selected_resources:
                selected_resources.append(resource)

    if selected_resources:
        reasons.append(
            "Relevant resources available: "
            + ", ".join(selected_resources)
        )
    else:
        reasons.append("No relevant resources available")

    return {
        "incident_id": incident.incident_id,
        "recommended_unit": unit,
        "recommendation": f"Recommend dispatch of {unit}",
        "priority_score": score,
        "resources": selected_resources,
        "reasons": reasons,
    }