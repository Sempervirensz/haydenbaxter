// ---------------------------------------------------------------------------
// Work section data — discriminated-union screen types + full content
// ---------------------------------------------------------------------------

import { ATOMICOS_DEMO } from "@/data/atomicosDemo";
import { CASEBRIEF_DEMO } from "@/data/casebriefDemo";
import { CORTEX_DEMO } from "@/data/cortexDemo";

// ---- Shared base ----

interface WorkScreenBase {
  id: number;
  name: string;
  number: string;
  logo?: { src: string; alt: string };
}

// ---- Screen 1: WorldPulse ----

interface WorldPulseScreen extends WorkScreenBase {
  type: "full";
  full: {
    image: { src: string; alt: string };
    background?: string;
    role: string;
    caption: string[];
    link: { href: string; label: string };
  };
}

// ---- Screen 2: AI & Emerging Tech Builds ----

export interface ETBScreenshot {
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic pixel dimensions — set both to lock aspect ratio / avoid CLS. */
  width: number;
  height: number;
  /** "phone" renders a narrow portrait frame; default is a wide landscape frame. */
  variant?: "wide" | "phone";
  /** Optional art-directed mobile capture. When present, swapped in below
   *  640px so the screenshot stays readable on small viewports. */
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
}

/** "By the numbers" stat tile for a project showcase. Big editorial
 *  value + mono label + one supporting line, with an optional icon. */
export interface ETBStat {
  /** Big foreground number/value (e.g. "88%", "+22pp", "60d"). */
  value: string;
  /** Mono uppercase label above the value. */
  label: string;
  /** One short supporting line beneath the value. */
  detail: string;
  /** Icon key — see EtbStatIcon for the rendered set. */
  icon?: "pulse" | "trend-up" | "calendar" | "checklist" | "spark" | "bot";
}

/** Rich "view full details" content for an ETB project. When present, the
 *  detail page renders a real showcase instead of the "coming soon"
 *  placeholders. */
export interface ETBDemoDetail {
  /** Short kicker shown above the showcase (e.g. "Demo showcase"). */
  badge?: string;
  /** Optional callout note shown above the showcase. */
  disclaimer?: string;
  /** Intro paragraph for the showcase. */
  summary?: string;
  /** Headline metrics rendered as DYMO-flavored stat tiles before the
   *  screenshots — quick, glanceable proof of what the system delivers. */
  stats?: ETBStat[];
  /** Optional link to an interactive, clickable demo. */
  liveUrl?: string;
  liveLabel?: string;
  /** Category label shown in the full-detail hero, overriding
   *  `project.category` for the detail page only (card/panel keep their own). */
  heroCategory?: string;
  /** Multi-paragraph opening project story. Rendered in place of `summary`
   *  when present. */
  story?: string[];
  /** Emphasized product principle rendered as a callout/blockquote. */
  principle?: string;
  screenshots: ETBScreenshot[];
  /** Ordered "how it works" steps, written for a non-technical reader. */
  howItWorks?: { title: string; body: string }[];
  /** "What makes it different" items. */
  differentiators?: { title: string; body: string }[];
  /** Note clarifying differentiators are directional, not proven-causal. */
  differentiatorsNote?: string;
  /** Titled technical subsections. Rendered in place of the flat
   *  `techBreakdown` list when present. */
  techSections?: { title: string; body: string }[];
  techBreakdown: string[];
  outcomes: string[];
  lessonsLearned: string[];
  /** Honest, compact limitations of the current build. */
  limitations?: string[];
}

