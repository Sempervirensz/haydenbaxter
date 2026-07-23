"use client";

import { useState } from "react";
import "./procurebridge.css";

// ─── Mock data ────────────────────────────────────────────────────────────────

const KPIS = [
  { label: "Active RFQs",         value: "24",   delta: "+3 this week",   trend: "up"      },
  { label: "Qualified Suppliers",  value: "138",  delta: "+12 this month", trend: "up"      },
  { label: "Risk Flags",           value: "7",    delta: "2 critical",     trend: "down"    },
  { label: "Est. Savings",         value: "$2.4M",delta: "vs. baseline",   trend: "neutral" },
];

interface Supplier {
  id: string; name: string; initials: string; category: string;
  country: string; region: string;
  unitCost: string; leadTime: string;
  riskLevel: "Low" | "Medium" | "High";
  compliance: string;
  status: "Recommended" | "Under Review" | "Disqualified" | "Pending";
}

const SUPPLIERS: Supplier[] = [
  { id:"s1", name:"Meridian Supply Co.",    initials:"MS", category:"Precision Components",    country:"Germany",      region:"EMEA",    unitCost:"$4.20", leadTime:"18 days", riskLevel:"Low",    compliance:"ISO 9001 · GDPR",     status:"Recommended"  },
  { id:"s2", name:"Volta Industrial",       initials:"VI", category:"Electronics",              country:"Taiwan",       region:"APAC",    unitCost:"$3.55", leadTime:"22 days", riskLevel:"Low",    compliance:"ISO 14001 · RoHS",    status:"Recommended"  },
  { id:"s3", name:"Apex Fabrication LLC",   initials:"AF", category:"Metal Fabrication",        country:"United States",region:"Americas",unitCost:"$5.80", leadTime:"12 days", riskLevel:"Medium", compliance:"ITAR · AS9100",       status:"Under Review" },
  { id:"s4", name:"Zephyr Logistics",       initials:"ZL", category:"Packaging & Logistics",    country:"India",        region:"APAC",    unitCost:"$2.10", leadTime:"28 days", riskLevel:"Medium", compliance:"ISO 45001",           status:"Under Review" },
  { id:"s5", name:"Canterra Parts Group",   initials:"CP", category:"Automotive Components",    country:"Mexico",       region:"Americas",unitCost:"$3.90", leadTime:"16 days", riskLevel:"High",   compliance:"IATF 16949",          status:"Disqualified" },
  { id:"s6", name:"Solaris Materials",      initials:"SM", category:"Advanced Materials",       country:"South Korea",  region:"APAC",    unitCost:"$6.30", leadTime:"20 days", riskLevel:"Low",    compliance:"ISO 9001 · REACH",    status:"Pending"      },
];

const REASONING = [
  { key: "Cost",          val: "Unit cost of $4.20 is 12% below category median. Volume discount tier applies at 50K+ units."          },
  { key: "Compliance",    val: "ISO 9001 certified, current GDPR attestation on file, no outstanding audit findings."                   },
  { key: "Lead Time",     val: "18-day average with confirmed buffer stock. Historically within ±2 days of stated commitment."          },
  { key: "Strategic Fit", val: "EMEA footprint aligns with Q3 regional expansion. Existing relationship reduces onboarding overhead."   },
];

const STEPS = [
  { num:"01", title:"Upload Supplier Data",      desc:"Import RFQ responses, supplier profiles, and compliance docs via CSV, API, or direct entry.", Icon: IconUpload    },
  { num:"02", title:"Normalize Vendor Records",  desc:"AI reconciles duplicate entries, standardizes field formats, and flags missing data for review.", Icon: IconNormalize },
  { num:"03", title:"Compare Sourcing Options",  desc:"Score vendors across cost, lead time, risk, compliance, and strategic fit in a unified view.", Icon: IconCompare   },
  { num:"04", title:"Generate Procurement Brief",desc:"Export a structured sourcing brief with ranked recommendations, rationale, and next steps.", Icon: IconBrief     },
];

