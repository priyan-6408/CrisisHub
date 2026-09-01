import { useState } from "react";
import { mapMarkers } from "@/data/mockData";
import { Icon } from "@/components/Icon";

export default function MapBoard({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<(typeof mapMarkers)[number] | null>(mapMarkers[0]);
  const [showZones, setShowZones] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [zoom, setZoom] = useState(1);

  return <div className={`map-board ${compact ? "map-compact" : ""}`}>
    <div className="map-toolbar"><div className="map-toolbar-left"><span className="map-chip active"><span className="led led-blue" /> LIVE TACTICAL</span><span className="map-chip">SOUTH CHENNAI</span></div><div className="map-toolbar-right"><button className={`map-tool ${showZones ? "active" : ""}`} onClick={() => setShowZones((value) => !value)} title="Toggle risk zones"><Icon name="layers" size={14} /></button><button className={`map-tool ${showRoutes ? "active" : ""}`} onClick={() => setShowRoutes((value) => !value)} title="Toggle routes"><Icon name="route" size={14} /></button><button className="map-tool" onClick={() => setZoom((value) => Math.min(1.35, value + .1))}><Icon name="plus" size={14} /></button><span className="zoom-value mono">{Math.round(zoom * 100)}%</span><button className="map-tool" onClick={() => setZoom((value) => Math.max(.85, value - .1))}><Icon name="minus" size={14} /></button><button className="map-tool" title="Center map"><Icon name="locate" size={14} /></button><button className="map-tool" title="Fullscreen"><Icon name="maximize" size={14} /></button></div></div>
    <div className="map-canvas" style={{ transform: `scale(${zoom})` }}>
      <div className="map-noise" /><div className="map-grid" />
      <svg className="map-routes" viewBox="0 0 1000 560" preserveAspectRatio="none">
        <path className="route route-main" d="M 150 470 C 290 390, 360 340, 450 290 S 675 175, 830 105" />
        <path className="route route-secondary" d="M 105 180 C 260 225, 330 340, 445 300 S 680 380, 900 470" />
        <path className="route route-secondary" d="M 235 45 C 330 160, 390 205, 445 300 S 520 445, 590 540" />
        <path className="route route-water" d="M 20 430 C 180 390, 230 410, 340 470 S 520 520, 680 450" />
      </svg>
      {showZones && <><div className="risk-zone zone-a" /><div className="risk-zone zone-b" /><div className="risk-zone zone-c" /></>}
      <div className="map-label label-adyar">ADYAR RIVER</div><div className="map-label label-omr">OMR CORRIDOR</div><div className="map-label label-navalur">NAVALUR</div><div className="map-label label-velachery">VELACHERY</div><div className="map-label label-kelambakkam">KELAMBAKKAM</div><div className="map-label label-perumbakkam">PERUMBAKKAM</div>
      {showRoutes && <><div className="road road-closed"><span /> ROAD BLOCKED · 240M</div><div className="road road-open"><span /> DISPATCH ROUTE · 08M</div></>}
      {mapMarkers.map((marker) => <button key={marker.id} className={`map-marker marker-${marker.color} ${marker.pulse ? "is-pulsing" : ""} ${selected?.id === marker.id ? "is-selected" : ""}`} style={{ left: `${marker.x}%`, top: `${marker.y}%` }} onClick={() => setSelected(marker)} aria-label={`Select ${marker.id}`}><span className="marker-core">{marker.type === "responder" ? <Icon name="truck" size={12} /> : marker.type === "hospital" ? <Icon name="hospital" size={12} /> : marker.type === "shelter" ? <Icon name="shelter" size={12} /> : marker.type === "road" ? <Icon name="warning" size={12} /> : <span />}</span><span className="marker-label mono">{marker.id}</span></button>)}
      <div className="map-scale mono"><span /> 1 KM</div>
    </div>
    <div className="map-footer"><div className="map-legend"><span><i className="legend-dot red" /> Critical</span><span><i className="legend-dot amber" /> High priority</span><span><i className="legend-dot blue" /> Responders</span><span><i className="legend-dot green" /> Hospitals</span><span><i className="legend-dot purple" /> Shelters</span></div><span className="mono dim">SOURCE: CRISISHUB FUSION · 22:04:42</span></div>
    {selected && <div className="map-detail panel"><div className="detail-kicker"><span className={`status-dot ${selected.color}`} /> {selected.type === "incident" ? "INCIDENT" : selected.type.toUpperCase()} <button className="icon-button" onClick={() => setSelected(null)}><Icon name="x" size={14} /></button></div><div className="detail-id mono">{selected.id}</div><h3>{selected.title}</h3><div className="detail-location"><Icon name="mapPin" size={13} /> {selected.location}</div><p>{selected.detail}</p>{selected.type === "incident" && <div className="detail-stats"><div><span>PRIORITY</span><strong className="danger-text">{selected.priority}</strong></div><div><span>VERIFY</span><strong>{selected.id === "CR-1048" ? "91%" : "94%"}</strong></div><div><span>AFFECTED</span><strong>{selected.id === "CR-1048" ? "38" : "12"}</strong></div></div>}<button className="detail-action" onClick={() => alert(`Opening ${selected.id} in incident workspace`)}>OPEN INCIDENT <Icon name="external" size={13} /></button></div>}
  </div>;
}
