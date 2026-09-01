class Incident(BaseModel):
    incident_id: str
    location: str
    incident_type: str
    severity: int
    people_affected: int = 0
    people_trapped: int = 0
    elderly_people: int = 0
    mobility_issue: bool = False

    distance_to_units: Dict[str, float] = {}
    available_resources: Dict[str, List[str]] = {}


def calculate_priority(incident: Incident):

    score = 0

    score += incident.severity * 10
    score += min(incident.people_affected * 5, 20)
    score += min(incident.people_trapped * 10, 20)
    score += min(incident.elderly_people * 5, 10)

    if incident.mobility_issue:
        score += 10

    return min(score, 100)


