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
  | { source: typeof NAV_LAB_CHANNEL; action: "hub"; value: boolean }
  | { source: typeof NAV_LAB_CHANNEL; action: "mode"; value: LabMode }
  | { source: typeof NAV_LAB_CHANNEL; action: "ctaLabel"; value: string }
  | { source: typeof NAV_LAB_CHANNEL; action: "ctaGlyph"; value: string }
  | { source: typeof NAV_LAB_CHANNEL; action: "condense"; value: CondenseMode }
  | { source: typeof NAV_LAB_CHANNEL; action: "pace"; value: FoldPace };

/* ── Refine: iterating on the navbar that shipped ────────────────────────── */

/**
 * The lab has two jobs now.
 *
 *   concepts  the original eight directions, for choosing one
 *   refine    the SHIPPED navbar, with the two things still unresolved about it
 *
 * Refine mounts the real `Navbar` component rather than the lab's copy of it.
 * That matters: what you approve here is the thing that ships, not a
 * look-alike that can drift from it between sessions.
 */
export type LabMode = "concepts" | "refine";

/**
 * What the CTA should say.
 *
 * The problem it has today: "Let's work together →" reads like a link to a
 * contact page, and the arrow promises to TAKE you somewhere. Pressing it
 * actually opens a sheet headed "Where would you like to start?" with three
 * numbered choices. Nothing in the button says a choice is coming, so the
 * press is a small surprise every time.
 *
 * Note the two axes are separate below. Half of this button's promise is
 * carried by the glyph, not the words — the warmest possible label still lies
 * if it ends in an arrow.
 */
export interface CtaLabelOption {
  id: string;
  label: string;
  /** What this wording promises the visitor. */
  promise: string;
  risk: string;
}

export const CTA_LABELS: CtaLabelOption[] = [
  {
    id: "current",
    label: "Let's work together",
    promise: "An invitation. Warm, and the phrase the Work Together section already uses.",
    risk:
      "Says nothing about what happens. Reads as a link to a contact page, so the sheet of three choices arrives unannounced — the reason this is being re-opened.",
  },
  {
    id: "short",
    label: "Work with me",
    promise: "The same invitation, two words shorter, and it already fits the narrow phone bar.",
    risk: "Shorter, but no clearer about what the press does than the current one.",
  },
  {
    id: "ways",
    label: "Ways to work together",
    promise:
      "Plural. The one candidate whose grammar guarantees more than one thing is behind it.",
    // Measured rather than guessed: 219px against the shipped 210px at 430px,
    // where the phone bar first shows the full wording. The "it's too long"
    // objection is worth 9px.
    risk:
      "Reads as a category rather than an invitation — it describes the menu instead of asking for the work. Width is not the problem it looks like: 9px wider than what ships.",
  },
  {
    id: "where",
    label: "Where to start",
    promise:
      "Word for word what the sheet then asks (\"Where would you like to start?\"). The button and the panel become one sentence.",
    risk:
      "Drops the words 'work together' from the top of the page entirely, so the nav no longer states the offer — only the route into it.",
  },
  {
    id: "quicknav",
    label: "Quick Site Nav",
    promise:
      "The plainest possible statement of mechanism: press this, get a way around. On a page that runs ~19,600px, an explicit way around is worth having.",
    risk:
      "It promises SITE NAVIGATION and currently opens three engagement paths — Consulting, WorldPulse, Experience — which scroll into the Work Together chapter and open a screen there. A visitor pressing this expects Work / About / Journal / Resume, which is what the MENU tag beside it already does. Picking this means the panel behind it should change to match the promise; see the note in WorkTogetherHub.",
  },
  {
    id: "start",
    label: "Start a project",
    promise: "The most concrete, and the strongest verb.",
    risk:
      "Names only path 01. Someone arriving about WorldPulse or the record reads this as 'not for me' — the exact narrowing the hub exists to undo.",
  },
];

/**
 * The glyph is doing as much work as the words.
 *
 * `→` is a promise of travel; it is why the current button reads as a link.
 * A disclosure marker is the honest one here, because the press opens a panel
 * in place. Kept as its own control so the wording can be judged apart from it.
 */
export interface CtaGlyphOption {
  id: string;
  glyph: string;
  label: string;
  note: string;
}

export const CTA_GLYPHS: CtaGlyphOption[] = [
  { id: "arrow", glyph: "→", label: "Arrow", note: "Promises travel. What ships today." },
  { id: "chevron", glyph: "▾", label: "Chevron", note: "Promises disclosure — what actually happens." },
  { id: "plus", glyph: "+", label: "Plus", note: "Promises expansion; quieter than a chevron." },
  { id: "ellipsis", glyph: "···", label: "Ellipsis", note: "Promises 'more', without saying how much." },
  { id: "none", glyph: "", label: "None", note: "Let the words carry it alone." },
];

/**
 * How the desktop bar goes from five objects to two.
 *
 * What ships today is `snap`, and it is abrupt in three separate ways that are
 * worth separating, because only one of them is about animation:
 *
 *   1. the four links UNMOUNT in a single frame — nothing moves, they are
 *      simply gone;
 *   2. the MENU tag appears in the same frame, so the right-hand cluster
 *      changes width at the same instant;
 *   3. there is ONE threshold at 72px and no hysteresis, so a two-pixel wheel
 *      nudge around the fold flips the whole bar back and forth.
 *
 * (3) is the one a visitor actually feels as "janky", and no amount of easing
 * fixes it — it needs two thresholds, not a smoother curve.
 */
