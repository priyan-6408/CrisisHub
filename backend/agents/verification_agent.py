def verify_incident(incident):
    """
    Verifies that an incident contains the required information.
    Supports the backend schema and older field names for compatibility.
    """

    incident_type = (
        incident.get("incident_type")
        or incident.get("type")
        or ""
    ).strip()

    description = incident.get("description", "").strip()

    latitude = incident.get("latitude")
    longitude = incident.get("longitude")

    # Backward compatibility with the older location field
    location = incident.get("location")

    missing_fields = []

    if not incident_type:
        missing_fields.append("incident_type")

    if not description:
        missing_fields.append("description")

    if latitude is None and longitude is None and not location:
        missing_fields.extend(["latitude", "longitude"])

    if missing_fields:
        return {
            "agent": "verification_agent",
            "status": "NEEDS_REVIEW",
            "verified": False,
            "missing_fields": missing_fields
        }

    return {
        "agent": "verification_agent",
        "status": "VERIFIED",
        "verified": True,
        "missing_fields": []
    }