// Offer copy for the lab — including the rewritten Consulting page.
//
// WHY THIS FILE EXISTS, AND NOT AN EDIT TO workTogether.ts:
//
// `src/data/workTogether.ts` is the production source. The live homepage's
// Consulting card renders its `destination` today, so rewriting it there would
// change what ships the moment it is saved. This file holds the new copy for
// the lab only, so layouts can be worked on against the real words while
// production stays exactly as it is. Promoting it is a separate, deliberate
// move (see PROMOTING below).
//
// It also introduces a slightly richer shape than `Destination`, because the
// new Consulting copy needs three things the old one had no room for:
//
//   1. Each capability block carries its OWN call to action
//      ("Explore Emerging Tech Builds ›"), rather than the page having one ask
//      at the very bottom.
//   2. "Why me" is a PARAGRAPH of credentials, not a strip of chips. The old
//      `signals: string[]` could not hold it without shredding the sentence.
//   3. "Start" offers TWO PEER actions rather than a primary and a fallback —
//      an AI project and a supply-chain project are equal front doors, not a
//      first choice and a second-best.
//
// WorldPulse and Experience still use the production `Destination` shape and
// are adapted into this one, so a single renderer serves all three.
//
// PROMOTING: when this copy is approved, move the Consulting block into
// `workTogether.ts` and delete the override here. `Destination` will need the
// three additions above; the adapter below shows exactly what they are.

import { CALENDLY_URL, CONNECT_LINKS } from "@/data/connect";
import { PATHS, type Destination, type DestinationAction, type PathId } from "@/data/workTogether";

const EMAIL_HREF =
  CONNECT_LINKS.find((l) => l.id === "email")?.href ?? "mailto:haydenjbaxter@gmail.com";

/* ---------------------------------------------------------------------------
   Shape
   ------------------------------------------------------------------------ */

export interface OfferBlock {
  label: string;
  descriptor: string;
  /** The old bullet list. Absent on the rewritten Consulting copy. */
  items?: string[];
  /** "Explore ..." — proof for the reader who wants evidence before booking. */
  action?: DestinationAction;
  /**
   * "Discuss a ... Project" — the track's own conversion, sitting inside the
   * track rather than only in a shared footer. A reader who identifies with one
   * of the two should never have to scroll past the other to act.
   */
  ask?: DestinationAction;
}

export interface OfferCopy {
  eyebrow: string;
  title: string;
  lede: string;
  blocks: [OfferBlock, OfferBlock];
  /** Credentials as prose. Replaces the chip strip where it exists. */
  why?: { label: string; text: string };
  /** The old mono credential strip, kept for the offers that still use it. */
  signals?: string[];
  /** A method statement, when the offer has one worth promoting. */
  method?: string;
  ask: {
    label: string;
    note: string;
    actions: DestinationAction[];
    /**
     * True when the actions are equal front doors rather than a primary and a
     * fallback. Consulting's two are peers — an AI project and a supply-chain
     * project; demoting either tells half the audience they are the
     * afterthought. Experience's "Request the resume" and "LinkedIn" are not
     * peers, and styling them as such would flatten a real hierarchy.
     *
     * Explicit rather than inferred from `actions.length`: both cases have two.
     */
    peers: boolean;
  };
}

/* ---------------------------------------------------------------------------
   Consulting — the rewritten page

   Positioning guardrail carried over from workTogether.ts: Hayden is a founder
   who takes selective consulting work. Nothing here reads as job-seeking.
   ------------------------------------------------------------------------ */

const CONSULTING: OfferCopy = {
  eyebrow: "Consulting",
  title: "Strategy that ships.",
  lede:
    "I work alongside teams as a fractional AI partner and global supply-chain advisor, turning uncertainty into clear plans, working prototypes, and stronger systems.",
  blocks: [
    {
      label: "Fractional AI Partner",
      descriptor:
        "I help teams find the right use cases, redesign the workflows around them, build the roadmap, and prototype what comes next.",
      // A real route that already ships.
      action: { label: "Explore Emerging Tech Builds", href: "/emerging-tech-builds" },
      ask: { label: "Discuss an AI Project", href: CALENDLY_URL, external: true },
    },
    {
      label: "Global Supply Chain & Supplier Relations",
      descriptor:
        "I help strengthen sourcing, supplier systems, traceability, and coordination across supplier networks in the U.S. and Asia.",
      // The supply-chain work is a chapter of the Work section rather than a
      // route of its own — same anchor consultingHeroTransition.ts already uses.
      action: { label: "Explore Supply Chain Work", href: "/#supply-chain" },
      ask: {
        label: "Discuss a Supply Chain Project",
        href: CALENDLY_URL,
        external: true,
      },
    },
  ],
  why: {
    label: "Why me",
    text:
      "M.S. in Artificial Intelligence in Business. Undergraduate degrees in Chinese and Global Business. Fluent in Mandarin. Eight-plus years in global sourcing and supplier operations, including Nike and Disney.",
  },
  ask: {
    label: "Start",
    note: "Bring me the problem. We'll find the most useful next move.",
    actions: [
      { label: "Discuss an AI Project", href: CALENDLY_URL, external: true },
      { label: "Discuss a Supply Chain Project", href: CALENDLY_URL, external: true },
    ],
    peers: true,
  },
};

/* ---------------------------------------------------------------------------
   Adapter — the two offers still on the production shape
   ------------------------------------------------------------------------ */

function fromDestination(d: Destination): OfferCopy {
  const actions = [d.primary, ...(d.secondary ? [d.secondary] : [])];
  return {
    eyebrow: d.eyebrow,
    title: d.title,
    lede: d.lede,
    blocks: [
      { label: d.blocks[0].label, descriptor: d.blocks[0].descriptor, items: d.blocks[0].items },
      { label: d.blocks[1].label, descriptor: d.blocks[1].descriptor, items: d.blocks[1].items },
    ],
    signals: d.signals,
    method: d.note,
    ask: { label: "Start", note: d.note, actions, peers: false },
  };
}

const OVERRIDES: Partial<Record<PathId, OfferCopy>> = {
  consulting: CONSULTING,
};

export function getOfferCopy(id: PathId): OfferCopy {
  const override = OVERRIDES[id];
  if (override) return override;
  const path = PATHS.find((p) => p.id === id) ?? PATHS[0];
  return fromDestination(path.destination);
}

/** True when this offer's copy is the lab rewrite rather than production. */
export function isRewritten(id: PathId): boolean {
  return Boolean(OVERRIDES[id]);
}
