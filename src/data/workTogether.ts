// "Let's work together" — the copy and structure behind the final Work section.
//
// Three paths, one destination screen each. No sub-tabs, no capability menus,
// no second decision layer: the opening screen is the only choice the visitor
// makes, and whatever they pick resolves into one complete screen.
//
// This is the production source. The CTA lab (`src/data/ctaLab.ts`) re-exports
// from here so the lab and the live section can never drift apart.
//
// Nothing here is invented: every fact is carried over from an existing source
// in the repo, noted inline, so future edits don't drift into claims the site
// can't back up.
//
// Positioning guardrail: Hayden is a founder running WorldPulse who takes
// selective consulting work. Never phrase anything as job-seeking — no
// "hire me", "open to work", "looking for a job", "available for employment".

import { CALENDLY_URL, CONNECT_LINKS } from "@/data/connect";

/* ---------------------------------------------------------------------------
   Flow vocabulary
   ------------------------------------------------------------------------ */

/** Two levels. `destination` is terminal — nothing branches out of it. */
export type Step = "intro" | "paths" | "destination";

export type PathId = "consulting" | "worldpulse" | "experience";

/* ---------------------------------------------------------------------------
   Shared copy
   ------------------------------------------------------------------------ */

/** Every concept starts here. Matches HERO_CTA_LABEL in consultingHeroTransition.ts. */
export const CTA_LABEL = "Let's work together";

export const CTA_HINT = "Choose where to start";

const EMAIL_HREF =
  CONNECT_LINKS.find((l) => l.id === "email")?.href ?? "mailto:haydenjbaxter@gmail.com";

const LINKEDIN_HREF =
  CONNECT_LINKS.find((l) => l.id === "linkedin")?.href ??
  "https://www.linkedin.com/in/haydenjbaxter/";

const WORLDPULSE_HREF =
  CONNECT_LINKS.find((l) => l.id === "worldpulse")?.href ?? "https://worldxpulse.com";

/** Hayden's resume / CV, served unchanged from the public documents directory. */
export const RESUME_HREF = "/documents/Hayden-Baxter-Resume.pdf";

/* ---------------------------------------------------------------------------
   Types
   ------------------------------------------------------------------------ */

export interface DestinationAction {
  label: string;
  href: string;
  external?: boolean;
}

/** A titled group inside a destination screen — never a tab, always visible. */
export interface DestinationBlock {
  label: string;
  descriptor: string;
  items: string[];
}

export interface Destination {
  /** Mono eyebrow at the top of the screen. */
  eyebrow: string;
  /** Editorial headline. */
  title: string;
  /** One paragraph that states the offer plainly. */
  lede: string;
  /** Two side-by-side groups on desktop, stacked on narrow. */
  blocks: [DestinationBlock, DestinationBlock];
  /** Mono credential strip under the blocks. */
  signals: string[];
  /** One supporting line above the actions. */
  note: string;
  primary: DestinationAction;
  secondary?: DestinationAction;
}

export interface PathDef {
  id: PathId;
  /** Editorial index numeral. */
  index: string;
  /** The action the visitor is taking. */
  label: string;
  /** The supporting idea, shown next to the label on the opening screen. */
  lede: string;
  /** Mono metadata — the shape of the path in three beats. */
  meta: string;
  destination: Destination;
}

/* ---------------------------------------------------------------------------
   Path 01 — Start a Consulting Project
   Sources: consultingOffers.ts (ai + supply descriptors and bullets),
            work.ts consulting screen (heroTitle, heroSubtitle, offers,
            identityLine), work.ts supplyChain.bridgeLine, connect.ts.
   AI and supply chain sit together here on purpose: the visitor should never
   have to pick a discipline before they can understand the offer or get in
   touch.
   ------------------------------------------------------------------------ */

const CONSULTING: PathDef = {
  id: "consulting",
  index: "01",
  label: "Start a Consulting Project",
  lede: "AI or supply chain consulting",
  meta: "Strategy · Systems · Build",
  destination: {
    eyebrow: "Consulting",
    // work.ts → consulting.heroTitle
    title: "Strategy that ships.",
    lede:
      "I help organisations turn complex AI and supply-chain problems into practical systems, workflows, products, and operating improvements — for teams that need clarity, a working prototype, or both.",
    blocks: [
      {
        label: "AI Systems",
        // consultingOffers.ts → ai
        descriptor:
          "Bridging AI, systems design, and user experience into practical tools and products.",
        items: [
          "AI workflow design",
          "Intelligent interfaces",
          "Internal tools & agents",
          "Automation systems",
          "Rapid prototyping",
        ],
      },
      {
        label: "Supply Chain",
        // consultingOffers.ts → supply
        descriptor:
          "Bridging operational strategy, supplier systems, and product visibility across global networks.",
        items: [
          "Procurement & sourcing",
          "Supplier relationships",
          "Traceability systems",
          "Logistics & operations",
          "International coordination",
        ],
      },
    ],
    // work.ts → consulting.offers (sprint names) + identityLine
    signals: [
      "AI Roadmap Sprint",
      "MVP Prototype Sprint",
      "Design × Domain × AI × Systems",
    ],
    // work.ts → supplyChain.bridgeLine
    note: "AI fits best after the operating model is clear. I design the workflow and data shape first, then layer automation where it compounds.",
    primary: { label: "Discuss a project", href: CALENDLY_URL, external: true },
    secondary: { label: "Send an email", href: EMAIL_HREF },
  },
};

