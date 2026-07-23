export interface NarrativeSectionFrame {
  heading: string;
  framing: string;
  priority: "primary" | "secondary";
}

export interface NarrativeVariant {
  id: string;
  label: string;
  shortTag: string;
  intent: string;
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
  };
  primaryCta: {
    label: string;
    logic: string;
  };
  worldPulse: NarrativeSectionFrame;
  emergingTech: NarrativeSectionFrame;
  supplyChain: NarrativeSectionFrame;
  consulting: NarrativeSectionFrame;
  aboutJournalConnect: {
    about: string;
    journal: string;
    connect: string;
  };
  tradeoff: string;
}

export const NARRATIVE_VARIANTS: NarrativeVariant[] = [
  {
    id: "proof_first",
    label: "Proof-First Homepage",
    shortTag: "Proof First",
    intent: "Proof-first structure with operational credibility up front.",
    hero: {
      eyebrow: "Builder and operator across AI, supply chain, and real-world systems.",
      headline: "Proof before pitch.",
      subhead:
        "Explore the builds, operational depth, and venture paths that show how Hayden works.",
    },
    primaryCta: {
      label: "Explore Work",
      logic: "Start with real work, then move into venture paths and consulting.",
    },
    worldPulse: {
      heading: "WorldPulse",
      framing:
        "A focused venture path in digital product passports, provenance, and product storytelling.",
      priority: "secondary",
    },
    emergingTech: {
      heading: "AI Builds",
      framing:
        "Agents, workflow tools, and product prototypes built to handle real constraints.",
      priority: "primary",
    },
    supplyChain: {
      heading: "Supply Chain",
      framing:
        "Depth across sourcing, supplier systems, governance, and cross-border execution.",
      priority: "primary",
    },
    consulting: {
      heading: "Consulting",
      framing:
        "Practical support for roadmap, prototyping, and implementation.",
      priority: "secondary",
    },
    aboutJournalConnect: {
      about:
        "A concise operator background across U.S. and Asia.",
      journal:
        "Field notes on AI, supply chain, and product decisions.",
      connect:
        "Direct path to start a conversation.",
    },
    tradeoff:
      "Best for credibility-first visitors; weaker if the goal is venture-led storytelling.",
  },
  {
    id: "venture_forward",
    label: "WorldPulse Venture Funnel",
    shortTag: "Venture Forward",
    intent:
      "Use WorldPulse as the narrative front door while still keeping portfolio trust visible.",
    hero: {
      eyebrow: "Founder narrative",
      headline:
        "WorldPulse is the venture thesis: origin intelligence at product scale.",
      subhead:
        "The homepage becomes a funnel into venture context, then backs it with capability proof.",
    },
    primaryCta: {
      label: "Enter WorldPulse Path",
      logic:
        "First click drives venture exploration, with work sections validating execution depth.",
    },
    worldPulse: {
      heading: "Core Identity",
      framing:
        "Elevated to the primary frame: venture mission, market relevance, and strategic direction.",
      priority: "primary",
    },
    emergingTech: {
      heading: "Capability Engine",
      framing:
        "Framed as the R&D/build engine enabling venture velocity and product quality.",
      priority: "secondary",
    },
    supplyChain: {
      heading: "Differentiating Moat",
      framing:
        "Supply chain background reads as unfair advantage for provenance and traceability products.",
      priority: "secondary",
    },
    consulting: {
      heading: "Selective Advisory",
      framing:
        "Secondary path for aligned teams; consultation framed as extension of venture operating model.",
      priority: "secondary",
    },
    aboutJournalConnect: {
      about:
        "Founder timeline supports venture legitimacy and domain grounding.",
      journal:
        "Thought leadership reinforces market vision and strategic narrative.",
      connect:
        "Split between venture conversations and selective advisory inquiries.",
    },
    tradeoff:
      "Best for venture momentum; can under-serve visitors who primarily want portfolio hiring proof.",
  },
  {
    id: "consulting_router",
    label: "AI + Supply Chain Router",
    shortTag: "Consulting Router",
    intent:
      "Treat homepage as a practical routing layer for consulting demand across AI and operations.",
    hero: {
      eyebrow: "For operators and product teams",
      headline:
        "Choose your path: AI system build, supply chain architecture, or both.",
      subhead:
        "A service-forward narrative that keeps proof modules visible but decision flow explicit.",
    },
    primaryCta: {
      label: "Route My Use Case",
      logic:
        "CTA clarifies visitor intent early, then sends them to relevant proof blocks and booking.",
    },
    worldPulse: {
      heading: "Venture Proof Point",
      framing:
        "Shown as flagship case of applied strategy, not as homepage identity.",
      priority: "secondary",
    },
    emergingTech: {
      heading: "AI Build Track",
      framing:
        "Organized as evidence for model-to-workflow implementation capability.",
      priority: "primary",
    },
    supplyChain: {
      heading: "Operations Track",
      framing:
        "Organized as evidence for governance, sourcing systems, and execution reliability.",
      priority: "primary",
    },
    consulting: {
      heading: "Clear Engagement Paths",
      framing:
        "Primary conversion zone: what you get, who it is for, and what decision it enables.",
      priority: "primary",
    },
    aboutJournalConnect: {
      about:
        "Short credential context to reduce uncertainty before booking.",
      journal:
        "Optional depth for teams evaluating strategic fit.",
      connect:
        "Scheduling and channels treated as final step in a routing funnel.",
    },
    tradeoff:
      "Best for conversion clarity; can feel less iconic than founder/venture-forward narratives.",
  },
  {
    id: "founder_operator",
    label: "Founder-Operator Arc",
    shortTag: "Founder Arc",
    intent:
      "Lead with personal through line from operator roots to product builder and founder.",
    hero: {
      eyebrow: "Operator to builder to founder",
      headline:
        "Built in factories, boardrooms, and product systems across two continents.",
      subhead:
        "Narrative arc prioritizes biography as evidence, then routes into ventures, builds, and advisory.",
    },
    primaryCta: {
      label: "See the Arc",
      logic:
        "CTA introduces the sequence: story first, then proof modules mapped to each chapter.",
    },
    worldPulse: {
      heading: "Current Chapter",
      framing:
        "Positioned as the latest chapter in a longer operating journey.",
      priority: "secondary",
    },
    emergingTech: {
      heading: "Builder Chapter",
      framing:
        "Shows transition from operator expertise into applied AI and product experimentation.",
      priority: "secondary",
    },
    supplyChain: {
      heading: "Foundation Chapter",
      framing:
        "Core proof of domain depth and real-world constraint experience.",
      priority: "primary",
    },
    consulting: {
      heading: "Applied Partnership",
      framing:
        "Offered as direct access to the same founder-operator playbook.",
      priority: "secondary",
    },
    aboutJournalConnect: {
      about:
        "Expanded role: the spine of the homepage narrative.",
      journal:
        "Journal acts as reflective continuation of the founder perspective.",
      connect:
        "Connect follows after story trust is established.",
    },
    tradeoff:
      "Best for differentiation and memorability; may slow action for task-focused visitors.",
  },
  {
    id: "hybrid_signal",
    label: "Hybrid Signal System",
    shortTag: "Hybrid",
    intent:
      "Balance venture ambition, portfolio proof, and consulting conversion without over-weighting one.",
    hero: {
      eyebrow: "Signal + substance",
      headline:
        "AI builds, supply chain depth, and venture execution in one operating system.",
      subhead:
        "A balanced hierarchy for mixed audiences: collaborators, clients, and venture partners.",
    },
    primaryCta: {
      label: "Choose Priority",
      logic:
        "CTA opens three top intents: explore builds, view operator depth, or start a consulting conversation.",
    },
    worldPulse: {
      heading: "Featured Path",
      framing:
        "Prominent but not dominant; framed as strategic frontier.",
      priority: "secondary",
    },
    emergingTech: {
      heading: "Execution Signal",
      framing:
        "Shows technical competency with emphasis on working systems over demos.",
      priority: "primary",
    },
    supplyChain: {
      heading: "Credibility Signal",
      framing:
        "Shows operational maturity and domain reality grounding.",
      priority: "primary",
    },
    consulting: {
      heading: "Action Signal",
      framing:
        "Clear practical on-ramp for teams needing immediate support.",
      priority: "primary",
    },
    aboutJournalConnect: {
      about:
        "Tight profile confirming multi-domain legitimacy.",
      journal:
        "Selective depth for people comparing thought quality.",
      connect:
        "Quick conversion path while preserving optionality.",
    },
    tradeoff:
      "Best all-around balance; less opinionated than specialized narrative bets.",
  },
];