export interface ETBProject {
  id: string;
  name: string;
  status: string;
  category: string;
  oneLiner: string;
  bullets: string[];
  tags: string[];
  screenshot: string;
  previewUrl?: string;
  previewLabel?: string;
  comingSoon?: boolean;
  detailFooter?: string;
  systemSnapshot?: string[];
  completenessScore: number;
  technicalScore: number;
  recencyScore: number;
  demo?: ETBDemoDetail;
  /** Curiosity-first slide-in preview panel copy. When present, the dossier
   *  renders a simplified layout (meta · title · hook · one paragraph · tags ·
   *  CTA) instead of the capability-bullets + System Notes layout. */
  panel?: {
    /** Category · status line, e.g. "PERSONAL OS · PROTOTYPE". */
    meta: string;
    /** One-line curiosity hook. */
    hook: string;
    /** One short paragraph. */
    description: string;
    /** CTA label (the arrow is appended by the component). */
    cta?: string;
  };
  /** When true, the candy-bar card shows the full `oneLiner` verbatim rather
   *  than a derived brief teaser (CSS still clamps the display to one line). */
  keepFullSummary?: boolean;
  /** Small brand mark / sigil shown alongside the project name in the
   *  dossier, modal, and detail-page hero. Square asset; intrinsic
   *  dimensions used to lock aspect. */
  mark?: { src: string; alt: string; width: number; height: number };
}

interface ETBGraduateCard {
  title: string;
  outcomeLine: string;
  bullets: string[];
  tags: string[];
}

export interface ETBData {
  title: string;
  credibilityLine: string;
  intro: string;
  description?: string;
  filters: string[];
  sortOptions: { label: string; field: string }[];
  defaultFilter: string;
  defaultSort: string;
  defaultSelectedId: string;
  projects: ETBProject[];
  graduateWork: {
    title: string;
    subtitle: string;
    cards: ETBGraduateCard[];
  };
}

interface ETBScreen extends WorkScreenBase {
  type: "emerging-tech-builds";
  etb: ETBData;
}

// ---- Screen 3: Supply Chain ----

export interface SupplyChainProofTab {
  id: string;
  label: string;
  title: string;
  bullets: string[];
  tags: string[];
}

export interface SupplyChainItem {
  id: string;
  kind?: string;
  badge: string;
  title: string;
  roleLine?: string;
  oneLiner: string;
  bullets: string[];
  tags: string[];
  tools: string[];
  scopeSignals: string[];
  systemSnapshot: string[];
}

export interface SupplyChainData {
  description?: string;
  viewMode: string;
  heroArt: {
    mapAsset: string;
    layout: string;
    mapScale: string;
    masterPacificX: string;
    masterPacificY: string;
    masterPacificScale: string;
    eastPos: string;
    westPos: string;
    seamWidth: string;
    seamSoftness: string;
    overlap: string;
    quoteLines: { text: string; style: string }[];
  };
  proofDrawer: {
    promptLabel: string;
    buttonLabel: string;
    tabs: SupplyChainProofTab[];
  };
  eyebrow: string;
  intro: string;
  bridgeLine: string;
  featured: SupplyChainItem;
  supports: SupplyChainItem[];
}

interface SupplyChainScreen extends WorkScreenBase {
  type: "supply-chain";
  supplyChain: SupplyChainData;
}

// ---- Screen 4: Consulting ----

export interface ConsultingOffer {
  id: string;
  title: string;
  status: string;
  oneLiner: string;
  deliverables: string[];
  tags: string[];
  bestFor: string;
  modalSections: { label: string; text: string }[];
  systemSnapshot: string[];
}

export interface ConsultingProofTile {
  title: string;
  clientType: string;
  problem: string;
  approach: string;
  deliverable: string;
}

export interface ConsultingData {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  identityLine: string;
  founderLine: string;
  offers: ConsultingOffer[];
  proofTiles: ConsultingProofTile[];
}

interface ConsultingScreen extends WorkScreenBase {
  type: "consulting";
  consulting: ConsultingData;
}

// ---- Union type ----

export type WorkScreen =
  | WorldPulseScreen
  | ETBScreen
  | SupplyChainScreen
  | ConsultingScreen;

// ---------------------------------------------------------------------------
// Landing & scroll config (unchanged)
// ---------------------------------------------------------------------------

export const WORK_LANDING = {
  title: "Work",
  quote: "Rooted in outcome and action.",
  scrollHint: "Scroll to explore",
  activeLabel: "",
};

export interface WorkScrollZone {
  hold: [number, number];
  deg: number;
  label: string;
}

