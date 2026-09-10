// Credibility lab copy.
// Lab-only. Nothing here ships unless a concept is explicitly promoted.
//
// Sourcing rules:
// - Converse copy is a sanitized summary of Hayden's March 2024 business
//   deliverable covering Tier 1 vendor workflows, lower-tier Aravo onboarding,
//   data scrubbing, and Aravo-SAP integration development/testing.
// - Disney metrics are carried from Hayden's archived professional record.
// - WorldPulse copy is grounded in the MS-AIB capstone plan and Drive artifacts
//   showing NLP/NER, structured data, SQL/database work, QR-linked DPP UI work.
// - Leland Foster's recommendation letter is a DRAFT. It must not ship as a
//   public testimonial until Hayden confirms final wording and permission.

export type CredibilityConceptId = "receipts" | "impact" | "dossier";

export interface CredibilityConcept {
  id: CredibilityConceptId;
  index: string;
  name: string;
  thesis: string;
  note: string;
}

export const CREDIBILITY_CONCEPTS: CredibilityConcept[] = [
  {
    id: "receipts",
    index: "01",
    name: "Receipts",
    thesis: "Explain the claim, then show the receipt.",
    note: "Recommended. Three proof cards after Personas, one testimonial after About, four quick answers before Journal.",
  },
  {
    id: "impact",
    index: "02",
    name: "Impact",
    thesis: "Let the numbers do most of the work.",
    note: "Lowest visual weight. A metric strip after Personas and one testimonial after About. No FAQ.",
  },
  {
    id: "dossier",
    index: "03",
    name: "Dossier",
    thesis: "One compact evidence object, then get out of the way.",
    note: "Everything lives in one section after Personas: proof rows, impact figures, resume link, and the testimonial.",
  },
];

export interface ProofItem {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
}

export const PROOF_ITEMS: ProofItem[] = [
  {
    id: "converse",
    eyebrow: "CONVERSE · SUPPLIER SYSTEMS",
    title: "Supplier governance connected to the systems behind it.",
    body:
      "Oversaw vendor onboarding, data quality, and development and testing of an Aravo-SAP integration supporting supplier governance, compliance, and traceability.",
    tags: ["Vendor governance", "Aravo", "SAP", "Traceability"],
  },
  {
    id: "disney",
    eyebrow: "DISNEY · PROCUREMENT",
    title: "Procurement work with measurable commercial outcomes.",
    body:
      "Onboarded 100+ vendors and supported LATAM vendor agreement renegotiations that delivered 13% annual cost savings.",
    tags: ["Procurement", "Vendor onboarding", "Negotiation", "LATAM"],
  },
  {
    id: "worldpulse",
    eyebrow: "WORLDPULSE · AI + TRACEABILITY",
    title: "A graduate AI project turned into a real product direction.",
    body:
      "Built from an MS-AIB capstone using NLP and NER to extract messy supply-chain data, structure it in a database, and surface it through QR-linked Digital Product Passports.",
    tags: ["NLP / NER", "SQL", "DPP", "Product design"],
  },
];

export interface ImpactItem {
  figure: string;
  label: string;
  note: string;
}

export const IMPACT_ITEMS: ImpactItem[] = [
  {
    figure: "100+",
    label: "FACTORIES",
    note: "Supported across global supply-chain work",
  },
  {
    figure: "1,000+",
    label: "SAP RECORDS",
    note: "Consolidated during global factory data-governance work",
  },
  {
    figure: "13%",
    label: "COST SAVINGS",
    note: "Annual LATAM vendor savings during Disney Streaming work",
  },
  {
    figure: "100+",
    label: "VENDORS",
    note: "Onboarded into Disney procurement workflows",
  },
];

export const TESTIMONIAL = {
  quote:
    "This certainly made it obvious to me that he definitely has the ability to reduce the complex to clearly understandable concepts for the novice.",
  name: "Leland G. Foster, Ph.D.",
  role: "Former Chief Scientist, Thermo Fisher Scientific",
  formerRole: "Former President, Biosciences Division, Fisher Scientific International",
  status: "DRAFT SOURCE · APPROVAL REQUIRED BEFORE PUBLICATION",
};

export interface QuickAnswer {
  question: string;
  answer: string;
}

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    question: "What kinds of opportunities are you open to?",
    answer:
      "Full-time leadership roles, fractional or consulting engagements, and select build partnerships where AI, supply chain, international business, or traceability are central to the problem.",
  },
  {
    question: "What does working with you usually look like?",
    answer:
      "I start by clarifying the business problem, constraints, and decision that needs to be made. Then I move from strategy into a prototype, operating plan, or implemented system.",
  },
  {
    question: "Can you work with global and cross-cultural teams?",
    answer:
      "Yes. My background includes sourcing and procurement across U.S. and APAC programs, and I work fluently in Mandarin Chinese.",
  },
  {
    question: "Where can I see the underlying work?",
    answer:
      "Selected AI systems are documented in AI & Emerging Tech Builds. My operating background is summarized in Review My Experience, and the full resume is available directly from the site.",
  },
];
