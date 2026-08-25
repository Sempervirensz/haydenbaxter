// The consulting answer: two named paths.
//
// This is the production source. The lab at /consulting-paths-lab re-exports
// from here, so the two cannot drift — the same relationship `ctaLab.ts` has
// with `workTogether.ts`.
//
// WHAT IT REPLACED
//
// "Start a Consulting Project" used to open one paper panel listing AI Systems
// and Supply Chain as two read-only blocks over a single generic "Discuss a
// project" button. Both disciplines were visible; neither was actionable on its
// own, so the ask stayed generic even when the visitor's need was not.
//
// SOURCING
//
// Nothing here is invented. Every line is carried from an existing source in
// the repo, noted inline, so the panel cannot make a claim the site can't back
// up. The two names are the only new strings: they name the ENGAGEMENT SHAPE
// the existing offers already describe, they do not add scope.
//
// Positioning guardrail (carried from workTogether.ts): Hayden is a founder who
// takes selective consulting work. "Fractional" and "Advisor" name a mode of
// engagement, never availability for employment.

import { CALENDLY_URL, CONNECT_LINKS } from "@/data/connect";
import type { DestinationAction } from "@/data/workTogether";

const EMAIL_HREF =
  CONNECT_LINKS.find((l) => l.id === "email")?.href ?? "mailto:haydenjbaxter@gmail.com";

export type ConsultingPathId = "ai" | "supply";

/** A titled beat inside the expanded detail — an engagement, not a feature. */
export interface PathEngagement {
  title: string;
  /** Mono status/metadata line. */
  meta: string;
  body: string;
}

export interface ConsultingPath {
  id: ConsultingPathId;
  /** Editorial index numeral, matching the row above it. */
  index: string;
  /** Mono kicker — the discipline. */
  kicker: string;
  /** The engagement, named. */
  name: string;
  /** One line, always visible. The reason to pick this side. */
  summary: string;
  /** Always visible under the summary. Short, scannable. */
  capabilities: string[];
  /** Revealed on expand. */
  detail: {
    lede: string;
    engagements: PathEngagement[];
    /** Mono chips — how the work is actually run. */
    signals: string[];
    /** One supporting line above the actions. */
    note: string;
    /** Optional pointer to the work that proves the claim. */
    proof?: { body: string; action: DestinationAction };
  };
  primary: DestinationAction;
  secondary: DestinationAction;
}

/* ---------------------------------------------------------------------------
   Path A — Fractional AI Partner
   Sources: consultingOffers.ts → ai (descriptor + bullets);
            work.ts → consulting.offers (AI Roadmap Sprint, MVP Prototype
            Sprint: oneLiner, status, modalSections, systemSnapshot),
            consulting.founderLine, consulting.identityLine.
   ------------------------------------------------------------------------ */

const AI: ConsultingPath = {
  id: "ai",
  index: "01",
  kicker: "AI Systems",
  name: "Fractional AI Partner",
  // consultingOffers.ts → ai.descriptor
  summary:
    "Bridging AI, systems design, and user experience into practical tools and products.",
  // consultingOffers.ts → ai.bullets
  capabilities: [
    "AI workflow design",
    "Intelligent interfaces",
    "Internal tools & agents",
    "Automation systems",
    "Rapid prototyping",
  ],
  detail: {
    // work.ts → consulting.founderLine
    lede:
      "Founder-style execution bias: define the problem, build the right thing, and make the handoff usable. Two sprint shapes, sequenced — clarity first, then something real to evaluate.",
    engagements: [
      {
        title: "AI Roadmap Sprint",
        // work.ts → offers[0].status
        meta: "Offer · Strategy",
        // work.ts → offers[0].oneLiner
        body:
          "Turn a broad AI opportunity into a scoped system plan with decision-ready priorities. Audit workflow friction, rank opportunities by feasibility and business leverage, then shape a pilot path.",
      },
      {
        title: "MVP Prototype Sprint",
        meta: "Offer · Build",
        // work.ts → offers[1].oneLiner + modalSections.Approach
        body:
          "Move from concept to a working prototype that proves the interaction, workflow, and system shape — the smallest credible system slice that demonstrates the actual user and operator loop.",
      },
    ],
    // work.ts → offers[*].systemSnapshot, condensed
    signals: [
      "Workflow leverage over model novelty",
      "Riskiest assumption tested first",
      "Handoff notes: validated vs. unknown",
    ],
    // work.ts → consulting.identityLine
    note: "Design × Domain knowledge × AI × Systems thinking.",
    // Proof, not claims — the same AI systems the homepage's Screen 2 shows.
    proof: {
      body:
        "Every claim here is backed by something built. Selected AI Work is the proof: real problems turned into working solutions you can look at.",
      action: { label: "See Selected AI Work", href: "/emerging-tech-builds" },
    },
  },
  primary: { label: "Discuss a project", href: CALENDLY_URL, external: true },
  secondary: { label: "Send an email", href: EMAIL_HREF },
};