/* ---------------------------------------------------------------------------
   Path 02 — Explore WorldPulse
   Sources: work.ts WORK_SCREENS[0] (founder line, what WorldPulse proves,
            the worldxpulse.com link), consultingOffers.ts → worldpulse.
   Stands alone as a venture. No traction, customers, funding, or results are
   claimed anywhere — the repo doesn't contain any, so neither does this.
   ------------------------------------------------------------------------ */

const WORLDPULSE: PathDef = {
  id: "worldpulse",
  index: "02",
  label: "Explore WorldPulse",
  lede: "Pilots, partnerships, customers, and investment conversations.",
  meta: "Active venture",
  destination: {
    eyebrow: "Active venture",
    title: "WorldPulse",
    // work.ts → WORK_SCREENS[0].full.caption (both lines, condensed)
    lede:
      "Founder at WorldPulse, where we turn complex supply chain data into visual, engaging product stories. WorldPulse proves that supply chain does not have to feel cold, hidden, or technical — we make product origin, compliance, and traceability easier to understand through design-driven Digital Product Passports.",
    blocks: [
      {
        label: "What we build",
        // consultingOffers.ts → worldpulse
        descriptor:
          "Exploring how products, materials, and supply chains can become more transparent, intelligent, and connected.",
        items: [
          "Digital Product Passports",
          "Product storytelling",
          "Traceability systems",
          "Sustainability visibility",
          "AI-enhanced experiences",
        ],
      },
      {
        label: "Conversations open now",
        descriptor:
          "The venture is active and building. These are the conversations worth having.",
        items: [
          "Potential customers",
          "Pilot partners",
          "Strategic collaborators",
          "Commercial partners",
          "Investors",
        ],
      },
    ],
    signals: ["Digital Product Passports", "Traceability", "worldxpulse.com"],
    note: "Founder-led, and building now — the fastest way in is a direct conversation about where you fit.",
    primary: { label: "Explore WorldPulse", href: WORLDPULSE_HREF, external: true },
    secondary: { label: "Discuss a partnership", href: CALENDLY_URL, external: true },
  },
};

/* ---------------------------------------------------------------------------
   Path 03 — Review My Experience
   Sources: about.ts (intro), siteContent.ts (brands), work.ts (supply chain
            quote lines + featured roleLine, ETB credibility line + projects,
            WorldPulse, consulting founderLine), connect.ts.
   Founder-led and executive: this is a record, not availability.
   ------------------------------------------------------------------------ */

const EXPERIENCE: PathDef = {
  id: "experience",
  index: "03",
  label: "Review My Experience",
  lede: "Resume, leadership background, and selected work.",
  meta: "Founder · Operator · Builder",
  destination: {
    eyebrow: "Experience",
    // work.ts → consulting.founderLine, compressed to a headline
    title: "Founder-style execution.",
    // about.ts → intro
    lede:
      "Product builder, supply chain operator, and emerging-tech generalist working between the U.S. and Asia. Eight-plus years navigating international sourcing, building design-driven products, and translating complex workflows into systems that actually ship.",
    blocks: [
      {
        label: "Leadership",
        // work.ts → supplyChain.featured.roleLine
        descriptor:
          "Across Aosom, Disney, and Three Tree: procurement execution, supplier coordination, data integrity, and reporting discipline.",
        items: [
          // work.ts → WORK_SCREENS[0].full.caption
          "Founder at WorldPulse",
          // work.ts → supplyChain.heroArt.quoteLines
          "Fortune 100 sourcing leader",
          "8+ years across Asia",
          "Supplier networks — China, Vietnam, Indonesia",
          "International operations & sourcing",
        ],
      },
      {
        label: "Selected work",
        // work.ts → WORK_LANDING.quote
        descriptor: "Rooted in outcome and action — the builds behind the record.",
        items: [
          "WorldPulse — Digital Product Passports",
          // work.ts → etb.projects
          "AtomicOS — personal operating system",
          "CaseBrief — case intelligence",
          // work.ts → supplyChain.featured
          "Global Supplier Ops + Data Governance",
          "AI Roadmap & MVP Prototype Sprints",
        ],
      },
    ],
    signals: [
      // siteContent.ts → brands
      "Nike",
      "Disney",
      "Aosom",
      // about.ts → intro
      "Fluent in Mandarin",
      // work.ts → etb.credibilityLine
      "M.S. Artificial Intelligence in Business (ASU)",
    ],
    note: "Design × Domain knowledge × AI × Systems thinking — shared for consulting, partnership, and venture conversations.",
    primary: {
      label: "VIEW MY RESUME",
      href: RESUME_HREF,
      external: true,
    },
    secondary: { label: "LinkedIn", href: LINKEDIN_HREF, external: true },
  },
};

export const PATHS: PathDef[] = [CONSULTING, WORLDPULSE, EXPERIENCE];

export function getPath(id: PathId): PathDef {
  return PATHS.find((p) => p.id === id) ?? CONSULTING;
}
