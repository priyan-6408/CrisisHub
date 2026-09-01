def review_recommendation(incident, recommendation):
    """Review a recommended emergency action for basic safety concerns."""

    issues = []

    if recommendation.get("recommended_unit") == "No unit available":
        issues.append("No responder unit is available.")

    if incident.people_affected > 0 and not recommendation.get("recommended_unit"):
        issues.append("A responder should be assigned before dispatch.")

    if incident.severity >= 9 and incident.people_trapped > 0:
        issues.append("Critical incident with trapped people requires human approval.")

    if not incident.distance_to_units:
        issues.append("Responder distance information is unavailable.")

    if issues:
        return {
            "status": "NEEDS_REVIEW",
            "safe_to_execute": False,
            "issues": issues
        }

    return {
        "status": "APPROVED",
        "safe_to_execute": True,
        "issues": []
    }