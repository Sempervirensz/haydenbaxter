// ---------------------------------------------------------------------------
// ETB Interaction Lab — isolated data for prototyping
// ---------------------------------------------------------------------------

export interface ETBLabProject {
  id: string;
  name: string;
  status: string;
  category: string;
  oneLiner: string;
  bullets: string[];
  tags: string[];
}

export const ETB_LAB_VARIANTS = ["A", "B", "C"] as const;
export type ETBLabVariant = (typeof ETB_LAB_VARIANTS)[number];

export const ETB_LAB_PROJECTS: ETBLabProject[] = [
  {
    id: "procurebridge",
    name: "ProcureBridge",
    status: "Prototype",
    category: "Supply Chain Apps",
    oneLiner:
      "International procurement workflow app: supplier intake, scoring, sourcing stages, documentation.",
    bullets: [
      "Supplier onboarding + scoring rubric + lifecycle tracking",
      "Docs + status workflows for sourcing decisions",
      "Built around real procurement constraints",
    ],
    tags: ["Procurement", "Supply Chain", "Workflow", "Data Model", "Risk"],
  },
  {
    id: "casebrief",
    name: "CaseBrief",
    status: "Stealth",
    category: "NLP/Privacy",
    oneLiner:
      "Medical record summarizer for law firms: chronology-first outputs built for controlled environments.",
    bullets: [
      "Summaries + timelines aligned to litigation review workflows",
      "Structured outputs with consistent claim tracing",
      "Designed for privacy constraints and long documents",
    ],
    tags: ["NLP", "Summarization", "Long-Context", "Redaction", "QA"],
  },
  {
    id: "atomicos",
    name: "AtomicOS",
    status: "Stealth",
    category: "Agents",
    oneLiner:
      "Atomic Habits-style behavior agent: routines, friction controls, accountability, reflection cadence.",
    bullets: [
      "Turns goals into tiny behaviors with triggers + environment design",
      "Tracks adherence + fatigue, adjusts recommendations",
      "Weekly ritual: review \u2192 plan \u2192 next steps",
    ],
    tags: ["Agents", "Behavior Design", "Automation", "Habit Loops", "Evaluation"],
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    status: "R&D",
    category: "R&D",
    oneLiner:
      "Agentic build system: tool orchestration + reusable workflows for faster shipping.",
    bullets: [
      "Agent templates for research \u2192 build \u2192 test loops",
      "Tool-calling patterns + guardrails for consistent outputs",
      "Optimized for speed without losing reliability",
    ],
    tags: ["R&D", "Agents", "Tool Calling", "Guardrails", "Iteration"],
  },
];