export const WORK_SCROLL_CONFIG = {
  // Chapter heights: landing 500vh + 3×300vh details + 420vh consulting
  // cinema track (.work__chapter--cinema) = 1820vh; scrollable = 1720vh.
  // Each break keeps the same absolute scroll position the hand-tuned
  // pre-cinema values had (e.g. 0.35 × 1394vh = 488vh → 488/1720 = 0.2837),
  // so every transition before Consulting is unchanged — the extra budget
  // all lands in the pinned consulting scene.
  screenBreaks: [0, 0.2837, 0.4539, 0.6241, 0.7699, 1],
  zones: [
    { hold: [0.0, 0.15], deg: 0, label: "" },                         // Angel at 12 (rest)
    { hold: [0.18, 0.35], deg: -45, label: "WorldPulse" },            // ~1:30 → top
    { hold: [0.38, 0.55], deg: -135, label: "AI & Emerging Tech Builds" }, // ~4:30 → top
    { hold: [0.58, 0.75], deg: -225, label: "Supply Chain" },         // ~7:30 → top
    { hold: [0.78, 0.92], deg: -315, label: "Consulting" },           // ~10:30 → top
    { hold: [0.96, 0.985], deg: -360, label: "" },                    // Return to angel
  ] as WorkScrollZone[],
};

// ---------------------------------------------------------------------------
// Screen data
// ---------------------------------------------------------------------------

