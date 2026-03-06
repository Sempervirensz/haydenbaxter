export interface WorkScreen {
  id: number;
  name: string;
  number: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface WorkScrollZone {
  hold: [number, number];
  deg: number;
  label: string;
}

export const WORK_LANDING = {
  title: "Work",
  quote: "Rooted in outcome and action.",
  scrollHint: "Scroll to explore",
  activeLabel: "WorldPulse",
};

export const WORK_SCREENS: WorkScreen[] = [
  {
    id: 1,
    name: "WorldPulse",
    number: "01 / 04",
    title: "Digital Product Passports",
    description:
      "Design- and data-driven traceability products that make product origin and process transparent.",
    bullets: [
      "Founder-led product strategy and execution",
      "Built for real-world compliance and operations",
      "Clear narrative across supply chain, data, and UX",
    ],
  },
  {
    id: 2,
    name: "Emerging Tech",
    number: "02 / 04",
    title: "Usable AI Systems",
    description:
      "Hands-on builds across agent workflows, NLP, and productized AI tools designed to ship.",
    bullets: [
      "Prototype-to-production architecture thinking",
      "Focused on practical adoption, not demos",
      "Strong technical depth with product framing",
    ],
  },
  {
    id: 3,
    name: "Supply Chain",
    number: "03 / 04",
    title: "Operator Systems",
    description:
      "Procurement and supplier operations experience translated into clear workflows, governance, and execution systems.",
    bullets: [
      "8+ years across Asia and global supplier contexts",
      "Data integrity and reporting discipline",
      "Workflow-first automation mindset",
    ],
  },
  {
    id: 4,
    name: "Consulting",
    number: "04 / 04",
    title: "Strategy That Ships",
    description:
      "Scoped engagements that turn ambiguity into implementation plans and tangible product artifacts.",
    bullets: [
      "AI roadmap and prototype sprints",
      "Problem framing tied to delivery reality",
      "Clean handoff patterns for internal teams",
    ],
  },
];

export const WORK_SCROLL_CONFIG = {
  screenBreaks: [0, 0.6, 0.7, 0.8, 0.9, 1],
  zones: [
    { hold: [0.0, 0.22], deg: 0, label: "WorldPulse" },
    { hold: [0.25, 0.47], deg: -90, label: "Emerging Tech" },
    { hold: [0.5, 0.72], deg: -180, label: "Supply Chain" },
    { hold: [0.75, 0.94], deg: -270, label: "Consulting" },
    { hold: [0.97, 0.985], deg: -360, label: "WorldPulse" },
  ] as WorkScrollZone[],
};