const NAV_ITEMS = [
  { label: "Dashboard",  icon: IconDashboard, active: true,  badge: null },
  { label: "Suppliers",  icon: IconSuppliers, active: false, badge: "138" },
  { label: "RFQs",       icon: IconRfq,       active: false, badge: "24"  },
  { label: "Risk",       icon: IconRisk,      active: false, badge: "7"   },
  { label: "Reports",    icon: IconReports,   active: false, badge: null  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconDashboard() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1"/><rect x="9.5" y="1.5" width="5" height="5" rx="1"/>
    <rect x="1.5" y="9.5" width="5" height="5" rx="1"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>
  </svg>;
}

function IconSuppliers() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="6" cy="5" r="2.5"/><path d="M1 13c0-2.8 2.2-5 5-5"/>
    <circle cx="11.5" cy="5.5" r="2"/><path d="M15 13c0-2.2-1.6-4-3.5-4"/>
  </svg>;
}

function IconRfq() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2.5" y="1.5" width="11" height="13" rx="1.5"/>
    <path d="M5 6h6M5 9h6M5 12h3"/>
  </svg>;
}

function IconRisk() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1.5L14.5 13H1.5L8 1.5z"/><path d="M8 6v3.5M8 11v.5"/>
  </svg>;
}

function IconReports() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="10" width="3" height="4" rx=".5"/><rect x="6.5" y="6" width="3" height="8" rx=".5"/>
    <rect x="11" y="2" width="3" height="12" rx=".5"/>
  </svg>;
}

function IconUpload() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3v10M6.5 6.5L10 3l3.5 3.5"/><path d="M3 14.5v1.5a1 1 0 001 1h12a1 1 0 001-1v-1.5"/>
  </svg>;
}

function IconNormalize() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 6h16M2 10h11M2 14h7"/>
    <circle cx="16" cy="13.5" r="2.5"/><path d="M16 11V6"/>
  </svg>;
}

function IconCompare() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="12" width="4" height="6" rx="1"/><rect x="8" y="7" width="4" height="11" rx="1"/>
    <rect x="14" y="2" width="4" height="16" rx="1"/>
  </svg>;
}

function IconBrief() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="4" y="2" width="12" height="16" rx="2"/>
    <path d="M7 7h6M7 10.5h6M7 14h4"/>
  </svg>;
}

function IconCheck() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8l3.5 3.5L13 5"/>
  </svg>;
}

function TrendUp() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9l4-5 4 5"/>
  </svg>;
}

function TrendDown() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3l4 5 4-5"/>
  </svg>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskBadge(level: Supplier["riskLevel"]) {
  const map = { Low: "pb-badge--green", Medium: "pb-badge--amber", High: "pb-badge--red" } as const;
  return map[level];
}

