def recommend_resources(incident):
    """
    Recommends emergency resources based on incident type.
    """

    incident_type = incident.get("type", "").lower()
    people_affected = incident.get("people_affected", 0)

    resources = []

    if incident_type == "flood":
        resources.extend([
            "Rescue boats",
            "Life jackets",
            "Drinking water",
            "Temporary shelters"
        ])

    elif incident_type == "fire":
        resources.extend([
            "Fire engines",
            "Firefighters",
            "Medical support"
        ])

    elif incident_type == "earthquake":
        resources.extend([
            "Search and rescue teams",
            "Medical teams",
            "Emergency shelters"
        ])

    elif incident_type == "cyclone":
        resources.extend([
            "Emergency shelters",
            "Rescue teams",
            "Drinking water",
            "Medical teams"
        ])

    else:
        resources.extend([
            "Emergency response team",
            "Medical support"
        ])

    if people_affected > 100:
        resources.append("Additional emergency personnel")

    return {
        "agent": "resource_agent",
        "recommended_resources": resources
    }