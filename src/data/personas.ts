// Personas: the three areas Hayden works in, stated as roles rather than offers.
//
// This file is the ONLY source of persona copy on the site. The section markup
// (`PersonasSection.tsx`) and the "Let's work together" CTA
// (`workTogether.ts`) both read from here, so a wording change lands in one
// place and can never drift between the CTA and the panels.
//
// `area` is the short DYMO label: it names the tab and it names the same area
// inside the CTA. `title` and `bullets` are the long-form copy and appear only
// in the panel.
//
// Positioning guardrail (carried over from workTogether.ts): Hayden is a
// founder running WorldPulse who takes selective consulting work. Nothing here
// is phrased as job-seeking.

export type PersonaId = "ai" | "supply" | "worldpulse";

export interface Persona {
  id: PersonaId;
  /** Editorial index numeral, matching the Work Together rows. */
  index: string;
  /** Short DYMO label. Names the tab, and names the area in the CTA. */
  area: string;
  /** Full role title, shown in the panel. */
  title: string;
  /**
   * What the role covers. Three beats each.
   *
   * The FIRST is load-bearing: it is the one shown before a persona is
   * expanded, so it should stand on its own as the headline accomplishment.
   * The rest are revealed on hover, focus, or tap.
   */
  bullets: string[];
}

/** The bullet shown before a persona is expanded. */
export function personaPreview(p: Persona): string {
  return p.bullets[0];
}

/** The bullets revealed on hover, focus, or tap. */
export function personaRest(p: Persona): string[] {
  return p.bullets.slice(1);
}

export const PERSONAS: Persona[] = [
  {
    id: "ai",
    index: "01",
    area: "AI Strategy",
    title: "AI Strategist & Builder",
    bullets: [
      "Builds practical AI products, prototypes, and workflows that address real business needs",
      "Translates complex business challenges into clear AI strategies, product concepts, and implementation plans",
      "Connects business strategy, product design, data, and hands-on development from idea through execution",
    ],
  },
  {
    id: "supply",
    index: "02",
    area: "Global Supply Chain",
    title: "Global Supply Chain & Cross-Cultural Leader",
    bullets: [
      "Led Nike and Converse global sourcing initiatives including factory onboarding, compliance, supplier performance, and end-to-end operational management",
      "Bridges English-speaking and Chinese-speaking teams across APAC and U.S. markets to strengthen alignment, trust, and execution",
      "Skilled in supplier negotiation, relationship management, traceability, and optimizing complex global supply chain operations",
    ],
  },
  {
    id: "worldpulse",
    index: "03",
    area: "WorldPulse",
    title: "WorldPulse Founder & Sustainability-Tech Innovator",
    bullets: [
      "Founder and product designer at WorldPulse developing Digital Product Passport technology for supply chain transparency",
      "Connects traceability, sustainability data, compliance, and product storytelling to create more trusted product experiences",
      "Drives innovation at the intersection of technology, responsible sourcing, and environmental accountability",
    ],
  },
];

/** Section heading. Single-word serif, matching Connect / About / Journal. */
export const PERSONAS_HEADING = "Personas";

/**
 * The area labels the CTA references, in order.
 *
 * Derived rather than retyped so the CTA and the tabs can never disagree about
 * what the three areas are called.
 */
export const PERSONA_AREAS: string[] = PERSONAS.map((p) => p.area);
