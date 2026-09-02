import { ReactNode, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { aiEvents, agents, chartData, incidents, simulationSteps, Incident } from "@/data/mockData";
import { Icon } from "@/components/Icon";
import MapBoard from "@/components/MapBoard";
import { getIncidents } from "@/lib/api";

export function SectionHeader({ eyebrow, title, desc, action }: { eyebrow: string; title: ReactNode; desc?: string; action?: ReactNode }) {
  return <div className="section-header"><div><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1>{title}</h1>{desc && <p>{desc}</p>}</div>{action}</div>;
}

function StatusBadge({ value }: { value: string }) {
  const tone = value === "CRITICAL" || value === "WARNING" ? "red" : value === "HIGH" || value === "PROCESSING" ? "amber" : value === "ONLINE" || value === "VERIFIED" || value === "COMPLETE" ? "green" : value === "ACTIVE" ? "blue" : "muted";
  return <span className={`status-badge ${tone}`}><span className="status-dot" />{value}</span>;
}

function KpiCard({ label, value, unit, delta, accent, icon, foot }: { label: string; value: string; unit?: string; delta?: string; accent: string; icon: string; foot: string }) {
  return <div className={`kpi-card accent-${accent}`}><div className="kpi-top"><span>{label}</span><Icon name={icon} size={15} /></div><div className="kpi-value">{value}<small>{unit}</small></div><div className="kpi-foot"><span className={delta?.startsWith("+") ? "up" : "down"}>{delta}</span><span className="mono">{foot}</span></div><div className="kpi-scan" /></div>;
}

function ProgressLine({ label, value, tone = "blue", suffix = "%" }: { label: string; value: number; tone?: string; suffix?: string }) {
  return <div className="progress-line"><div><span>{label}</span><strong>{value}{suffix}</strong></div><div className="progress-track"><span className={`fill-${tone}`} style={{ width: `${value}%` }} /></div></div>;
}

function Panel({ title, meta, children, className = "" }: { title: string; meta?: string; children: ReactNode; className?: string }) {
  return <section className={`panel content-panel ${className}`}><div className="panel-title"><div><span className="panel-accent" /><h2>{title}</h2></div>{meta && <span className="mono dim">{meta}</span>}</div>{children}</section>;
}

export function Dashboard({ onNavigate, notify }: { onNavigate: (key: string) => void; notify: (message: string) => void }) {
  const [selectedTab, setSelectedTab] = useState("OVERVIEW");
  return <div className="workspace dashboard-workspace">
    <SectionHeader eyebrow="COMMAND CENTER / SOUTH ZONE" title={<><span>CHENNAI FLOOD</span> EMERGENCY</>} desc="Integrated response picture · Last synchronized 22:04:42 IST" action={<div className="header-actions"><StatusBadge value="ACTIVE" /><StatusBadge value="CRITICAL" /><button className="primary-button" onClick={() => notify("Full demo sequence launched") }><Icon name="play" size={14} /> RUN FULL DEMO</button></div>} />
    <div className="tab-row"><button className={selectedTab === "OVERVIEW" ? "active" : ""} onClick={() => setSelectedTab("OVERVIEW")}>OVERVIEW</button><button className={selectedTab === "RESPONSE" ? "active" : ""} onClick={() => setSelectedTab("RESPONSE")}>RESPONSE PICTURE</button><button className={selectedTab === "CAPACITY" ? "active" : ""} onClick={() => setSelectedTab("CAPACITY")}>CAPACITY MODEL</button><span className="tab-spacer" /><span className="mono dim">AUTO-REFRESH <span className="led led-green" /> 00:08</span></div>
    <div className="kpi-grid">
      <KpiCard label="ACTIVE INCIDENTS" value="147" delta="+12.4%" accent="red" icon="alert" foot="vs. 60 MIN AGO" />
      <KpiCard label="CRITICAL" value="23" delta="+04" accent="red" icon="warning" foot="16% OF TOTAL" />
      <KpiCard label="VERIFIED" value="118" delta="80.3%" accent="blue" icon="shield" foot="SIGNAL CONFIDENCE" />
      <KpiCard label="RESPONDERS" value="61" unit=" / 84" delta="72.6%" accent="blue" icon="responders" foot="ACTIVE DEPLOYMENT" />
      <KpiCard label="HOSPITAL CAPACITY" value="74" unit="%" delta="-3.2%" accent="green" icon="hospital" foot="21 ICU BEDS OPEN" />
      <KpiCard label="SHELTER CAPACITY" value="82" unit="%" delta="+8.1%" accent="amber" icon="shelter" foot="146 SPACES LEFT" />
      <KpiCard label="RESOURCES" value="68" unit="%" delta="-1.8%" accent="amber" icon="resources" foot="FUEL + BOATS + MED" />
      <KpiCard label="AI CONFIDENCE" value="91" unit="%" delta="+2.8%" accent="purple" icon="brain" foot="9 AGENTS ONLINE" />
    </div>
    <div className="dashboard-grid">
      <Panel title="LIVE CRISIS MAP" meta="08 MARKERS · 03 RISK ZONES" className="map-panel"><MapBoard compact /></Panel>
      <Panel title="AI ACTIVITY STREAM" meta="LIVE" className="activity-panel"><div className="activity-stream">{aiEvents.map((event, index) => <div className="activity-event" key={event.time} style={{ animationDelay: `${index * 60}ms` }}><span className={`event-line ${event.color}`} /><span className="event-time mono">{event.time}</span><div className="event-copy"><strong>{event.agent}</strong><span>{event.event}</span></div><span className={`event-meta ${event.color}`}>{event.meta}</span></div>)}</div><button className="panel-link" onClick={() => onNavigate("agents")}>OPEN AGENT NETWORK <Icon name="chevronRight" size={13} /></button></Panel>
    </div>
    <div className="dashboard-lower">
      <Panel title="PRIORITY QUEUE" meta="SORTED BY AI SCORE"><div className="priority-list">{incidents.slice(0, 4).map((incident, index) => <button className="priority-row" key={incident.id} onClick={() => onNavigate("priority")}><span className="rank">0{index + 1}</span><span className="incident-title"><strong>{incident.id}</strong><small>{incident.type}</small></span><span className="incident-location"><Icon name="mapPin" size={12} /> {incident.location}</span><StatusBadge value={incident.severity} /><strong className="priority-score">{incident.priority}</strong><Icon name="chevronRight" size={14} /></button>)}</div><button className="panel-link" onClick={() => onNavigate("priority")}>OPEN PRIORITY ENGINE <Icon name="chevronRight" size={13} /></button></Panel>
      <Panel title="CAPACITY PULSE" meta="SOUTH CHENNAI"><div className="capacity-stack"><ProgressLine label="Rescue fleet deployed" value={73} tone="blue" /><ProgressLine label="Emergency beds occupied" value={74} tone="green" /><ProgressLine label="Shelter occupancy" value={82} tone="amber" /><ProgressLine label="Critical supplies" value={68} tone="purple" /></div><div className="capacity-note"><Icon name="activity" size={15} /><span>Demand is trending <strong>above forecast</strong> by 8.2% across the OMR corridor.</span><button onClick={() => onNavigate("predictions")}><Icon name="chevronRight" size={14} /></button></div></Panel>
    </div>
  </div>;
}

export function MapPage() {
  return <div className="workspace"><SectionHeader eyebrow="OPERATIONS / GEOSPATIAL" title="LIVE CRISIS MAP" desc="A fused operating picture of incidents, units, infrastructure, and risk zones across South Chennai." action={<div className="header-actions"><button className="secondary-button"><Icon name="filter" size={14} /> FILTER LAYERS</button><button className="secondary-button"><Icon name="external" size={14} /> EXPORT VIEW</button></div>} /><div className="map-page-layout"><Panel title="SOUTH CHENNAI · TACTICAL VIEW" meta="LAT 12.87 · LONG 80.22" className="map-page-panel"><MapBoard /></Panel><div className="map-side-stack"><Panel title="LAYER CONTROL" meta="05 ACTIVE"><div className="layer-list">{[["Flood risk zones", "waves", "blue", true], ["Incident signals", "alert", "red", true], ["Responder units", "responders", "blue", true], ["Medical facilities", "hospital", "green", true], ["Shelter capacity", "shelter", "purple", false]].map(([label, icon, tone, enabled]) => <div className="layer-row" key={label as string}><span className={`layer-icon ${tone as string}`}><Icon name={icon as string} size={14} /></span><span>{label as string}</span><button className={`toggle ${enabled ? "on" : ""}`}><span /></button></div>)}</div></Panel><Panel title="MAP TELEMETRY" meta="STREAMING"><div className="telemetry-grid"><div><span>LAST UPDATE</span><strong>00:08</strong></div><div><span>ACTIVE ZONES</span><strong>03</strong></div><div><span>ROUTES OPEN</span><strong>14 / 19</strong></div><div><span>DATA SOURCES</span><strong>06</strong></div></div></Panel></div></div></div>;
}

export function IncidentsPage({ notify }: { notify: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [selected, setSelected] = useState<Incident | null>(null);
  const [liveIncidents, setLiveIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadIncidents() {
      try {
        setLoading(true);
        setError("");

        const response = await getIncidents();

        if (cancelled) return;

        const mappedIncidents: Incident[] = response.incidents.map((item) => ({
          id: item.incident_id,
          type: item.incident_type,
          location: `${item.latitude.toFixed(3)}, ${item.longitude.toFixed(3)}`,
          severity: item.severity.toUpperCase() as Incident["severity"],
          status: item.status.toUpperCase(),
          verification: Math.round(item.confidence * 100),
          priority: item.priority_score,
          responder: "UNASSIGNED",
          time: "LIVE",
          affected: item.people_affected,
        }));

        setLiveIncidents(mappedIncidents);

        if (mappedIncidents.length > 0) {
          setSelected((current) => current ?? mappedIncidents[0]);
        }
      } catch (requestError) {
        console.error("Failed to load incidents:", requestError);

        if (!cancelled) {
          setError(
            "Unable to connect to the CrisisHub backend. Start the FastAPI server on port 8000.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadIncidents();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      liveIncidents.filter(
        (incident) =>
          (severity === "ALL" || incident.severity === severity) &&
          `${incident.id} ${incident.type} ${incident.location}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [liveIncidents, search, severity],
  );

  const criticalCount = liveIncidents.filter(
    (incident) => incident.severity === "CRITICAL",
  ).length;

  const verifiedCount = liveIncidents.filter(
    (incident) => incident.verification >= 90,
  ).length;

  return (
    <div className="workspace">
      <SectionHeader
        eyebrow="OPERATIONS / INCIDENT INTELLIGENCE"
        title="INCIDENTS"
        desc={`${liveIncidents.length} live incidents · ${verifiedCount} high-confidence · ${criticalCount} critical`}
        action={
          <button
            className="primary-button"
            onClick={() => notify("Incident intake panel opened")}
          >
            <Icon name="plus" size={14} /> NEW INCIDENT
          </button>
        }
      />

      <div className="table-toolbar">
        <div className="search-field">
          <Icon name="search" size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ID, type, or location..."
          />
        </div>

        <div className="filter-pills">
          {["ALL", "CRITICAL", "HIGH", "MODERATE"].map((value) => (
            <button
              key={value}
              className={severity === value ? "active" : ""}
              onClick={() => setSeverity(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <button className="secondary-button compact">
          <Icon name="sliders" size={14} /> MORE FILTERS
        </button>
      </div>

      {loading && (
        <div className="panel" style={{ padding: "24px" }}>
          <span className="eyebrow">BACKEND CONNECTION</span>
          <p>Loading live incidents from CrisisHub API...</p>
        </div>
      )}

      {error && !loading && (
        <div className="panel" style={{ padding: "24px" }}>
          <span className="eyebrow">BACKEND CONNECTION ERROR</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="panel table-panel">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TYPE</th>
                <th>LOCATION</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
                <th>VERIFY</th>
                <th>PRIORITY</th>
                <th>RESPONDER</th>
                <th>TIME</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => setSelected(incident)}
                >
                  <td className="mono strong-cell">{incident.id}</td>

                  <td>
                    <span className="type-cell">
                      <span className="table-type-dot" />
                      {incident.type}
                    </span>
                  </td>

                  <td>{incident.location}</td>

                  <td>
                    <StatusBadge value={incident.severity} />
                  </td>

                  <td>
                    <StatusBadge value={incident.status} />
                  </td>

                  <td>
                    <span className="verify-cell">
                      <span className="verify-track">
                        <i
                          style={{
                            width: `${incident.verification}%`,
                          }}
                        />
                      </span>
                      {incident.verification}%
                    </span>
                  </td>

                  <td>
                    <strong
                      className={
                        incident.priority > 90
                          ? "danger-text"
                          : "amber-text"
                      }
                    >
                      {incident.priority}
                    </strong>
                  </td>

                  <td className="mono">{incident.responder}</td>

                  <td className="mono dim">{incident.time}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div style={{ padding: "28px", textAlign: "center" }}>
                      No incidents match the current filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="table-footer">
            <span>
              SHOWING {filtered.length} OF {liveIncidents.length} INCIDENTS
            </span>

            <div>
              <button>
                <Icon name="chevronLeft" size={14} />
              </button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>
                <Icon name="chevronRight" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="drawer-overlay"
          onMouseDown={() => setSelected(null)}
        >
          <aside
            className="incident-drawer panel"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <span className="eyebrow">INCIDENT DETAIL</span>
                <h2>{selected.id}</h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelected(null)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="drawer-status">
              <StatusBadge value={selected.severity} />
              <StatusBadge value={selected.status} />
              <span className="mono dim">
                SOURCE: CRISISHUB API
              </span>
            </div>

            <h3>{selected.type}</h3>

            <div className="drawer-location">
              <Icon name="mapPin" size={14} /> {selected.location}
            </div>

            <div className="drawer-score">
              <div>
                <span>PRIORITY SCORE</span>
                <strong>{selected.priority}</strong>
                <small>/ 100</small>
              </div>

              <div
                className="score-ring"
                style={
                  {
                    "--score": `${selected.priority * 3.6}deg`,
                  } as React.CSSProperties
                }
              >
                <span>{selected.priority}</span>
              </div>
            </div>

            <div className="drawer-grid">
              <div>
                <span>AFFECTED</span>
                <strong>
                  {selected.affected} <small>PEOPLE</small>
                </strong>
              </div>

              <div>
                <span>VERIFICATION</span>
                <strong>{selected.verification}%</strong>
              </div>

              <div>
                <span>RESPONDER</span>
                <strong className="mono">
                  {selected.responder}
                </strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>{selected.status}</strong>
              </div>
            </div>

            <div className="drawer-section">
              <span className="eyebrow">AI ASSESSMENT</span>
              <p>
                Live incident data has been received from the CrisisHub
                FastAPI backend. Priority and confidence values shown here
                are produced by the backend incident model.
              </p>
            </div>

            <div className="drawer-actions">
              <button
                className="primary-button"
                onClick={() =>
                  notify(`${selected.id} marked for dispatch review`)
                }
              >
                <Icon name="responders" size={14} /> DISPATCH UNIT
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  notify("Simulation queued for this incident")
                }
              >
                <Icon name="play" size={14} /> SIMULATE
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
export function AgentNetworkPage() {
  const [selected, setSelected] = useState(agents[0]);
  return <div className="workspace"><SectionHeader eyebrow="INTELLIGENCE / MULTI-AGENT SYSTEM" title="AI AGENT NETWORK" desc="Nine specialized agents coordinate a traceable response recommendation before human approval." action={<div className="network-health"><span className="led led-green" /> 09 / 09 ONLINE</div>} /><div className="agent-network-layout"><Panel title="DECISION PIPELINE" meta="CR-1048 · LIVE TRACE" className="pipeline-panel"><div className="pipeline"><div className="pipeline-node source"><Icon name="alert" size={17} /><div><strong>INCIDENT</strong><small>CR-1048 · INBOUND</small></div></div><div className="pipeline-connector active" /><div className="pipeline-node"><span className="agent-orb blue"><Icon name="shield" size={16} /></span><div><strong>VERIFICATION</strong><small>91% CONFIDENCE</small></div><StatusBadge value="COMPLETE" /></div><div className="pipeline-connector active" /><div className="pipeline-node"><span className="agent-orb purple"><Icon name="eye" size={16} /></span><div><strong>VISION</strong><small>IMAGE ANALYSIS</small></div><StatusBadge value="PROCESSING" /></div><div className="pipeline-connector active" /><div className="pipeline-node"><span className="agent-orb green"><Icon name="mapPin" size={16} /></span><div><strong>GEO</strong><small>LOCATION RESOLVED</small></div><StatusBadge value="COMPLETE" /></div><div className="pipeline-connector active" /><div className="pipeline-node"><span className="agent-orb amber"><Icon name="priority" size={16} /></span><div><strong>PRIORITY</strong><small>SCORE 97 / 100</small></div><StatusBadge value="PROCESSING" /></div><div className="pipeline-connector" /><div className="pipeline-node"><span className="agent-orb blue"><Icon name="route" size={16} /></span><div><strong>ROUTING</strong><small>UNIT MATCHING</small></div><StatusBadge value="ONLINE" /></div><div className="pipeline-connector" /><div className="pipeline-node"><span className="agent-orb red"><Icon name="brain" size={16} /></span><div><strong>CRITIC</strong><small>HUMAN REVIEW GATE</small></div><StatusBadge value="WARNING" /></div><div className="human-gate"><Icon name="user" size={16} /><span>HUMAN APPROVAL REQUIRED</span><button>REVIEW <Icon name="chevronRight" size={13} /></button></div></div></Panel><div className="agent-side"><Panel title="AGENT REGISTRY" meta="SORT BY LOAD"><div className="agent-list">{agents.map((agent) => <button className={`agent-list-row ${selected.name === agent.name ? "selected" : ""}`} onClick={() => setSelected(agent)} key={agent.name}><span className={`agent-list-icon ${agent.accent}`}><Icon name={agent.name === "CRISISCOPILOT" ? "copilot" : "brain"} size={14} /></span><div><strong>{agent.name}</strong><small>{agent.role}</small></div><span className="agent-load"><i style={{ width: `${agent.load}%` }} /><small>{agent.load}%</small></span></button>)}</div></Panel><Panel title="SELECTED AGENT" meta="TRACE ID 9F4A"><div className="selected-agent"><div className={`large-orb ${selected.accent}`}><Icon name="brain" size={23} /></div><h3>{selected.name}</h3><p>{selected.role}</p><StatusBadge value={selected.status} /><div className="agent-facts"><span>MODEL</span><strong>CH-OPS-4.2</strong><span>LATENCY</span><strong>284ms</strong><span>LAST OUTPUT</span><strong>22:04:37</strong></div></div></Panel></div></div></div>;
}

export function PriorityPage() {
  const ranked = [...incidents].sort((a, b) => b.priority - a.priority);
  return <div className="workspace"><SectionHeader eyebrow="INTELLIGENCE / TRIAGE" title="PRIORITY ENGINE" desc="Explainable ranking across criticality, distance, affected population, medical urgency, and access." action={<button className="secondary-button"><Icon name="settings" size={14} /> WEIGHTS & RULES</button>} /><div className="priority-layout"><Panel title="RANKED INCIDENTS" meta="MODEL CH-PRIORITY-4.2"><div className="ranking-table">{ranked.map((incident, index) => <div className="ranking-row" key={incident.id}><span className="rank-number">{String(index + 1).padStart(2, "0")}</span><div className="rank-main"><strong>{incident.id}</strong><span>{incident.type}</span><small><Icon name="mapPin" size={11} /> {incident.location}</small></div><div className="mini-bars"><span>CRITICALITY <i style={{ width: `${Math.min(100, incident.priority + 1)}%` }} /></span><span>ACCESS <i style={{ width: `${incident.priority - 8}%` }} /></span></div><div className="rank-score"><strong>{incident.priority}</strong><span>{incident.severity}</span></div><button className="icon-button"><Icon name="chevronRight" size={15} /></button></div>)}</div></Panel><Panel title="PRIORITY MATRIX" meta="LIVE MODEL OUTPUT"><div className="matrix"><div className="matrix-y">IMPACT <span>HIGH</span><span>LOW</span></div><div className="matrix-grid"><span className="matrix-line horizontal" /><span className="matrix-line vertical" />{ranked.slice(0, 7).map((incident, index) => <button key={incident.id} className={`matrix-point point-${index % 4}`} style={{ left: `${22 + (incident.affected % 5) * 13}%`, bottom: `${22 + (incident.priority % 6) * 10}%` }} onClick={() => alert(`${incident.id}: score ${incident.priority}`)}><span>{incident.id}</span></button>)}<span className="matrix-axis high">URGENT</span><span className="matrix-axis low">MONITOR</span></div><div className="matrix-x"><span>DIFFICULT ACCESS</span><strong>RESPONSE FEASIBILITY</strong><span>EASY ACCESS</span></div></div><div className="weight-legend"><span><i className="legend-dot red" /> Criticality <strong>35%</strong></span><span><i className="legend-dot amber" /> Distance <strong>20%</strong></span><span><i className="legend-dot purple" /> Medical urgency <strong>20%</strong></span><span><i className="legend-dot blue" /> People affected <strong>15%</strong></span><span><i className="legend-dot green" /> Access <strong>10%</strong></span></div></Panel></div></div>;
}

export function CopilotPage({ notify }: { notify: (message: string) => void }) {
  const [decision, setDecision] = useState("pending");
  return <div className="workspace"><SectionHeader eyebrow="INTELLIGENCE / DECISION SUPPORT" title={<>CRISIS<span>COPILOT</span></>} desc="Structured recommendations with transparent evidence, challenge paths, and human approval gates." action={<div className="copilot-confidence"><span>NETWORK CONFIDENCE</span><strong>91%</strong></div>} /><div className="copilot-layout"><Panel title="ACTIVE DECISION" meta="RECOMMENDATION 0042"><div className="query-block"><span className="eyebrow">USER QUERY</span><h2>Where should we deploy the remaining rescue units?</h2></div><div className="recommendation-block"><div className="recommendation-label"><span className="ai-spark"><Icon name="sparkles" size={14} /></span><span className="eyebrow">AI RECOMMENDATION</span><StatusBadge value="ONLINE" /></div><div className="unit-recommendations"><div><strong>UNIT-03</strong><span><Icon name="arrowRight" size={13} /> NAVALUR</span><small>High-clearance vehicle · ETA 11 MIN</small></div><div><strong>UNIT-09</strong><span><Icon name="arrowRight" size={13} /> KELAMBAKKAM</span><small>Inflatable boat · ETA 17 MIN</small></div></div><div className="recommendation-scores"><div><span>PRIORITY SCORE</span><strong>94</strong></div><div><span>ROUTE CONFIDENCE</span><strong>91%</strong></div><div><span>PEOPLE REACHED</span><strong>74</strong></div></div></div><div className="why-block"><span className="eyebrow">WHY THIS ACTION?</span><div className="why-grid"><span><Icon name="shield" size={14} /> Criticality</span><span><Icon name="route" size={14} /> Road accessibility</span><span><Icon name="mapPin" size={14} /> Distance</span><span><Icon name="hospital" size={14} /> Medical urgency</span></div></div><div className="now-block"><div><span className="eyebrow">WHAT NOW?</span><p>Deploy UNIT-03 to Navalur before 22:12. Keep UNIT-09 staged for the Kelambakkam overflow.</p></div><span className="confidence-ring">91%</span></div><div className="copilot-actions"><button className="secondary-button" onClick={() => { setDecision("challenged"); notify("Challenge logged for model review"); }}>CHALLENGE</button><button className="secondary-button" onClick={() => { setDecision("simulating"); notify("Route simulation running"); }}><Icon name="play" size={14} /> SIMULATE</button><button className="primary-button" onClick={() => { setDecision("approved"); notify("Recommendation approved · units notified"); }}><Icon name="shield" size={14} /> {decision === "approved" ? "APPROVED" : "APPROVE"}</button></div></Panel><div className="copilot-side"><Panel title="DECISION TRACE" meta="09 STEPS"><div className="trace-list">{["Question parsed", "Incidents weighted", "Unit availability checked", "Road network sampled", "Hospital demand projected", "Recommendation composed", "Critic review complete", "Human gate pending"].map((step, index) => <div key={step} className={`trace-row ${index < 7 ? "complete" : "pending"}`}><span>{index < 7 ? <Icon name="shield" size={12} /> : <Icon name="clock" size={12} />}</span><div><strong>{step}</strong><small>{index < 7 ? `22:0${index + 1}:4${index}` : "AWAITING ACTION"}</small></div></div>)}</div></Panel><Panel title="MODEL NOTES" meta="TRANSPARENT"><div className="model-notes"><div><span className="note-code">01</span><p>Navalur has the highest unresolved criticality within the active rescue radius.</p></div><div><span className="note-code">02</span><p>Unit 03 offers the shortest reliable path with current road closures.</p></div><div><span className="note-code">03</span><p>Recommendation remains reversible until human approval is recorded.</p></div></div></Panel></div></div></div>;
}

export function ResourcePage({ kind, onNavigate }: { kind: string; onNavigate: (key: string) => void }) {
  const config: Record<string, { eyebrow: string; title: string; desc: string; icon: string; accent: string; metrics: [string, string, string][] }> = {
    responders: { eyebrow: "OPERATIONS / FIELD UNITS", title: "RESPONDERS", desc: "Track the active fleet, crew readiness, and dispatch coverage across the emergency zone.", icon: "responders", accent: "blue", metrics: [["ACTIVE UNITS", "61", "+04 today"], ["EN ROUTE", "18", "8 min avg ETA"], ["AVAILABLE", "23", "ready to dispatch"], ["OFFLINE", "03", "maintenance"]] },
    hospitals: { eyebrow: "INFRASTRUCTURE / MEDICAL", title: "HOSPITALS", desc: "Monitor emergency bed capacity, ICU readiness, ambulance queues, and projected demand.", icon: "hospital", accent: "green", metrics: [["NETWORK CAPACITY", "74%", "21 ICU beds"], ["AMBULANCES", "38", "12 en route"], ["ED WAIT", "18m", "-06m vs. avg"], ["ON DIVERSION", "02", "capacity alert"]] },
    shelters: { eyebrow: "INFRASTRUCTURE / COMMUNITY", title: "SHELTERS", desc: "Coordinate shelter capacity, intake velocity, and overflow planning across Zone 6.", icon: "shelter", accent: "purple", metrics: [["TOTAL CAPACITY", "82%", "146 spaces"], ["OPEN SITES", "12", "3 near limit"], ["INTAKE RATE", "24/h", "+08 vs. avg"], ["SUPPLY COVER", "31h", "stable"]] },
    resources: { eyebrow: "INFRASTRUCTURE / LOGISTICS", title: "RESOURCES", desc: "A real-time ledger of rescue equipment, medical supplies, fuel, and staging availability.", icon: "resources", accent: "amber", metrics: [["READINESS", "68%", "-1.8% today"], ["RESCUE BOATS", "14", "5 deployed"], ["MEDICAL KITS", "842", "91% stocked"], ["FUEL RESERVE", "63%", "18h runway"]] },
    predictions: { eyebrow: "INTELLIGENCE / FORECASTING", title: "PREDICTIONS", desc: "Model-backed projections for water level, medical demand, road accessibility, and capacity pressure.", icon: "predictions", accent: "purple", metrics: [["FORECAST HORIZON", "06h", "high confidence"], ["RISK TREND", "+18%", "OMR corridor"], ["DEMAND PEAK", "23:10", "projected"], ["MODEL CONFIDENCE", "88%", "CH-forecast-3"]],
    },
  };
  const item = config[kind] || config.resources;
  return <div className="workspace"><SectionHeader eyebrow={item.eyebrow} title={item.title} desc={item.desc} action={<button className="secondary-button"><Icon name="filter" size={14} /> FILTER VIEW</button>} /><div className="resource-metrics">{item.metrics.map(([label, value, detail]) => <div className={`resource-metric accent-${item.accent}`} key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small><div className="metric-spark"><i /><i /><i /><i /><i /><i /><i /></div></div>)}</div><div className="resource-grid"><Panel title={`${item.title} COVERAGE`} meta="SOUTH CHENNAI"><div className="coverage-list">{["OMR CORRIDOR", "VELACHERY ZONE", "TAMBARAM ZONE", "ADYAR BASIN"].map((label, index) => <div className="coverage-row" key={label}><span className="coverage-name"><span className={`coverage-dot ${index === 1 ? "red" : index === 2 ? "amber" : "green"}`} />{label}</span><span className="coverage-bar"><i style={{ width: `${82 - index * 11}%` }} /></span><strong>{82 - index * 11}%</strong><Icon name="chevronRight" size={14} /></div>)}</div></Panel><Panel title="ACTIVITY TREND" meta="LAST 05 HOURS"><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id={`gradient-${kind}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={item.accent === "green" ? "#54d68a" : item.accent === "amber" ? "#e6aa61" : "#a88cff"} stopOpacity={0.24} /><stop offset="100%" stopColor="#0b0f13" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#1d2a31" strokeDasharray="2 4" vertical={false} /><XAxis dataKey="time" tick={{ fill: "#71838e", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip contentStyle={{ background: "#10171d", border: "1px solid #2a3b43", color: "#e6eef0", fontSize: 11 }} /><Area type="monotone" dataKey="incidents" stroke={item.accent === "green" ? "#54d68a" : item.accent === "amber" ? "#e6aa61" : "#a88cff"} fill={`url(#gradient-${kind})`} strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Panel></div><button className="panel-link back-link" onClick={() => onNavigate("command")}><Icon name="chevronLeft" size={13} /> RETURN TO COMMAND CENTER</button></div>;
}

export function AnalyticsPage() {
  return <div className="workspace"><SectionHeader eyebrow="INTELLIGENCE / PERFORMANCE" title="ANALYTICS" desc="Response performance, signal quality, and system throughput across the active emergency." action={<button className="secondary-button"><Icon name="external" size={14} /> EXPORT REPORT</button>} /><div className="analytics-grid"><Panel title="INCIDENT VOLUME & RESPONSE" meta="5H WINDOW" className="analytics-chart"><div className="chart-legend"><span><i className="legend-line red" /> Incoming incidents</span><span><i className="legend-line blue" /> Verified signals</span><span><i className="legend-line green" /> Active responders</span></div><div className="big-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="incident-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff5d64" stopOpacity={0.22} /><stop offset="100%" stopColor="#ff5d64" stopOpacity={0} /></linearGradient><linearGradient id="verified-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#46c7e8" stopOpacity={0.16} /><stop offset="100%" stopColor="#46c7e8" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#1d2a31" strokeDasharray="2 4" vertical={false} /><XAxis dataKey="time" tick={{ fill: "#71838e", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#71838e", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#10171d", border: "1px solid #2a3b43", color: "#e6eef0", fontSize: 11 }} /><Area type="monotone" dataKey="incidents" stroke="#ff5d64" fill="url(#incident-fill)" strokeWidth={2} /><Area type="monotone" dataKey="verified" stroke="#46c7e8" fill="url(#verified-fill)" strokeWidth={2} /><Area type="monotone" dataKey="responders" stroke="#54d68a" fill="none" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Panel><Panel title="AGENT THROUGHPUT" meta="PER MINUTE"><div className="bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={agents.slice(0, 6)} layout="vertical" margin={{ left: 5, right: 15 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={72} tick={{ fill: "#a7b8bd", fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "#162329" }} contentStyle={{ background: "#10171d", border: "1px solid #2a3b43", color: "#e6eef0", fontSize: 11 }} /><Bar dataKey="load" fill="#9b82ff" radius={[0, 2, 2, 0]} barSize={8} /></BarChart></ResponsiveContainer></div></Panel></div><div className="analytics-insights"><div className="insight-card"><span className="insight-icon blue"><Icon name="timer" size={17} /></span><div><strong>08:42</strong><span>AVG. DISPATCH TIME</span><small>-12% vs. baseline</small></div></div><div className="insight-card"><span className="insight-icon green"><Icon name="shield" size={17} /></span><div><strong>80.3%</strong><span>SIGNAL VERIFICATION</span><small>+6.1% vs. baseline</small></div></div><div className="insight-card"><span className="insight-icon purple"><Icon name="brain" size={17} /></span><div><strong>9,842</strong><span>AI DECISIONS</span><small>91% human accepted</small></div></div><div className="insight-card"><span className="insight-icon amber"><Icon name="route" size={17} /></span><div><strong>14 / 19</strong><span>ROUTES OPEN</span><small>3 under review</small></div></div></div></div>;
}

export function SimulationPage() {
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  useEffect(() => { if (!playing) return; const interval = window.setInterval(() => setStep((value) => value >= simulationSteps.length ? 0 : value + 1), 2200 / speed); return () => window.clearInterval(interval); }, [playing, speed]);
  return <div className="workspace"><SectionHeader eyebrow="INTELLIGENCE / SCENARIO LAB" title="SIMULATION" desc="Explore how the response picture changes as Chennai Flood Escalation unfolds over time." action={<div className="scenario-tag"><span className="led led-amber" /> SCENARIO MODE</div>} /><div className="simulation-head panel"><div><span className="eyebrow">ACTIVE SCENARIO</span><h2>CHENNAI FLOOD ESCALATION</h2><p>South Chennai · synthetic forecast based on live operating picture</p></div><div className="sim-clock"><span>ELAPSED</span><strong>T+{String(step * 5).padStart(2, "0")}</strong><small>/ T+20</small></div></div><div className="simulation-layout"><Panel title="SCENARIO TIMELINE" meta="5 EVENTS"><div className="timeline">{simulationSteps.map((item, index) => <button className={`timeline-step ${index < step ? "complete" : ""} ${index === step ? "current" : ""}`} onClick={() => { setStep(index); setPlaying(false); }} key={item.time}><span className="timeline-node"><Icon name={item.icon} size={14} /></span><div><span className="mono">{item.time}</span><strong>{item.label}</strong><small>{item.desc}</small></div></button>)}</div></Panel><div className="simulation-side"><Panel title="SIMULATION OUTPUT" meta="DYNAMIC MOCK STATE"><div className="sim-output"><div><span>ACTIVE INCIDENTS</span><strong>{147 + step * 11}</strong><small>+{step * 11} vs. baseline</small></div><div><span>HOSPITAL DEMAND</span><strong>{74 + step * 3}%</strong><small>capacity pressure</small></div><div><span>ROAD ACCESS</span><strong>{19 - step}</strong><small>routes open</small></div><div><span>SHELTER LOAD</span><strong>{82 + step * 2}%</strong><small>overflow trigger: {step >= 4 ? "ON" : "OFF"}</small></div></div><div className="simulation-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></Panel><Panel title="CONTROLS" meta={`${speed}× SPEED`}><div className="sim-controls"><button className="primary-button sim-play" onClick={() => setPlaying((value) => !value)}><Icon name={playing ? "pause" : "play"} size={15} /> {playing ? "PAUSE" : "PLAY"}</button><button className="secondary-button" onClick={() => { setStep(0); setPlaying(false); }}><Icon name="refresh" size={14} /> RESET</button><div className="speed-control">{[1, 2, 4].map((value) => <button className={speed === value ? "active" : ""} onClick={() => setSpeed(value)} key={value}>{value}×</button>)}</div></div></Panel></div></div></div>;
}

const demoStages = ["CRISIS DETECTED", "INCIDENT CREATED", "VERIFICATION", "VISION ANALYSIS", "GEO VERIFICATION", "PRIORITY CALCULATION", "ROUTING", "CRITIC REVIEW", "HUMAN APPROVAL", "RESPONDER DISPATCHED", "INCIDENT RESOLVED"];
export function DemoOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { if (!open) { setStage(0); return; } const interval = window.setInterval(() => setStage((value) => value >= demoStages.length - 1 ? value : value + 1), 760); return () => window.clearInterval(interval); }, [open]);
  if (!open) return null;
  return <div className="overlay demo-overlay"><div className="demo-modal panel"><div className="demo-top"><div><span className="eyebrow">CRISISHUB / FULL SYSTEM DEMO</span><h2>RESPONSE ORCHESTRATION</h2></div><button className="icon-button" onClick={onClose}><Icon name="x" size={16} /></button></div><div className="demo-hero"><div className="demo-radar"><span /><span /><span /><span /><b><Icon name="alert" size={18} /></b></div><div><span className="mono dim">ACTIVE SCENARIO</span><strong>CHENNAI FLOOD EMERGENCY</strong><p>Observe the complete AI-assisted path from detection to resolution.</p></div></div><div className="demo-progress"><div className="demo-progress-line"><span style={{ width: `${(stage / (demoStages.length - 1)) * 100}%` }} /></div><div className="demo-stages">{demoStages.map((item, index) => <div className={index < stage ? "complete" : index === stage ? "current" : ""} key={item}><span>{index < stage ? <Icon name="shield" size={12} /> : String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</div></div><div className="demo-status"><span className="led led-green" /><span>{stage === demoStages.length - 1 ? "DEMO COMPLETE · INCIDENT RESOLVED" : "SYSTEM ORCHESTRATING · STEP " + String(stage + 1).padStart(2, "0") + " OF 11"}</span><span className="mono dim">22:04:{String(42 + stage).padStart(2, "0")}</span></div></div></div>;
}
