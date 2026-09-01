def generate_recommendation(incident: Incident):

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

    return {
        "incident_id": incident.incident_id,
        "recommended_unit": unit,
        "recommendation": f"Recommend dispatch of {unit}",
        "priority_score": score,
        "reasons": reasons
    }


@app.get("/")
def home():
