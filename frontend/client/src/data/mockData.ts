export type Incident = {
  id: string;
  type: string;
  location: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  status: string;
  verification: number;
  priority: number;
  responder: string;
  time: string;
  affected: number;
};

export type NavItem = {
  key: string;
  label: string;
  icon: string;
  count?: number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type MapMarker = {
  id: string;
  type: "responder" | "hospital" | "shelter" | "road" | "incident";
  color: string;
  x: number;
  y: number;
  pulse?: boolean;
  title?: string;
  location?: string;
  detail?: string;
  priority?: number;
};

export type Agent = {
  name: string;
  role: string;
  load: number;
  status: string;
  accent: string;
};

export type AiEvent = {
  time: string;
  agent: string;
  event: string;
  meta: string;
  color: string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type SimulationStep = {
  time: string;
  label: string;
  desc: string;
  icon: string;
};

export const navGroups: NavGroup[] = [
  {
    label: "COMMAND",
    items: [
      { key: "command", label: "Command Center", icon: "dashboard" },
      { key: "map", label: "Live Map", icon: "map" },
      { key: "incidents", label: "Incidents", icon: "alert", count: 147 },
      { key: "priority", label: "Priority Engine", icon: "priority" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { key: "agents", label: "AI Agent Network", icon: "brain" },
      { key: "responders", label: "Responders", icon: "responders", count: 4 },
      { key: "hospitals", label: "Hospitals", icon: "hospital" },
      { key: "shelters", label: "Shelters", icon: "shelter" },
      { key: "resources", label: "Resources", icon: "box" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { key: "copilot", label: "Crisis Copilot", icon: "copilot" },
      { key: "predictions", label: "Predictions", icon: "chart" },
      { key: "analytics", label: "Analytics", icon: "analytics" },
      { key: "simulation", label: "Simulation", icon: "play" },
    ],
  },
];

export const incidents: Incident[] = [
  {
    id: "CR-1048",
    type: "Flood + Medical",
    location: "Kelambakkam",
    severity: "CRITICAL",
    status: "ACTIVE",
    verification: 91,
    priority: 97,
    responder: "R-002",
    time: "22:04:37",
    affected: 2,
  },
  {
    id: "CR-1049",
    type: "Flood",
    location: "Navalur",
    severity: "HIGH",
    status: "ACTIVE",
    verification: 85,
    priority: 74,
    responder: "R-004",
    time: "22:03:12",
    affected: 6,
  },
  {
    id: "CR-1050",
    type: "Medical",
    location: "Kelambakkam",
    severity: "MODERATE",
    status: "ACTIVE",
    verification: 80,
    priority: 45,
    responder: "R-002",
    time: "22:01:48",
    affected: 1,
  },
  {
    id: "CR-1047",
    type: "Flood",
    location: "Sholinganallur",
    severity: "HIGH",
    status: "VERIFIED",
    verification: 94,
    priority: 82,
    responder: "R-003",
    time: "21:58:20",
    affected: 8,
  },
  {
    id: "CR-1046",
    type: "Road Block",
    location: "Navalur",
    severity: "MODERATE",
    status: "ACTIVE",
    verification: 76,
    priority: 52,
    responder: "R-004",
    time: "21:54:06",
    affected: 4,
  },
  {
    id: "CR-1045",
    type: "Medical",
    location: "Chennai",
    severity: "HIGH",
    status: "VERIFIED",
    verification: 96,
    priority: 78,
    responder: "R-001",
    time: "21:49:31",
    affected: 3,
  },
];

export const mapMarkers: MapMarker[] = [
  {
    id: "CR-1048",
    type: "incident",
    color: "red",
    x: 51,
    y: 56,
    pulse: true,
    title: "Flood Medical Emergency",
    location: "Kelambakkam",
    detail: "Elderly person trapped in flooded house",
    priority: 97,
  },
  {
    id: "CR-1049",
    type: "incident",
    color: "amber",
    x: 57,
    y: 48,
    pulse: true,
    title: "Flood Emergency",
    location: "Navalur",
    detail: "Water entering residential area",
    priority: 74,
  },
  {
    id: "CR-1050",
    type: "incident",
    color: "amber",
    x: 47,
    y: 61,
    title: "Medical Emergency",
    location: "Kelambakkam",
    detail: "Minor injury reported",
    priority: 45,
  },
  {
    id: "R-001",
    type: "responder",
    color: "blue",
    x: 72,
    y: 25,
    title: "Chennai Rescue Team",
    location: "Chennai",
    detail: "Available rescue response unit",
  },
  {
    id: "R-002",
    type: "responder",
    color: "green",
    x: 49,
    y: 57,
    title: "Kelambakkam Medical Response Team",
    location: "Kelambakkam",
    detail: "Available medical response unit",
  },
  {
    id: "R-003",
    type: "responder",
    color: "blue",
    x: 63,
    y: 53,
    title: "Fire and Rescue Unit",
    location: "Sholinganallur",
    detail: "Available fire and rescue unit",
  },
  {
    id: "R-004",
    type: "responder",
    color: "green",
    x: 55,
    y: 46,
    title: "Emergency Support Team",
    location: "Navalur",
    detail: "Available emergency support unit",
  },
  {
    id: "H-001",
    type: "hospital",
    color: "green",
    x: 36,
    y: 38,
    title: "Emergency Hospital",
    location: "Chennai",
    detail: "Emergency medical facility",
  },
  {
    id: "S-001",
    type: "shelter",
    color: "purple",
    x: 68,
    y: 70,
    title: "Emergency Shelter",
    location: "Navalur",
    detail: "Emergency shelter facility",
  },
  {
    id: "ROAD-07",
    type: "road",
    color: "amber",
    x: 78,
    y: 58,
    pulse: true,
    title: "Road Access Alert",
    location: "South Chennai",
    detail: "Road access is currently restricted",
  },
];

export const agents: Agent[] = [
  {
    name: "CRISISCOPILOT",
    role: "Response orchestration",
    load: 82,
    status: "PROCESSING",
    accent: "blue",
  },
  {
    name: "VERIFICATION",
    role: "Signal verification",
    load: 64,
    status: "ONLINE",
    accent: "blue",
  },
  {
    name: "VISION",
    role: "Image analysis",
    load: 71,
    status: "PROCESSING",
    accent: "purple",
  },
  {
    name: "GEO",
    role: "Location intelligence",
    load: 48,
    status: "ONLINE",
    accent: "green",
  },
  {
    name: "PRIORITY",
    role: "Incident prioritization",
    load: 77,
    status: "PROCESSING",
    accent: "amber",
  },
  {
    name: "ROUTING",
    role: "Responder matching",
    load: 59,
    status: "ONLINE",
    accent: "blue",
  },
  {
    name: "CRITIC",
    role: "Safety review",
    load: 43,
    status: "WARNING",
    accent: "red",
  },
];

export const aiEvents: AiEvent[] = [
  {
    time: "22:04:37",
    agent: "CRISISCOPILOT",
    event: "Recommendation generated for CR-1048",
    meta: "TRACE 9F4A",
    color: "blue",
  },
  {
    time: "22:04:31",
    agent: "CRITIC",
    event: "Human approval gate activated",
    meta: "REVIEW",
    color: "red",
  },
  {
    time: "22:04:28",
    agent: "ROUTING",
    event: "Nearest available responder identified",
    meta: "R-002",
    color: "green",
  },
  {
    time: "22:04:24",
    agent: "PRIORITY",
    event: "Priority score recalculated",
    meta: "97 / 100",
    color: "amber",
  },
  {
    time: "22:04:18",
    agent: "VERIFICATION",
    event: "Incident confidence updated",
    meta: "91%",
    color: "blue",
  },
  {
    time: "22:04:11",
    agent: "GEO",
    event: "Incident coordinates resolved",
    meta: "12.845, 80.226",
    color: "green",
  },
];

export const chartData: ChartPoint[] = [
  { label: "18:00", value: 34 },
  { label: "19:00", value: 42 },
  { label: "20:00", value: 51 },
  { label: "21:00", value: 67 },
  { label: "22:00", value: 79 },
];

export const simulationSteps: SimulationStep[] = [
  {
    time: "T+00",
    label: "Initial conditions",
    desc: "Baseline operating picture established",
    icon: "map",
  },
  {
    time: "T+05",
    label: "Rainfall intensifies",
    desc: "Flood risk expands across South Chennai",
    icon: "cloud",
  },
  {
    time: "T+10",
    label: "Access routes degrade",
    desc: "Multiple roads become difficult to access",
    icon: "warning",
  },
  {
    time: "T+15",
    label: "Medical demand rises",
    desc: "Emergency support requirements increase",
    icon: "hospital",
  },
  {
    time: "T+20",
    label: "Escalation threshold",
    desc: "Human command review required",
    icon: "alert",
  },
];