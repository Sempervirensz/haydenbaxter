// Consulting offer data — mirrors the shape of ETBLabProject so the
// dossier pattern from Emerging Tech can be reused directly.
// Copy is placeholder; structure is the priority.

export interface ConsultingOffer {
  id: string;
  name: string;
  status: string; // "Active" | "Reserved" | "Concept" — maps to ETB status pills
  category: string;
  oneLiner: string;
  bullets: string[];
  tags: string[];
  systemNotes: string[];
}

export const CONSULTING_OFFERS: Record<string, ConsultingOffer> = {
  ai: {
    id: "ai",
    name: "AI Implementation",
    status: "Active",
    category: "Applied AI · Strategy → Build",
    oneLiner:
      "Concrete AI integrations that turn ambiguous ambition into shipped, measurable workflows.",
    bullets: [
      "Problem framing, tool selection, and evaluation loops tailored to the business.",
      "Prototype in weeks, then graduate to production with clear ownership.",
      "Internal enablement so teams operate the system, not just consume it.",
    ],
    tags: ["LLM Workflows", "Retrieval", "Agents", "Evaluations", "Prompt Ops"],
    systemNotes: [
      "2–6 week discovery before build engagements",
      "Paired with an internal owner by default",
      "Ships with eval harness, not just a demo",
    ],
  },
  supply: {
    id: "supply",
    name: "Supply Chain",
    status: "Active",
    category: "Operations · Sourcing → Traceability",
    oneLiner:
      "Operational clarity for global supply chains — from sourcing decisions to traceability and compliance.",
    bullets: [
      "Vendor and flow mapping across tiers, surfaced as working artifacts.",
      "Risk, cost, and lead-time modeling that survives contact with reality.",
      "Traceability and DPP-ready structures that pre-empt regulation.",
    ],
    tags: ["Sourcing", "Traceability", "DPP", "Cost Modeling", "Compliance"],
    systemNotes: [
      "Cross-functional — ops, legal, eng",
      "Outputs plug into existing ERP/PLM",
      "Regulation-forward, not regulation-reactive",
    ],
  },
  worldpulse: {
    id: "worldpulse",
    name: "WorldPulse",
    status: "Concept",
    category: "Signals · Geopolitics → Commerce",
    oneLiner:
      "A live read on the macro signals that actually move product, price, and flow for operators.",
    bullets: [
      "Curated signal feeds mapped to specific business exposures.",
      "Scenario briefs that translate headlines into supply and demand pressure.",
      "A rhythm of decisions — weekly, monthly, quarterly — instead of noise.",
    ],
    tags: ["Macro", "Signals", "Scenario", "Briefings", "Exposure"],
    systemNotes: [
      "Subscription + bespoke briefs",
      "Read-only — no data pulled from clients",
      "Built to be skimmed in 5 minutes",
    ],
  },
};
