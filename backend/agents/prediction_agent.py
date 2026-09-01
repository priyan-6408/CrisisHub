def predict_impact(incident):
    """
    Predicts possible risks and impacts of an incident.
    """

    incident_type = incident.get("type", "").lower()
    people_affected = incident.get("people_affected", 0)

    risks = []

    if incident_type == "flood":
        risks.extend([
            "Road blockage",
            "Power disruption",
            "Need for temporary shelter"
        ])

    elif incident_type == "fire":
        risks.extend([
            "Fire spread",
            "Smoke exposure",
            "Need for evacuation"
        ])

    elif incident_type == "earthquake":
        risks.extend([
            "Building damage",
            "Aftershocks",
            "Blocked roads"
        ])

    else:
        risks.append("Additional emergency response may be required")

    if people_affected > 100:
        risks.append("Large-scale emergency response required")

    return {
        "agent": "prediction_agent",
        "possible_risks": risks,
        "risk_count": len(risks)
    }