function statusBadge(s: Supplier["status"]) {
  const map: Record<Supplier["status"], string> = {
    Recommended: "pb-badge--green",
    "Under Review": "pb-badge--amber",
    Disqualified: "pb-badge--red",
    Pending: "pb-badge--zinc",
  };
  return map[s];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProcureBridgePage() {
  const [tab, setTab]           = useState<"all" | "recommended" | "review">("all");
  const [selectedId, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone]         = useState(false);

  const rows = SUPPLIERS.filter(s => {
    if (tab === "recommended") return s.status === "Recommended";
    if (tab === "review")      return s.status === "Under Review";
    return true;
  });

  function generate() {
    if (done || generating) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 1600);
  }

  return (
    <div className="pb">

      {/* ── Hero (above shell, shown at /procurebridge-preview) ─────────── */}
      <section className="pb-hero">
        <div className="pb-hero__inner">
          <div className="pb-hero__eyebrow">
            <span style={{width:6,height:6,borderRadius:"50%",background:"currentColor",display:"inline-block"}} />
            Procurement Intelligence
          </div>
          <h1 className="pb-hero__title">ProcureBridge</h1>
          <p className="pb-hero__tagline">AI-assisted sourcing intelligence for supplier decisions</p>
          <p className="pb-hero__desc">
            ProcureBridge helps procurement teams compare suppliers, evaluate risk exposure,
            and generate data-backed sourcing recommendations — all in a single workflow,
            from RFQ intake to signed brief.
          </p>
          <div className="pb-hero__ctas">
            <button className="pb-btn pb-btn--primary">Start a Sourcing Request</button>
            <button className="pb-btn pb-btn--outline">View Documentation →</button>
          </div>
        </div>
      </section>

      {/* ── App shell ─────────────────────────────────────────────────────── */}
      <div className="pb-shell">

        {/* Sidebar */}
        <nav className="pb-sidebar" aria-label="Main navigation">
          <div className="pb-sidebar__logo">
            <div className="pb-sidebar__icon">PB</div>
            <span className="pb-sidebar__name">ProcureBridge</span>
          </div>

          <div className="pb-sidebar__section">
            <span className="pb-sidebar__section-label">Workspace</span>
            {NAV_ITEMS.map(({ label, icon: Icon, active, badge }) => (
              <div key={label} className={`pb-sidebar__item${active ? " pb-sidebar__item--active" : ""}`}>
                <span className="pb-sidebar__item-icon"><Icon /></span>
                {label}
                {badge && <span className="pb-sidebar__badge">{badge}</span>}
              </div>
            ))}
          </div>

          <div className="pb-sidebar__bottom">
            <div className="pb-sidebar__user">
              <div className="pb-sidebar__avatar">SA</div>
              <div className="pb-sidebar__user-info">
                <div className="pb-sidebar__user-name">Sarah Alcott</div>
                <div className="pb-sidebar__user-role">Procurement Lead</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <div className="pb-main">

          {/* Topbar */}
          <header className="pb-topbar">
            <div className="pb-topbar__breadcrumb">
              <span>Workspace</span>
              <span className="pb-topbar__breadcrumb-sep">/</span>
              <span className="pb-topbar__breadcrumb-current">Dashboard</span>
            </div>
            <div className="pb-topbar__right">
              <button className="pb-topbar__btn">Export</button>
              <button className="pb-topbar__btn">Filter</button>
              <button className="pb-topbar__btn pb-topbar__btn--primary">+ New RFQ</button>
            </div>
          </header>

          {/* Content */}
          <div className="pb-content">

            {/* Page header */}
            <div className="pb-page-header">
              <div className="pb-page-header__left">
                <h2 className="pb-page-title">Sourcing Dashboard</h2>
                <p className="pb-page-subtitle">Q2 2025 · 24 active requests · Last updated 4 minutes ago</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="pb-kpis">
              {KPIS.map(k => (
                <div key={k.label} className="pb-kpi">
                  <div className="pb-kpi__header">
                    <span className="pb-kpi__label">{k.label}</span>
                  </div>
                  <span className="pb-kpi__value">{k.value}</span>
                  <span className={`pb-kpi__delta pb-kpi__delta--${k.trend}`}>
                    {k.trend === "up" && <TrendUp />}
                    {k.trend === "down" && <TrendDown />}
                    {k.delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Dashboard grid */}
            <div className="pb-grid">

              {/* Supplier table */}
              <div className="pb-card">
                <div className="pb-card__header">
                  <div className="pb-card__title-row">
                    <span className="pb-card__title">Supplier Comparison</span>
                    <span className="pb-card__subtitle">{rows.length} vendors</span>
                  </div>
                  <div className="pb-tabs" role="tablist">
                    {(["all","recommended","review"] as const).map(t => (
                      <button
                        key={t}
                        role="tab"
                        aria-selected={tab === t}
                        className={`pb-tab${tab === t ? " pb-tab--active" : ""}`}
                        onClick={() => setTab(t)}
                      >
                        {t === "all" ? "All" : t === "recommended" ? "Recommended" : "Under Review"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pb-table-wrap">
                  <table className="pb-table">
                    <thead>
                      <tr>
                        <th>Supplier</th>
                        <th>Region</th>
                        <th>Unit Cost</th>
                        <th>Lead Time</th>
                        <th>Risk / Compliance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(s => (
                        <tr
                          key={s.id}
                          className={selectedId === s.id ? "is-selected" : ""}
                          onClick={() => setSelected(s.id === selectedId ? null : s.id)}
                          tabIndex={0}
                          onKeyDown={e => e.key === "Enter" && setSelected(s.id === selectedId ? null : s.id)}
                          aria-selected={selectedId === s.id}
                        >
                          <td>
                            <div className="pb-supplier">
                              <div className="pb-supplier__avatar">{s.initials}</div>
                              <div>
                                <div className="pb-supplier__name">{s.name}</div>
                                <div className="pb-supplier__category">{s.category}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="pb-region">
                              <span className="pb-region__country">{s.country}</span>
                              <span className="pb-region__tag">{s.region}</span>
                            </div>
                          </td>
                          <td><span className="pb-mono">{s.unitCost}</span></td>
                          <td><span className="pb-mono">{s.leadTime}</span></td>
                          <td>
                            <div className="pb-risk-wrap">
                              <span className={`pb-badge ${riskBadge(s.riskLevel)}`}>
                                <span className="pb-badge__dot" />
                                {s.riskLevel}
                              </span>
                              <span className="pb-compliance">{s.compliance}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`pb-badge ${statusBadge(s.status)}`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Recommendation panel */}
              <div className="pb-card pb-ai-panel">
                <div className="pb-ai-header">
                  <div className="pb-ai-label">
                    <span className="pb-ai-pulse" aria-hidden="true" />
                    AI Recommendation
                  </div>
                  <div className="pb-ai-title">Sourcing Analysis</div>
                </div>

                <div className="pb-ai-body">
                  <div className="pb-ai-vendor">
                    <div className="pb-ai-vendor__avatar">MS</div>
                    <div>
                      <div className="pb-ai-vendor__name">Meridian Supply Co.</div>
                      <div className="pb-ai-vendor__meta">Germany · EMEA</div>
                    </div>
                    <div className="pb-ai-vendor__score">91% match</div>
                  </div>

                  <div className="pb-ai-rfq">
                    RFQ #2024-PRC-041 · Precision Components · Q2 2025
                  </div>

                  <p className="pb-ai-summary">
                    Highest-ranked supplier based on composite scoring across cost, compliance,
                    delivery reliability, and strategic alignment. Recommend proceeding to contract stage.
                  </p>

                  <div className="pb-reasoning">
                    <div className="pb-reasoning__label">Reasoning</div>
                    {REASONING.map(r => (
                      <div key={r.key} className="pb-reason">
                        <div className="pb-reason__key">{r.key}</div>
                        <div className="pb-reason__val">{r.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`pb-generate-btn${done ? " pb-generate-btn--done" : ""}`}
                  onClick={generate}
                  disabled={generating || done}
                  aria-live="polite"
                >
                  {generating ? (
                    <><span className="pb-spinner" aria-hidden="true" /> Generating Brief…</>
                  ) : done ? (
                    <><span style={{width:16,height:16,display:"inline-flex"}}><IconCheck /></span> Brief Generated</>
                  ) : (
                    "Generate Sourcing Brief"
                  )}
                </button>

                {done && (
                  <div className="pb-brief" role="status" aria-live="polite">
                    <div className="pb-brief__name">
                      <span>📄</span>
                      ProcureBridge_Sourcing_Brief_041.pdf
                    </div>
                    <div className="pb-brief__meta">Generated just now · 4 pages · Ready to download</div>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow */}
            <div className="pb-workflow">
              <div className="pb-workflow__head">
                <div className="pb-workflow__eyebrow">How it works</div>
                <h3 className="pb-workflow__title">From raw data to procurement brief in four steps</h3>
                <p className="pb-workflow__desc">
                  Designed for teams that need fast, defensible sourcing decisions without manual spreadsheet work.
                </p>
              </div>
              <div className="pb-steps">
                {STEPS.map(({ num, title, desc, Icon }) => (
                  <div key={num} className="pb-step">
                    <div className="pb-step__icon"><Icon /></div>
                    <div className="pb-step__num">Step {num}</div>
                    <div className="pb-step__title">{title}</div>
                    <p className="pb-step__desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
