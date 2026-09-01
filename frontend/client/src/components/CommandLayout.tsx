import { ReactNode, useEffect, useMemo, useState } from "react";
import { navGroups } from "@/data/mockData";
import { Icon } from "@/components/Icon";

type Props = { active: string; onNavigate: (key: string) => void; children: ReactNode; onDemo: () => void };

export default function CommandLayout({ active, onNavigate, children, onDemo }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setShowPalette((value) => !value);
      }
      if (event.key === "Escape") {
        setShowPalette(false);
        setShowAlerts(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const paletteItems = useMemo(() => navGroups.flatMap((group) => group.items).filter((item) => item.label.toLowerCase().includes(query.toLowerCase())), [query]);
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-top">
          <button className="brand-mark" onClick={() => onNavigate("command")} aria-label="Go to command center">
            <span className="brand-glyph"><span /></span>
            {!collapsed && <span className="brand-copy"><strong>CRISIS<span>HUB</span></strong><small>AI EMERGENCY INTELLIGENCE</small></span>}
          </button>
          <button className="icon-button collapse-button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}><Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={16} /></button>
        </div>
        <div className="sidebar-rule" />
        <nav className="nav-groups" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {!collapsed && <div className="nav-label">{group.label}</div>}
              {group.items.map((item) => {
                const selected = active === item.key;
                return <button key={item.key} className={`nav-item ${selected ? "selected" : ""}`} onClick={() => onNavigate(item.key)} title={collapsed ? item.label : undefined}>
                  <Icon name={item.icon} size={17} />
                  {!collapsed && <><span>{item.label}</span>{item.count && <em>{item.count}</em>}</>}
                  {selected && <i className="nav-active-line" />}
                </button>;
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <><div className="system-mini"><span className="led led-green" /> <span>NETWORK STATUS</span><strong>OPERATIONAL</strong></div><div className="operator"><div className="avatar">RK</div><div><strong>R. Kannan</strong><small>OPERATOR · L3</small></div><Icon name="chevronDown" size={14} /></div></>}
          {collapsed && <div className="avatar">RK</div>}
        </div>
      </aside>

      <main className={`main-stage ${collapsed ? "stage-expanded" : ""}`}>
        <header className="topbar">
          <div className="topbar-context"><div className="live-label"><span className="led led-red" /> LIVE</div><span className="context-divider" /> <span className="mono dim">INCIDENT COMMAND / SOUTH ZONE</span></div>
          <div className="topbar-center"><span className="topbar-pin"><Icon name="mapPin" size={14} /></span><strong>CHENNAI FLOOD EMERGENCY</strong><span className="topbar-status">CRITICAL</span></div>
          <div className="topbar-actions"><span className="topbar-system"><span className="led led-green" /> SYSTEM OPERATIONAL</span><button className="top-icon" onClick={() => setShowAlerts((value) => !value)} aria-label="Open notifications"><Icon name="bell" size={17} /><span className="notification-dot" /></button><button className="top-icon" onClick={() => setShowPalette(true)} aria-label="Open command palette"><Icon name="search" size={17} /></button><span className="top-time mono">{time} IST</span></div>
        </header>

        {showAlerts && <div className="alert-popover panel"><div className="popover-head"><strong>ALERT QUEUE</strong><span className="mono dim">03 NEW</span></div><div className="alert-row"><span className="alert-icon red"><Icon name="warning" size={14} /></span><div><strong>CR-1048 priority escalated</strong><small>Navalur · 22:04:37</small></div></div><div className="alert-row"><span className="alert-icon amber"><Icon name="radio" size={14} /></span><div><strong>Road access degraded</strong><small>OMR corridor · 22:03:02</small></div></div><div className="alert-row"><span className="alert-icon blue"><Icon name="activity" size={14} /></span><div><strong>Unit 07 approaching scene</strong><small>ETA 08 min · 22:02:44</small></div></div><button className="text-button" onClick={() => { setShowAlerts(false); onNavigate("incidents"); }}>VIEW ALL INCIDENTS <Icon name="chevronRight" size={13} /></button></div>}

        <div className="content-scroll">{children}</div>
      </main>

      {showPalette && <div className="overlay" onMouseDown={() => setShowPalette(false)}><div className="command-palette panel" onMouseDown={(event) => event.stopPropagation()}><div className="palette-input"><Icon name="search" size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to a workspace or action..." /><kbd>ESC</kbd></div><div className="palette-body">{paletteItems.map((item) => <button key={item.key} className="palette-item" onClick={() => { onNavigate(item.key); setShowPalette(false); setQuery(""); }}><Icon name={item.icon} size={16} /><span>{item.label}</span><kbd>↵</kbd></button>)}{paletteItems.length === 0 && <div className="empty-state">No command matches “{query}”</div>}</div><div className="palette-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span><kbd>esc</kbd> close</span></div></div></div>}
    </div>
  );
}
