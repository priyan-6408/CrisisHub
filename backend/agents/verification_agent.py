def verify_incident(incident):
    """
    Checks whether an incident contains enough information
    to be reasonably verified.
    """

    required_fields = [
        "type",
        "description",
        "location"
    ]

    missing_fields = [
        field
        for field in required_fields
        if not incident.get(field)
    ]

    if not missing_fields:
        status = "VERIFIED"
        confidence = 0.9
    else:
        status = "NEEDS_REVIEW"
        confidence = 0.5

    return {
        "agent": "verification_agent",
        "status": status,
        "confidence": confidence,
        "missing_fields": missing_fields
    }