export const WORK_SCREENS: WorkScreen[] = [
  // ── Screen 1 — WorldPulse ──────────────────────────────────────────────
  {
    id: 1,
    name: "WorldPulse",
    number: "01 / 04",
    logo: { src: "/WorldPulseLogo.png", alt: "WorldPulse" },
    type: "full",
    full: {
      image: { src: "", alt: "" },
      background: "/WorldPulseCostal3.0.webp",
      role: "",
      caption: [
        "Founder at WorldPulse, where we turn complex supply chain data into visual, engaging product stories.",
        "WorldPulse proves that supply chain does not have to feel cold, hidden, or technical. We make product origin, compliance, and traceability easier to understand through design-driven Digital Product Passports.",
      ],
      link: {
        href: "https://worldxpulse.com",
        label: "Learn more at WorldXPulse.com",
      },
    },
  },

  // ── Screen 2 — AI & Emerging Tech Builds ───────────────────────────────
  {
    id: 2,
    name: "AI & Emerging Tech Builds",
    number: "02 / 04",
    type: "emerging-tech-builds",
    etb: {
      title: "AI & Emerging Tech Builds",
      credibilityLine: "M.S. in Artificial Intelligence in Business (ASU)",
      intro: "Usable AI systems, not slideware.",
      description:
        "Applied AI systems built around clear workflows and useful interfaces. AtomicOS, CaseBrief, and Cortex have working front-end builds you can explore. ProcureBridge is coming soon.",
      filters: [
        "All",
        "Personal OS",
        "Case Intelligence",
        "Editorial Brain",
        "Supply Chain Apps",
      ],
      sortOptions: [
        { label: "Most complete", field: "completenessScore" },
        { label: "Most technical", field: "technicalScore" },
        { label: "Most recent", field: "recencyScore" },
      ],
      defaultFilter: "All",
      defaultSort: "Most complete",
      defaultSelectedId: "atomicos",
      projects: [
        {
          id: "atomicos",
          name: "AtomicOS",
          status: "Front-end Build",
          category: "Personal OS",
          oneLiner:
            "An operating system built for better habits, better days, and an extraordinary life.",
          bullets: [
            "Daily check-ins capture energy, focus, and execution signals",
            "One dashboard for routines, priorities, and operating patterns",
            "Foundation for an AI coaching layer over time",
          ],
          tags: [
            "Natural-Language Tracking",
            "Behavior Analytics",
            "Privacy-First Design",
          ],
          screenshot: "/assets/atomicos-demo/atomicos-overview.webp",
          systemSnapshot: [
            "Check-ins turn daily behavior into structured operating data",
            "Trends surface momentum shifts in energy and follow-through",
            "Designed to extend into context-aware coaching prompts",
          ],
          completenessScore: 82,
          technicalScore: 89,
          recencyScore: 89,
          panel: {
            meta: "Personal OS",
            hook: "Stop tracking every habit. Start discovering which ones change everything.",
            description:
              "AtomicOS turns casual chat replies into structured habit data, then reveals which routines improve your focus, energy, and follow-through. No forms. No endless toggles. Just useful patterns from the life you are already living.",
            cta: "Explore AtomicOS",
          },
          keepFullSummary: true,
          demo: ATOMICOS_DEMO,
          mark: {
            src: "/assets/atomicos-mark.webp",
            alt: "AtomicOS embroidered atom mark",
            width: 1024,
            height: 1024,
          },
        },
        {
          id: "casebrief",
          name: "CaseBrief",
          status: "Front-end Build",
          category: "Case Intelligence",
          oneLiner:
            "Understand the full story of an injury, so every client’s case is built with care.",
          bullets: [
            "Turns scattered medical records into a clear injury narrative",
            "Flags referenced records that are missing from the file",
            "Keeps every conclusion tied to its source document and page",
          ],
          tags: ["Case Narrative", "Missing-Record Detection", "Source-Backed Review"],
          screenshot: "/assets/casebrief-preview.png",
          completenessScore: 85,
          technicalScore: 95,
          recencyScore: 87,
          panel: {
            meta: "Case Intelligence",
            hook: "When a client’s future is on the line, clarity matters.",
            description:
              "CaseBrief transforms scattered medical records into a clear, source-backed narrative of injury, treatment, and recovery. It helps legal teams find the missing pieces, understand the full case faster, and spend less time searching through documents and more time advocating for the client.",
            cta: "Explore CaseBrief",
          },
          keepFullSummary: true,
          demo: CASEBRIEF_DEMO,
          mark: {
            src: "/assets/casebrief-mark.png",
            alt: "CaseBrief cube mark",
            width: 1024,
            height: 1024,
          },
        },
        {
          id: "cortex",
          name: "Cortex",
          status: "Front-end Build",
          category: "Editorial Brain",
          oneLiner: "Find the signal. Grade the evidence. Publish the truth.",
          bullets: [
            "Brings sources, notes, claims, topic maps, and drafts into one connected system",
            "Reasons across the whole knowledge base and keeps answers tied to sources",
            "Turns structured research into defensible, publishable work",
          ],
          tags: ["Second Brain", "Connected Research", "Source-to-Publishing"],
          screenshot: "/assets/cortex-demo/cortex-dashboard-overview.png",
          completenessScore: 78,
          technicalScore: 88,
          recencyScore: 97,
          panel: {
            meta: "Editorial Brain",
            hook: "Turn your research into a living system that thinks with you.",
            description:
              "Cortex brings sources, notes, claims, evidence, and drafts into one connected intelligence system. Built around Obsidian, it helps you remember what matters, connect ideas, uncover gaps, and turn deep research into clear, defensible work.",
            cta: "Explore Cortex",
          },
          keepFullSummary: true,
          demo: CORTEX_DEMO,
          mark: {
            src: "/assets/cortex-mark.webp",
            alt: "Cortex embroidered brain mark",
            width: 1024,
            height: 1024,
          },
        },
        {
          id: "procurebridge",
          name: "ProcureBridge",
          status: "Coming Soon",
          category: "Supply Chain Apps",
          oneLiner:
            "A procurement intelligence tool for evaluating suppliers and making clearer sourcing decisions.",
          bullets: [
            "Side-by-side supplier evaluation and sourcing comparison",
            "Fragmented purchasing data shaped into clearer calls",
            "Full walkthrough publishes when the build is ready to show",
          ],
          tags: ["Procurement", "Sourcing", "Decision Support"],
          screenshot: "",
          comingSoon: true,
          previewLabel: "Demo Coming Soon",
          detailFooter: "Full walkthrough coming soon.",
          systemSnapshot: [
            "Workflow centered on supplier comparison and sourcing decisions",
            "Model unifies vendor docs, pricing, and risk signals",
            "Interface in progress; the detail page opens once it ships",
          ],
          completenessScore: 35,
          technicalScore: 62,
          recencyScore: 78,
          mark: {
            src: "/assets/procurebridge-mark.webp",
            alt: "ProcureBridge embroidered globe-and-bridge mark",
            width: 1024,
            height: 1024,
          },
        },
      ],
      graduateWork: {
        title: "Graduate Work",
        subtitle:
          "Masters-level builds: models, pipelines, evaluation, and applied business framing.",
        cards: [
          {
            title: "Graduate Project Placeholder 01",
            outcomeLine:
              "Decision-ready prototype with a clear evaluation plan.",
            bullets: [
              "Model + pipeline scope framed for real operating constraints",
              "Outputs structured for stakeholder review, not just demos",
            ],
            tags: ["Modeling", "Pipeline", "Evaluation", "Business Framing"],
          },
          {
            title: "Graduate Project Placeholder 02",
            outcomeLine:
              "Applied workflow build focused on reliability and interpretation.",
            bullets: [
              "Experiment loops designed to compare tradeoffs, not just accuracy",
              "Documentation pattern built for repeatable handoff",
            ],
            tags: [
              "Experiment Design",
              "QA",
              "Applied AI",
              "Ops Thinking",
            ],
          },
          {
            title: "Graduate Project Placeholder 03",
            outcomeLine:
              "Production-shaped concept with measurable acceptance criteria.",
            bullets: [
              "Business objective translated into system behavior and test cases",
              "Evaluation artifacts packaged for fast decision-making",
            ],
            tags: ["Systems", "Metrics Design", "Prompting", "Delivery"],
          },
        ],
      },
    },
  },

  // ── Screen 3 — Supply Chain ────────────────────────────────────────────
  {
    id: 3,
    name: "Supply Chain",
    number: "03 / 04",
    type: "supply-chain",
    supplyChain: {
      description: "A look at my work in global supply chains, sourcing, and traceability. Ideas, systems, and lessons from the world behind the products we use every day.",
      viewMode: "minimal-supply-chain-landing",
      heroArt: {
        mapAsset: "/assets/mapmaster.webp",
        layout: "pacific-master",
        mapScale: "232%",
        masterPacificX: "62%",
        masterPacificY: "42%",
        masterPacificScale: "114%",
        eastPos: "22% 47%",
        westPos: "79% 45%",
        seamWidth: "152px",
        seamSoftness: "82px",
        overlap: "30px",
        quoteLines: [
          { text: "Fortune 100 sourcing leader.", style: "serif-heavy" },
          { text: "8+ years across Asia.", style: "mono-caps" },
          { text: "Fluent in Mandarin.", style: "sans-light" },
          {
            text: "Built supplier networks across China, Vietnam, and Indonesia.",
            style: "serif-italic",
          },
        ],
      },
      proofDrawer: {
        promptLabel: "Want the operating proof?",
        buttonLabel: "View details",
        tabs: [
          {
            id: "operator-story",
            label: "Operator Story",
            title: "Operator Story",
            bullets: [
              "Lifecycle ownership across sourcing, supplier coordination, and downstream execution under shifting constraints",
              "Cross-team operating rhythms that reduce handoff friction and improve decision speed",
              "Execution discipline shaped by real timelines, documentation requirements, and supplier variability",
            ],
            tags: ["Lifecycle Ops", "Cross-Functional", "Execution"],
          },
          {
            id: "governance",
            label: "Governance",
            title: "Governance",
            bullets: [
              "Field ownership clarified so operational data has accountable stewards",
              "Conventions and status logic standardized for cleaner reporting",
              "Exceptions reviewed intentionally instead of getting buried in snapshots",
            ],
            tags: ["Data Integrity", "Conventions", "Exceptions"],
          },
          {
            id: "traceability",
            label: "Traceability",
            title: "Traceability",
            bullets: [
              "Provenance thinking applied to supplier, material, and process data connections",
              "Audit trail expectations structured for verification, not reconstruction",
              "ESG-ready workflows designed to support operations without adding noise",
            ],
            tags: ["Provenance", "Audit Trail", "ESG-Ready"],
          },
        ],
      },
      eyebrow: "Global supply chains, sourcing, and traceability.",
      intro:
        "A look at my work in global supply chains, sourcing, and traceability. Ideas, systems, and lessons from the world behind the products we use every day.",
      bridgeLine:
        "AI fits best after the operating model is clear. I design the workflow and data shape first, then layer automation where it compounds.",
      featured: {
        id: "global-ops-governance",
        badge: "Featured Operator Story",
        title: "Global Supplier Ops + Data Governance",
        roleLine:
          "Across Aosom, Disney, and Three Tree: procurement execution, supplier coordination, data integrity, and reporting discipline.",
        oneLiner:
          "Built the connective tissue between sourcing decisions and the systems teams use to execute them.",
        bullets: [
          "Mapped sourcing workflows into repeatable operating logic instead of one-off firefighting",
          "Aligned supplier communication, documentation, and status tracking across teams",
          "Improved decision quality by tightening data definitions and reporting consistency",
        ],
        tags: [
          "Procurement Strategy",
          "Supplier Ops",
          "Data Governance",
          "Traceability Thinking",
          "Cross-Functional Execution",
        ],
        tools: ["SAP", "Tableau", "Excel", "ERP Data", "Workflow Design"],
        scopeSignals: [
          "International supplier coordination",
          "Multi-team operating cadence",
          "Risk and documentation discipline",
        ],
        systemSnapshot: [
          "Decision flow starts with sourcing stage + supplier state, not dashboard vanity metrics",
          "Shared definitions reduce cross-team reporting drift",
          "Ops visibility designed for actionability, not just monitoring",
          "Governance rules keep analysis trustworthy over time",
        ],
      },
      supports: [
        {
          id: "supplier-risk-governance",
          kind: "support",
          badge: "Support",
          title: "Supplier Governance + Data Integrity",
          oneLiner:
            "Governance routines for supplier data, status logic, and reporting confidence across procurement workflows.",
          bullets: [
            "Defined field ownership + status conventions to reduce data ambiguity",
            "Built review habits around exceptions, not just snapshots",
            "Supported cleaner decision-making across sourcing and operations",
          ],
          tags: [
            "Governance",
            "Data Integrity",
            "Risk",
            "Workflow",
            "Reporting",
          ],
          tools: ["Tableau", "Spreadsheets", "ERP Exports"],
          scopeSignals: [
            "Operational reporting discipline",
            "Decision-ready data structures",
          ],
          systemSnapshot: [
            "Control points built around handoffs where data usually breaks",
            "Status models favor operational clarity over raw field count",
            "Exceptions routed to owners with clear review loops",
          ],
        },
        {
          id: "international-sourcing-ops",
          kind: "support",
          badge: "Support",
          title: "International Sourcing Operations",
          oneLiner:
            "Cross-border supplier workflows informed by language, culture, and on-the-ground procurement realities.",
          bullets: [
            "Bridged communication and execution gaps across international sourcing contexts",
            "Balanced speed, documentation, and supplier relationship management",
            "Turned operational nuance into process design inputs",
          ],
          tags: [
            "International Sourcing",
            "Supplier Relations",
            "Procurement Ops",
            "Execution",
            "Cultural Fluency",
          ],
          tools: [
            "Vendor Docs",
            "Status Trackers",
            "Procurement Workflows",
          ],
          scopeSignals: [
            "China/Taiwan operational context",
            "Tasteful domain differentiator",
          ],
          systemSnapshot: [
            "Process design reflects language + cultural friction points",
            "Documentation standards support handoffs across time zones",
            "Supplier communication loops built for reliability, not speed alone",
          ],
        },
      ],
    },
  },

  // ── Screen 4 — Consulting ──────────────────────────────────────────────
  {
    id: 4,
    name: "Consulting",
    number: "04 / 04",
    type: "consulting",
    consulting: {
      eyebrow: "AI strategy + implementation roadmap",
      heroTitle: "Strategy that ships.",
      heroSubtitle:
        "Consulting for teams that need clarity, a working prototype, or both.",
      identityLine:
        "Design \u00d7 Domain knowledge \u00d7 AI \u00d7 Systems thinking.",
      founderLine:
        "Founder-style execution bias: define the problem, build the right thing, and make the handoff usable.",
      offers: [
        {
          id: "ai-roadmap-sprint",
          title: "AI Roadmap Sprint",
          status: "Offer",
          oneLiner:
            "Turn a broad AI opportunity into a scoped system plan with decision-ready priorities.",
          deliverables: [
            "Use-case map + sequencing plan",
            "Data/workflow constraints audit",
            "Pilot recommendation with success criteria",
          ],
          tags: [
            "Strategy",
            "AI Ops",
            "Scoping",
            "Prioritization",
            "Decision Support",
          ],
          bestFor:
            "Leaders who need a practical AI implementation direction without committing to a full build yet.",
          modalSections: [
            {
              label: "Problem",
              text: "Teams know AI matters, but the next step is fuzzy and risks turning into slideware.",
            },
            {
              label: "Approach",
              text: "Audit workflow friction, rank opportunities by feasibility + business leverage, then shape a pilot path.",
            },
            {
              label: "Deliverable",
              text: "A tight roadmap with pilot scope, operating assumptions, and what to build first.",
            },
          ],
          systemSnapshot: [
            "Roadmap starts from workflow leverage, not model novelty",
            "Decisions gated by data readiness + process ownership",
            "Pilot scope defined with measurable acceptance criteria",
          ],
        },
        {
          id: "mvp-prototype-sprint",
          title: "MVP Prototype Sprint",
          status: "Offer",
          oneLiner:
            "Move from concept to a working prototype that proves the interaction, workflow, and system shape.",
          deliverables: [
            "Interactive prototype / functional MVP slice",
            "Core workflow + data model assumptions",
            "Testing plan + next build recommendations",
          ],
          tags: [
            "Prototype",
            "MVP",
            "UX",
            "AI Integration",
            "Rapid Build",
          ],
          bestFor:
            "Teams that need something real to evaluate internally or show stakeholders before scaling up.",
          modalSections: [
            {
              label: "Problem",
              text: "Ideas stall when teams can only discuss slides, screenshots, or disconnected proof-of-concepts.",
            },
            {
              label: "Approach",
              text: "Build the smallest credible system slice that demonstrates the actual user and operator loop.",
            },
            {
              label: "Deliverable",
              text: "A working prototype with clear boundaries, assumptions, and a plan for production hardening.",
            },
          ],
          systemSnapshot: [
            "Prototype scope chosen to test the riskiest workflow assumption first",
            "UX and system behavior designed together, not sequentially",
            "Handoff notes capture what is validated vs. still unknown",
          ],
        },
        {
          id: "reserved-offer-slot",
          title: "Offer Slot (Reserved)",
          status: "Reserved",
          oneLiner:
            "Reserved for a focused engagement that fits the problem well and benefits from hands-on build partnership.",
          deliverables: [
            "Scoped based on workflow + implementation reality",
            "Defined around a clear business decision or delivery milestone",
            "Shaped to complement internal team velocity",
          ],
          tags: [
            "Reserved",
            "Select Fit",
            "Custom Scope",
            "Builder Partner",
          ],
          bestFor:
            "Situations where a standard sprint format is close, but the execution path needs a tailored structure.",
          modalSections: [
            {
              label: "Problem",
              text: "Some projects need a precise scope shape that doesn\u2019t fit a generic services menu.",
            },
            {
              label: "Approach",
              text: "Define the engagement around the bottleneck: decision clarity, prototype execution, or workflow systems design.",
            },
            {
              label: "Deliverable",
              text: "A bespoke sprint or build sequence with a concrete outcome and a tight operating cadence.",
            },
          ],
          systemSnapshot: [
            "Scope shaped around bottleneck removal, not activity volume",
            "Engagement design keeps internal team ownership visible",
            "Outputs optimized for momentum after the sprint",
          ],
        },
      ],
      proofTiles: [
        {
          title: "Case-study-lite: AI workflow direction",
          clientType: "Ops-heavy team",
          problem:
            "Too many ideas, no clear path to a first implementation.",
          approach:
            "Mapped process friction + ranked opportunities by feasibility and leverage.",
          deliverable:
            "Pilot-ready roadmap with system boundaries and validation criteria.",
        },
        {
          title: "Case-study-lite: prototype validation",
          clientType: "Product + leadership stakeholders",
          problem:
            "Needed a concrete artifact to align decisions and reduce abstract debate.",
          approach:
            "Built a functional prototype slice around the highest-risk workflow.",
          deliverable:
            "Working demo with next-step build plan and testing priorities.",
        },
      ],
    },
  },
];
