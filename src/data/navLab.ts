// Navbar design lab — concept catalogue and lab-only routing.
//
// The lab exists to choose a DIRECTION for the top navigation before anything
// is promoted to production. Nothing here is imported by the live site; the
// only traffic runs the other way (this file reads `workTogether.ts` so the CTA
// hub can't invent labels the site doesn't already use).
//
// THREE THINGS ARE FIXED ACROSS EVERY CONCEPT, so the comparison is visual:
//   1. the wording          — WORK / ABOUT / JOURNAL / RESUME / LET'S WORK TOGETHER →
//   2. the routing concept  — the CTA opens a hub, it never lands on Consulting
//   3. sticky               — every concept follows the visitor down the page
//
// (3) is the whole reason the lab was commissioned. The production navbar is
// `position: absolute` inside the hero (see `Navbar.tsx`), so it scrolls away
// permanently roughly one viewport in — and the Work section that follows runs
// ~1720vh. A recruiter who is convinced at chapter three has no way to act on
// it without scrolling to the end or back to the top.

import { PATHS, CTA_LABEL, RESUME_HREF } from "@/data/workTogether";

/* ── Where a press lands ─────────────────────────────────────────────────── */

/**
 * How a destination is found in the live DOM.
 *
 * Work chapters need two forms because the Work section renders two DOMs: at
 * >=1024px the cinematic stack tags every chapter `data-cstack-id`, and below
 * that the mobile stack renders `.work__chapter--detail` tracks with no ids. A
 * lab that only knew the tagged form would silently scroll nowhere on every
 * phone preset — which is the half of this lab the brief calls important. Same
 * priority order as production's `CONSULTING_TARGET` in `entryChoice.ts`.
 */
export interface LabAnchor {
  /** A plain selector, or "top". Used alone when it isn't a Work chapter. */
  selector?: string;
  /** Desktop: the tagged chapter, e.g. `[data-cstack-id="4"]`. */
  tagged?: string;
  /** Mobile: index into `#work .work__chapter--detail`. */
  detailIndex?: number;
}

/** Last resort, when the Work section hasn't mounted its chapters. */
export const WORK_FALLBACK = "#work";
export const WORK_DETAIL_TRACKS = "#work .work__chapter--detail";

/* ── Navigation (identical in every concept) ─────────────────────────────── */

export interface NavItem {
  label: string;
  /** Where it goes today, as far as the lab is allowed to assert. */
  href: string;
  /** Selector the stage scrolls to, when the destination is on this page. */
  anchor?: LabAnchor;
  external?: boolean;
  /** Shown on the destination receipt when the route isn't finalized. */
  provisional?: boolean;
}

/**
 * Journal is the one destination the brief pins to an absolute URL. Production
 * still renders `/blog` (see `siteContent.ts`), so the lab shows the subdomain
 * the brief specifies and the receipt names both — this is a real discrepancy
 * to settle before promotion, not something to paper over.
 */
export const JOURNAL_HREF = "https://journal.haydenbaxter.com";

export const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "#work", anchor: { selector: "#work" } },
  { label: "About", href: "#about", anchor: { selector: "#about" } },
  { label: "Journal", href: JOURNAL_HREF, external: true },
  // No permanent Resume URL is invented here: this is the PDF the Work
  // Together path 03 already links, flagged provisional on the receipt.
  { label: "Resume", href: RESUME_HREF, provisional: true },
];

/** The CTA label, straight from production so the two can't drift. */
export const CTA = {
  label: CTA_LABEL, // "Let's work together"
  glyph: "→",
  /** Closed mobile header at narrow widths — the CTA still has to be visible. */
  short: "Work with me",
} as const;

/* ── The hub the CTA opens ───────────────────────────────────────────────── */

/**
 * "I've seen enough. Show me the relevant way we could work together."
 *
 * The three options are NOT new: `workTogether.ts` already ships them as paths
 * 01–03 with these exact labels, inside the final Work chapter. The proposal
 * under test is only that the nav CTA can reach them from anywhere on the page
 * instead of only at the end of the scroll.
 */
export interface HubOption {
  id: string;
  index: string;
  label: string;
  lede: string;
  /** Where it lands on the framed homepage, when the destination is there. */
  anchor?: LabAnchor;
  /** What the receipt says the real destination is. */
  destination: string;
  provisional?: boolean;
}

export const HUB_OPTIONS: HubOption[] = PATHS.map((path) => {
  const shared = { id: path.id, index: path.index, label: path.label, lede: path.lede };
  switch (path.id) {
    case "consulting":
      // The Consulting chapter, found the way production finds it — the same
      // tagged/detail-index pair `CONSULTING_TARGET` uses.
      return {
        ...shared,
        anchor: { tagged: '[data-cstack-id="4"]', detailIndex: 3 },
        destination: "Consulting chapter",
      };
    case "worldpulse":
      return {
        ...shared,
        anchor: { tagged: '[data-cstack-id="1"]', detailIndex: 0 },
        destination: "WorldPulse chapter",
      };
    default:
      // Path 03 renders the Experience screen inside the Work Together chapter,
      // which is where this scrolls. A standalone /resume route would be an
      // invention, so the receipt says provisional instead.
      return {
        ...shared,
        anchor: { tagged: '[data-cstack-id="4"]', detailIndex: 3 },
        destination: "Experience screen · path 03",
        provisional: true,
      };
  }
});

/* ── Concepts ────────────────────────────────────────────────────────────── */

export type ConceptId =
  | "rail"
  | "plate"
  | "spine"
  | "yoke"
  | "dock"
  | "stub"
  | "dial"
  | "invert";

