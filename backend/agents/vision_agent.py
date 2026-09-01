def analyze_image(image_description=None):
    """
    Performs basic analysis of an emergency image description.
    """

    if not image_description:
        return {
            "agent": "vision_agent",
            "status": "NO_IMAGE",
            "findings": []
        }

    text = image_description.lower()
    findings = []

    if "fire" in text:
        findings.append("Possible fire detected")

    if "flood" in text or "water" in text:
        findings.append("Possible flooding detected")

    if "building" in text or "collapse" in text:
        findings.append("Possible building damage detected")

    if "people" in text or "crowd" in text:
        findings.append("People present in affected area")

    return {
        "agent": "vision_agent",
        "status": "ANALYZED",
        "findings": findings
    }