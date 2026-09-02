import { useEffect, useState } from "react";
import CommandLayout from "@/components/CommandLayout";
import { DemoOverlay, AgentNetworkPage, AnalyticsPage, CopilotPage, Dashboard, IncidentsPage, MapPage, PriorityPage, ResourcePage, SimulationPage } from "@/pages/Workspace";

export default function App() {
  const [active, setActive] = useState("command");
  const [demoOpen, setDemoOpen] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  useEffect(() => {
    document.title = "CrisisHub — AI Emergency Command Center";
  }, []);

  const renderWorkspace = () => {
    switch (active) {
      case "command": return <Dashboard onNavigate={setActive} notify={(message) => { if (message === "Full demo sequence launched") setDemoOpen(true); else notify(message); }} />;
      case "map": return <MapPage />;
      case "incidents": return <IncidentsPage notify={notify} />;
      case "agents": return <AgentNetworkPage />;
      case "priority": return <PriorityPage />;
      case "copilot": return <CopilotPage notify={notify} />;
      case "analytics": return <AnalyticsPage />;
      case "simulation": return <SimulationPage />;
      case "responders":
      case "hospitals":
      case "shelters":
      case "resources":
      case "predictions": return <ResourcePage kind={active} onNavigate={setActive} />;
      default: return <Dashboard onNavigate={setActive} notify={notify} />;
    }
  };

  return <>
    <CommandLayout active={active} onNavigate={setActive} onDemo={() => setDemoOpen(true)}>{renderWorkspace()}</CommandLayout>
    {toast && <div className="toast"><span className="toast-check">✓</span><span>{toast}</span><button onClick={() => setToast("")}>×</button></div>}
    <DemoOverlay open={demoOpen} onClose={() => setDemoOpen(false)} />
  </>;
}
