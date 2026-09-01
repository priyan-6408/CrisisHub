def triage_incident(incident):
    """
    Classifies an emergency incident based on severity.
    """

    people_affected = incident.get("people_affected", 0)
    description = incident.get("description", "").lower()
    incident_type = (incident.get("incident_type") or incident.get("type") or "").lower()

    severity = "LOW"
    priority = 3

    if people_affected >= 100 or any(
        word in description
        for word in ["trapped", "collapsed", "critical", "danger", "injured"]
    ):
        severity = "HIGH"
        priority = 1

    elif people_affected >= 25 or incident_type in [
        "flood",
        "fire",
        "earthquake",
        "cyclone"
    ]:
        severity = "MEDIUM"
        priority = 2

    return {
        "agent": "triage_agent",
        "severity": severity,
        "priority": priority,
        "reason": f"Incident classified as {severity} priority."
    }