export type CondenseMode =
  | "snap"
  | "fade"
  | "stagger"
  | "intent"
  | "hold"
  | "track"
  | "cascade"
  | "recede";

export interface CondenseOption {
  id: CondenseMode;
  label: string;
  note: string;
  risk: string;
}

export const CONDENSE_MODES: CondenseOption[] = [
  /* ── Linked: the fold is drawn from scroll position ──────────────────────
     The state modes below all share one trait — you cross a line and an
     animation then plays on its own schedule. However well eased, the motion
     is not connected to the hand that caused it. These three are: the bar is
     drawn at the position you have scrolled to, folds under your finger, and
     unfolds again the moment you back up. */
  {
    id: "track",
    label: "Track",
    note:
      "Scroll-linked. The cluster's width and opacity are a function of scroll position across 64→260px, so the fold happens under your finger and reverses if you scroll back a pixel.",
    risk:
      "Nothing settles while you are moving — the bar is mid-fold for as long as you sit inside the window, which is livelier chrome than a two-state bar.",
  },
  {
    id: "cascade",
    label: "Cascade",
    note:
      "Track, but each label has its own slice of the fold: RESUME leaves first and WORK last, retreating toward the MENU tag that replaces it. The stagger is in POSITION, so scrubbing up brings them back in reverse.",
    risk:
      "Four things moving at four different rates is the most going on of any option; at speed it can read as busy rather than considered.",
  },
  {
    id: "recede",
    label: "Recede",
    note:
      "Cascade, plus the bar itself quietens with depth — padding tightens ~30% and the wordmark steps back, so the chrome is physically smaller inside the Work section than it was over the hero.",
    risk:
      "The bar's HEIGHT now changes with scroll. Nothing below it is pushed (it is fixed), but it is the most movement of the set and the one most likely to catch the eye when you did not want it to.",
  },
  {
    id: "snap",
    label: "Snap",
    note: "What ships today: unmount at 72px, no animation, one threshold.",
    risk: "Flickers when you settle near the fold, and four objects vanish between frames.",
  },
  {
    id: "fade",
    label: "Fade",
    note:
      "The cluster loses opacity and width together over 260ms, then goes inert. Collapses at 160px, re-opens at 60px — the gap is what stops the flicker.",
    risk: "Still a width change under the CTA, so the right cluster shifts once per fold.",
  },
  {
    id: "stagger",
    label: "Stagger",
    note:
      "Same as Fade, but the four leave right-to-left 45ms apart, so the row reads as folding rather than dissolving.",
    risk: "The most motion of the set; the last tag leaves ~180ms after the first.",
  },
  {
    id: "intent",
    label: "Intent",
    note:
      "Reads direction, not position: collapsed while descending, the full row returns the moment you scroll up. Never flickers, because position is not the trigger.",
    risk:
      "The bar changes when the visitor reverses for an unrelated reason, which can read as twitchy on a trackpad.",
  },
  {
    id: "hold",
    label: "Hold",
    note: "Never condenses. Five tags the whole way down, scrim and all.",
    risk:
      "The thing condensing was meant to solve — a lot of chrome held over ~13,600px of photography.",
  },
];

export const DEFAULT_CONDENSE: CondenseMode = "fade";

/**
 * How much scrolling the fold is spread across.
 *
 * The first linked build ran 64→260px — a 196px window, which is about two
 * notches of a mouse wheel and a single flick on a trackpad. Coupling the fold
 * to the scroll made it feel like yours; it did not make it feel unhurried,
 * because there was barely any scroll to couple it to.
 *
 * Expressed as a fraction of VIEWPORT HEIGHT rather than in pixels, so the fold
 * relates to the composition it is happening over. At `long` the bar finishes
 * folding just as the entry finishes leaving, on any display, instead of at a
 * pixel count that means something different on a laptop and a 4K panel.
 *
 * `ms` carries the same intent to the four state modes, whose fixed ~300ms was
 * the other half of "everything feels quick" — so the control means one thing
 * across all eight.
 */
export type FoldPace = "brisk" | "measured" | "long" | "drift";

export interface FoldPaceOption {
  id: FoldPace;
  label: string;
  /** Fold window as a fraction of viewport height (linked modes). */
  vh: number;
  /** Transition duration in ms (state modes). */
  ms: number;
  note: string;
}

export const FOLD_PACES: FoldPaceOption[] = [
  {
    id: "brisk",
    label: "Brisk",
    vh: 0.25,
    ms: 300,
    note: "≈200px of scroll — roughly two wheel notches. What the first build did, kept for reference.",
  },
  {
    id: "measured",
    label: "Measured",
    vh: 0.6,
    ms: 500,
    note: "Just over half a screen. The fold is legible as a movement rather than a cut.",
  },
  {
    id: "long",
    label: "Long",
    vh: 1,
    ms: 750,
    note: "A full screen of scroll. The bar finishes folding as the entry finishes leaving — the two events line up on any display.",
  },
  {
    id: "drift",
    label: "Drift",
    vh: 1.6,
    ms: 1100,
    note: "Well past the entry. The fold is barely perceptible as it happens; you notice only that the bar is smaller now.",
  },
];

export const DEFAULT_PACE: FoldPace = "long";
