// CTA decision lab — copy and destinations.
//
// One person, three ways to engage, understood immediately. The organising
// idea borrowed from Adham Dannaway is only the CLARITY OF SELF-SELECTION:
// a visitor should recognise which of these they are within a few seconds and
// have exactly one obvious next action. Nothing of his composition, branding
// or code is reproduced here.
//
// All copy lives in this file rather than in the component, per AGENTS.md.
//
// DESTINATIONS: every href below is either a route that exists in this repo or
// a link already used in production (`src/data/connect.ts`). Nothing is
// invented. The two that are not yet real are marked PLACEHOLDER and kept here
// on purpose so they can be replaced in one place.

import { CALENDLY_URL, CONNECT_LINKS } from "@/data/connect";
import { RESUME_HREF } from "@/data/workTogether";

const EMAIL_HREF =
  CONNECT_LINKS.find((l) => l.id === "email")?.href ?? "mailto:haydenjbaxter@gmail.com";

const LINKEDIN_HREF =
  CONNECT_LINKS.find((l) => l.id === "linkedin")?.href ??
  "https://www.linkedin.com/in/haydenjbaxter/";

const WORLDPULSE_HREF =
  CONNECT_LINKS.find((l) => l.id === "worldpulse")?.href ?? "https://worldxpulse.com";

/**
 * PLACEHOLDER — there is no resume committed anywhere in this repo
 * (`RESUME_HREF` in workTogether.ts is null, and `git ls-files` finds no PDF).
 * Linking "View Résumé" to a file that does not exist would ship a dead link,
 * so it asks for the document instead, exactly as the production Experience
 * screen already does. Commit the file under `public/` and set `RESUME_HREF`
 * there; this switches to a direct link on its own.
 */
const RESUME_ACTION = RESUME_HREF
  ? { label: "View Résumé", href: RESUME_HREF }
  : {
      label: "Request the Résumé",
      href: `${EMAIL_HREF}?subject=${encodeURIComponent("Resume request")}`,
    };

/**
 * PLACEHOLDER — the supply-chain work is a chapter of the Work section on the
 * homepage rather than a route of its own. This is the same anchor
 * `consultingHeroTransition.ts` already targets. If it ever becomes a page,
 * change it here.
 */
const SUPPLY_CHAIN_HREF = "/#supply-chain";

export interface DecisionAction {
  label: string;
  href: string;
  external?: boolean;
}

/** A capability inside a path. Consulting is the only path with two. */
export interface DecisionBlock {
  label: string;
  body: string;
  primary: DecisionAction;
  proof: DecisionAction;
}

export interface DecisionPath {
  id: PathKey;
  /** Track number on the disc. These really are tracks, so they are numbered. */
  index: string;
  /** The selector label. Mono, uppercase, on a DYMO plate. */
  label: string;
  /** One line under the selector, so the choice is legible before it is made. */
  hint: string;
  /** Handwritten label written across the disc when this path is selected. */
  discLabel: string;
  /** Resting angle of the disc for this path. Small on purpose. */
  discAngle: number;
  title: string;
  lede: string;
  /** Consulting has two; the others have none and use `actions` instead. */
  blocks?: DecisionBlock[];
  /** Used when a path has no blocks. */
  actions?: DecisionAction[];
  /** One restrained line of proof. Never a list of logos. */
  credibility?: string;
}

export type PathKey = "consulting" | "worldpulse" | "experience";

/* ---------------------------------------------------------------------------
   Shared positioning
   ------------------------------------------------------------------------ */

export const IDENTITY = {
  name: "Hayden Baxter",
  statement: "Different disciplines. One operating system.",
  supporting:
    "I build at the intersection of artificial intelligence, global supply chains, product design, and cross-cultural business.",
  /** Labels the tracklist. Mono, like a sleeve. */
  tracksLabel: "Three ways in",
};

/* ---------------------------------------------------------------------------
   The three paths
   ------------------------------------------------------------------------ */

export const PATHS: DecisionPath[] = [
  {
    id: "consulting",
    index: "01",
    label: "Consulting",
    hint: "Fractional AI partner and supply-chain advisor.",
    discLabel: "Strategy that ships",
    discAngle: 0,
    title: "Strategy that ships.",
    lede:
      "I work alongside teams as a fractional AI partner and global supply-chain advisor, turning uncertainty into clear plans, working prototypes, and stronger systems.",
    blocks: [
      {
        label: "Fractional AI Partner",
        body:
          "Find the right use cases, redesign the workflows around them, build the roadmap, and prototype what comes next.",
        primary: { label: "Discuss an AI Project", href: CALENDLY_URL, external: true },
        proof: { label: "Explore Emerging Tech Builds", href: "/emerging-tech-builds" },
      },
      {
        label: "Global Supply Chain Advisor",
        body:
          "Strengthen sourcing, supplier systems, traceability, and coordination across supplier networks in the U.S. and Asia.",
        primary: {
          label: "Discuss a Supply Chain Project",
          href: CALENDLY_URL,
          external: true,
        },
        proof: { label: "Explore Supply Chain Work", href: SUPPLY_CHAIN_HREF },
      },
    ],
    credibility:
      "M.S. Artificial Intelligence in Business · Nike + Disney · Mandarin · Chinese + Global Business",
  },
  {
    id: "worldpulse",
    index: "02",
    label: "WorldPulse",
    hint: "The venture I am building.",
    discLabel: "Make origin visible",
    discAngle: -7,
    title: "Make origin visible.",
    lede:
      "I am building WorldPulse to turn product traceability data into clear, useful product stories. It connects compliance, supply-chain visibility, and customer experience.",
    actions: [
      { label: "Explore WorldPulse", href: WORLDPULSE_HREF, external: true },
      { label: "Discuss a Pilot or Partnership", href: CALENDLY_URL, external: true },
    ],
  },
  {
    id: "experience",
    index: "03",
    label: "Experience",
    hint: "The record behind the work.",
    discLabel: "An operator who builds",
    discAngle: 7,
    title: "An operator who learned to build.",
    lede:
      "Eight-plus years across global sourcing and supplier operations, including Nike and Disney, combined with an M.S. in Artificial Intelligence in Business, fluent Mandarin, and undergraduate degrees in Chinese and Global Business.",
    actions: [
      { label: "View My Experience", href: LINKEDIN_HREF, external: true },
      RESUME_ACTION,
    ],
  },
];

export const DEFAULT_PATH: PathKey = "consulting";

export function getPath(id: PathKey): DecisionPath {
  return PATHS.find((p) => p.id === id) ?? PATHS[0];
}

/** The CD already committed to `public/`. There is no `cd.png` in this repo. */
export const DISC_SRC = "/cd-disc-final.png";

export const DISC_ALT =
  "A compact disc, the recurring object of the site, standing in for one body of work.";
