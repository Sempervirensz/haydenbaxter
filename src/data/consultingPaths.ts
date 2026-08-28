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

import type { DestinationAction } from "@/data/workTogether";

/* Both offers send the visitor somewhere already on this page rather than out
   to a calendar or a mail client.
   - `#connect` is ConnectSection's own id. It carries the Calendly embed, so
     the booking route AGENTS.md guards is unchanged — it now goes through the
     section that owns it instead of a second inline CALENDLY_URL.
   - The chapter anchors come from WORK_CHAPTER_ANCHORS in `src/data/work.ts`,
     which both Work branches read, so these can't point at a desktop-only id.
   Plain hashes on a plain <a>: `Action` already renders one, and an in-page
   jump inside the scroll-driven Work stack is instant on this site by
   decision, not omission — see the comment on `land()` in SoftLockGate. */
const CONNECT_HREF = "#connect";
const AI_WORK_HREF = "#selected-ai-work";
const SUPPLY_CHAIN_HREF = "#supply-chain";

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
  /** The card's badge strip: the named offers on this side. Defaults to the
      engagement titles below, which is what every path shipped before this
      existed. `[]` prints no strip — a path that does not want to lead with
      named products. */
  badges?: string[];
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
   Sources: work.ts → consulting.offers (AI Roadmap Sprint, MVP Prototype
            Sprint: oneLiner, status, modalSections, systemSnapshot),
            consulting.founderLine, consulting.identityLine.

   The card's own two lines — `summary` and `capabilities` — are the exception
   to the SOURCING rule at the top of this file, and deliberately so. Carried
   verbatim from consultingOffers.ts they read as an agency descriptor
   ("bridging AI, systems design, and user experience") over five capability
   labels, which asks the visitor to already know which capability they need.
   The rewrite below asks for a problem instead. The old strings are still in
   consultingOffers.ts, where the offer cards use them.
   ------------------------------------------------------------------------ */

const AI: ConsultingPath = {
  id: "ai",
  index: "01",
  kicker: "AI Systems",
  name: "Fractional AI Partner",
  // Second person, no jargon: it has to land on someone who does not know what
  // "fractional" means and has not yet decided what kind of AI help they want.
  summary:
    "I work alongside you to figure out where AI can actually help your business.",
  /* No badge strip on this side. The two named sprints are still the shape of
     the work — they live in `detail.engagements` below — but leading with them
     asked the visitor to choose a product before describing a problem, which is
     the step this card now removes. */
  badges: [],
  /* The credits line, set as an invitation rather than a menu. Three entries,
     because the tracklist layout runs them together middot-separated and three
     is what stays legible when it wraps on a phone. */
  capabilities: ["Bring a problem", "Explore an idea", "Build a solution"],
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
          "Turn a defined problem into a working product slice that proves the interaction, workflow, and system shape — the smallest credible build that runs the actual user and operator loop.",
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
  primary: { label: "Discuss a project", href: CONNECT_HREF },
  secondary: { label: "View Selected AI Work", href: AI_WORK_HREF },
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
  /* First person, and a problem rather than a discipline. The old descriptor
     ("operational strategy, supplier systems, product visibility") named the
     field and left the visitor to work out whether their problem was inside
     it; this names the problems and says where. It is the one string on this
     side that is not carried from an existing source — it adds no scope, it
     restates supply.descriptor in the voice the rest of the site uses. The
     original is untouched in consultingOffers.ts → supply.descriptor. */
  summary:
    "I help companies navigate procurement, sourcing, and supplier challenges across global supply chains, especially across Asia.",
  /* No badge strip on this side. "Global Supplier Ops" and "Data Governance"
     are operator record, not products a visitor can pick up, so printing them
     as offers framed a résumé as a menu. They keep their real job in
     `detail.engagements` below. */
  badges: [],
  /* No credits line either. The summary now carries procurement, sourcing and
     suppliers in a sentence, so a mono strip under it asked the same three
     terms to be read twice — and the two lines it cost are most of what makes
     this card scannable on a phone. The full list is unchanged in
     consultingOffers.ts → supply.bullets. */
  capabilities: [],
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
  primary: { label: "Discuss a project", href: CONNECT_HREF },
  secondary: { label: "View Supply Chain Experience", href: SUPPLY_CHAIN_HREF },
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