export interface NavConcept {
  id: ConceptId;
  index: string;
  name: string;
  /** One line: what the direction actually is. */
  tagline: string;
  strength: string;
  risk: string;
  /** Where the closed bar sits on phones. */
  mobile: "top" | "bottom";
  /** Whether the bar changes shape once the visitor is past the hero. */
  condenses: boolean;
}

export const CONCEPTS: NavConcept[] = [
  {
    id: "rail",
    index: "01",
    name: "Label Rail",
    tagline:
      "Today's flat DYMO tag row, unpinned from the hero and fixed to the top. The control.",
    strength:
      "Zero visual risk — it is the navbar the site already has, so the only variable under test is stickiness.",
    risk:
      "Five embossed tags held over every scene is a lot of chrome; over the Work stack's photography it reads as a toolbar, and the CTA has no more weight than RESUME.",
    mobile: "top",
    condenses: false,
  },
  {
    id: "plate",
    index: "02",
    name: "Embossed Plate",
    tagline:
      "The whole bar is one DYMO plate with a hard bottom edge; the links are slots pressed into it.",
    strength:
      "Most literally the label machine — one object, one shadow, and the tags stop competing with each other for depth.",
    risk:
      "A full-width opaque band permanently covers ~80px of every composition below it, including the top of the pinned Work scenes.",
    mobile: "top",
    condenses: false,
  },
  {
    id: "spine",
    index: "03",
    name: "Tape Spine",
    tagline:
      "Nav runs vertically down the left edge as a strip of tape; the CTA stays a horizontal plate, top right.",
    strength:
      "Gives the horizontal composition back its full width and makes the CTA the only object on the top edge — it cannot be confused with a link.",
    risk:
      "Rotated mono type is slower to read, and the left rail collides with anything full-bleed. Needs a real fallback below 1024px.",
    mobile: "top",
    condenses: false,
  },
  {
    id: "yoke",
    index: "04",
    name: "Split Yoke",
    tagline:
      "Wordmark left, links clustered centre, CTA right on its own plinth — the cluster collapses to one tag past the hero.",
    strength:
      "Full nav where there is room for it, and a two-object bar (identity + CTA) for the long scroll where there isn't.",
    risk:
      "The collapse hides four destinations behind a press; if a visitor never opens it, ABOUT and JOURNAL effectively don't exist below the fold.",
    mobile: "top",
    condenses: true,
  },
  {
    id: "dock",
    index: "05",
    name: "Bottom Dock",
    tagline: "A floating label tray docked to the bottom edge rather than the top.",
    strength:
      "Thumb-reachable on a phone and out of the way of every hero and pinned scene — the CTA sits where the hand already is.",
    risk:
      "Reads as an app chrome rather than a site header, competes with iOS home indicators, and the wordmark has to live somewhere else.",
    mobile: "bottom",
    condenses: false,
  },
  {
    id: "stub",
    index: "06",
    name: "Ticket Stub",
    tagline:
      "The bar is a perforated card: links are punched cells, the CTA is the tear-off stub carrying the arrow.",
    strength:
      "The perforation gives the CTA a physical reason to look different, so hierarchy comes from the object instead of from colour.",
    risk:
      "The most decorative direction — the one most likely to date, and the perforation is fussy at small sizes.",
    mobile: "top",
    condenses: false,
  },
  {
    id: "dial",
    index: "07",
    name: "Label Dial",
    tagline:
      "Past the hero it holds only the wordmark and the CTA; the four links emboss out on hover, focus or press.",
    strength:
      "Almost nothing is covering the work — the lightest possible persistent chrome that still keeps the CTA one click away.",
    risk:
      "Hidden navigation. Discovery rests on one affordance, and a hover-revealed strip needs careful keyboard and touch handling to be real.",
    mobile: "top",
    condenses: true,
  },
  {
    id: "invert",
    index: "08",
    name: "Inverted CTA",
    tagline:
      "Dark slab, hairline top-light, and the CTA as a light plate — the only bright object in the bar.",
    strength:
      "The CTA survives every background the page has, including the light ETB bars and the WorldPulse pill where white ink disappears.",
    risk:
      "A light plate is the one element that breaks dark-only discipline; it can read as a pasted-in button rather than a pressed label.",
    mobile: "top",
    condenses: false,
  },
];

export const DEFAULT_CONCEPT: ConceptId = "rail";

/* ── Backgrounds to compare against ──────────────────────────────────────── */

/**
 * Sticky chrome is only as good as its worst background. These are the four the
 * framed homepage actually produces, so a concept can be checked against the
 * one that breaks it rather than against a flattering one.
 */
export interface StageBackground {
  id: string;
  label: string;
  note: string;
  /** Where on the framed page this surface lives. */
  anchor?: LabAnchor;
}

export const BACKGROUNDS: StageBackground[] = [
  { id: "entry", label: "Entry", note: "Hero + card deck, near-black", anchor: { selector: "top" } },
  {
    id: "photo",
    label: "Photography",
    note: "WorldPulse chapter — full-bleed image",
    anchor: { tagged: '[data-cstack-id="1"]', detailIndex: 0 },
  },
  {
    id: "light",
    label: "Light surface",
    note: "Work Together — cobalt bars on light ink",
    anchor: { tagged: '[data-cstack-id="4"]', detailIndex: 3 },
  },
  { id: "prose", label: "Prose", note: "About / Journal — flat dark", anchor: { selector: "#about" } },
];

/* ── postMessage channel (lab shell → framed stage) ──────────────────────── */

export const NAV_LAB_CHANNEL = "nav-lab-ctl";

export type NavLabMessage =
  | { source: typeof NAV_LAB_CHANNEL; action: "concept"; value: ConceptId }
  | { source: typeof NAV_LAB_CHANNEL; action: "jump"; value: LabAnchor }
  | { source: typeof NAV_LAB_CHANNEL; action: "hub"; value: boolean };
