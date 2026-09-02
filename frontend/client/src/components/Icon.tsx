import {
  Activity, AlertCircle, Ambulance, ArrowRight, BarChart3, Bell, Bot, BrainCircuit, Building2, ChevronDown, ChevronLeft, ChevronRight, CircleDot, CircleGauge, ClipboardList, Clock3, Command, Crosshair, Database, ExternalLink, Eye, FileText, Filter, Gauge, GitBranch, Hospital, Layers3, LayoutDashboard, LifeBuoy, ListFilter, LocateFixed, Map as MapIcon, Maximize2, Menu, MessageSquareMore, Minus, Navigation, Network, Pause, Play, Plus, Radio, RefreshCw, Route, Search, Settings2, ShieldCheck, Siren, SlidersHorizontal, Sparkles, Target, Timer, TriangleAlert, Truck, UserRound, Waves, X, Zap, type LucideIcon
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  activity: Activity, alert: AlertCircle, ambulance: Ambulance, analytics: BarChart3, bell: Bell, bot: Bot, brain: BrainCircuit, building: Building2,
  arrowRight: ArrowRight, chevronDown: ChevronDown, chevronLeft: ChevronLeft, chevronRight: ChevronRight, dot: CircleDot, gauge: CircleGauge, incidents: ClipboardList,
  clock: Clock3, command: Command, crosshair: Crosshair, database: Database, external: ExternalLink, eye: Eye, file: FileText, filter: Filter,
  gauge2: Gauge, agents: GitBranch, hospital: Hospital, layers: Layers3, dashboard: LayoutDashboard, shelter: LifeBuoy, list: ListFilter,
  locate: LocateFixed, map: MapIcon, maximize: Maximize2, menu: Menu, copilot: MessageSquareMore, minus: Minus, navigation: Navigation,
  network: Network, pause: Pause, play: Play, plus: Plus, radio: Radio, refresh: RefreshCw, route: Route, search: Search, settings: Settings2,
  shield: ShieldCheck, siren: Siren, sliders: SlidersHorizontal, sparkles: Sparkles, priority: Target, timer: Timer, warning: TriangleAlert,
  responders: Truck, truck: Truck, user: UserRound, waves: Waves, x: X, predictions: Zap, resources: Database, simulation: Activity, mapPin: LocateFixed,
};

export function Icon({ name, size = 16, strokeWidth = 1.8, className = "" }: { name: string; size?: number; strokeWidth?: number; className?: string }) {
  const Lucide = icons[name] || CircleDot;
  return <Lucide size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