/* ---------------------------------------------------------------------------
   Path B — Supply Chain Advisor
   Sources: consultingOffers.ts → supply (descriptor + bullets);
            work.ts → supplyChain.bridgeLine, supplyChain.featured
            (title, roleLine, oneLiner, bullets), supplyChain.heroArt.quoteLines.
   ------------------------------------------------------------------------ */

const SUPPLY: ConsultingPath = {
  id: "supply",
  index: "02",
  kicker: "Supply Chain",
  name: "Supply Chain Advisor",
  // consultingOffers.ts → supply.descriptor
  summary:
    "Bridging operational strategy, supplier systems, and product visibility across global networks.",
  // consultingOffers.ts → supply.bullets
  capabilities: [
    "Procurement & sourcing",
    "Supplier relationships",
    "Traceability systems",
    "Logistics & operations",
    "International coordination",
  ],
  detail: {
    // work.ts → supplyChain.bridgeLine
    lede:
      "AI fits best after the operating model is clear. I design the workflow and data shape first, then layer automation where it compounds.",
    engagements: [
      {
        title: "Global Supplier Ops",
        // work.ts → supplyChain.featured.roleLine, compressed
        meta: "Operator record",
        // work.ts → supplyChain.featured.oneLiner + bullets[0]
        body:
          "Built the connective tissue between sourcing decisions and the systems teams use to execute them — mapping sourcing workflows into repeatable operating logic instead of one-off firefighting.",
      },
      {
        title: "Data Governance",
        meta: "Operator record",
        // work.ts → supplyChain.featured.bullets[1..2]
        body:
          "Aligned supplier communication, documentation, and status tracking across teams, and improved decision quality by tightening data definitions and reporting consistency.",
      },
    ],
    // work.ts → supplyChain.heroArt.quoteLines
    signals: [
      "Fortune 100 sourcing leader",
      "8+ years across Asia",
      "China · Vietnam · Indonesia",
    ],
    // work.ts → supplyChain.featured.roleLine
    note: "Across Aosom, Disney, and Three Tree: procurement execution, supplier coordination, data integrity, and reporting discipline.",
  },
  primary: { label: "Discuss a project", href: CALENDLY_URL, external: true },
  secondary: { label: "Send an email", href: EMAIL_HREF },
};

/** Left to right on desktop, stacked on narrow. */
export const CONSULTING_PATHS: ConsultingPath[] = [AI, SUPPLY];

/* ---------------------------------------------------------------------------
   The screen the two paths live in — the header above them is unchanged from
   production (workTogether.ts → CONSULTING.destination eyebrow/title/lede),
   because only the ANSWER is being redesigned, not the question.
   ------------------------------------------------------------------------ */

export const CONSULTING_SCREEN = {
  eyebrow: "Consulting",
  // work.ts → consulting.heroTitle
  title: "Strategy that ships.",
  // work.ts → consulting.heroSubtitle, widened to cover both paths
  lede: "Two ways to work together. Pick the one that matches the problem.",
};
