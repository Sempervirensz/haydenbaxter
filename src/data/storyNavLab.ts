// Lab-only configuration for /story-nav-lab.
//
// The question this lab exists to answer: once a reader has chosen Story Mode
// and is inside the four Work chapters, what — if anything — should tell them
// where they are and let them move faster?
//
// Readers who took "Skip ahead and see where I can add value" already have a
// direct route (see resolveConsultingChapter in src/data/entryChoice.ts). This
// is for the ones who entered the story and later want orientation.
//
// Everything here is lab configuration. The chapter names, ordinals and copy
// are re-exported from production data so a variant cannot win by quietly
// saying something the real site does not say.

import { CINEMATIC_CARDS, type CardMeta } from "@/components/work/CinematicCardBody";
import { WORK_SCREENS } from "@/data/work";

/** postMessage channel the lab shell uses to drive the framed stage.
 *  Mirrors the cstack-ctl / entry-cta-lab convention in ResponsiveViewer. */
export const STORY_NAV_CHANNEL = "story-nav-ctl";

// ---------------------------------------------------------------------------
// Sections — the real four chapters, read from production data
// ---------------------------------------------------------------------------

export interface StorySection {
  id: number;
  /** "01" — the ordinal alone. */
  num: string;
  /** "01 / 04" — the production mobile ChapterRail form. */
  ordinal: string;
  name: string;
  tagline: string;
  kind: CardMeta["kind"];
}

const TOTAL = CINEMATIC_CARDS.length;

export const STORY_SECTIONS: StorySection[] = CINEMATIC_CARDS.map((card) => {
  const screen = WORK_SCREENS.find((s) => s.id === card.id);
  return {
    id: card.id,
    num: card.num,
    // Production truth: WORK_SCREENS carries "01 / 04"; fall back to composing
    // it rather than hardcoding, so a data change cannot desync the lab.
    ordinal: screen?.number ?? `${card.num} / ${String(TOTAL).padStart(2, "0")}`,
    name: card.name,
    tagline: card.tagline,
    kind: card.kind,
  };
});

export const SECTION_TOTAL = String(TOTAL).padStart(2, "0");

// ---------------------------------------------------------------------------
// Page contexts — what the navigator is evaluated against
// ---------------------------------------------------------------------------

export type ContextId = "top" | "landing" | "ch1" | "ch2" | "ch3" | "ch4" | "after";

export interface PageContext {
  id: ContextId;
  label: string;
  note: string;
  /** Which real Work chapter to land on; null = somewhere else on the page. */
  chapter: number | null;
  /** Does reaching this place require the soft-lock gate to be open? */
  needsGate: boolean;
  /** Anchor to scroll to when there is no chapter. */
  hash?: string;
}

/** Places on the real homepage, not invented screens. */
export const PAGE_CONTEXTS: PageContext[] = [
  {
    id: "top",
    label: "Top — hero + deck",
    note: "Gate closed, the real entry. The navigator must not exist here.",
    chapter: null,
    needsGate: false,
  },
  {
    id: "landing",
    label: "Work landing — CD + contents",
    note: "The disc and the numbered list. Already names all four — the redundancy test.",
    chapter: null,
    needsGate: true,
    hash: "#work",
  },
  {
    id: "ch1",
    label: "01 WorldPulse",
    note: "The real full-bleed coastal photo. Hardest legibility case on the site.",
    chapter: 1,
    needsGate: true,
  },
  {
    id: "ch2",
    label: "02 Selected AI Work",
    note: "The real ETB gallery — the densest chapter.",
    chapter: 2,
    needsGate: true,
  },
  {
    id: "ch3",
    label: "03 Supply Chain",
    note: "The real globe + journey. Note the corner rail is hidden here on desktop.",
    chapter: 3,
    needsGate: true,
  },
  {
    id: "ch4",
    label: "04 Consulting",
    note: "The real cityscape and reveal. Where Skip-ahead lands.",
    chapter: 4,
    needsGate: true,
  },
  {
    id: "after",
    label: "After the story",
    note: "Personas / Connect. The navigator should retire once Work is behind you.",
    chapter: null,
    needsGate: true,
    hash: "#connect",
  },
];

// ---------------------------------------------------------------------------
// Navigation variants
// ---------------------------------------------------------------------------

/** The three core concepts every variant belongs to. */
export type ConceptId = "label" | "spine" | "numbers";

export const CONCEPTS: { id: ConceptId; label: string; blurb: string }[] = [
  { id: "label", label: "A · Active label", blurb: "Edge dots, only the active name shown." },
  { id: "spine", label: "B · Progress spine", blurb: "Markers on a thin vertical line." },
  { id: "numbers", label: "C · Numbers", blurb: "01–04 at the edge, active emphasized." },
];

export type VariantId =
  | "label-persistent"
  | "label-flash"
  | "spine-continuous"
  | "spine-sections"
  | "numbers-edge"
  | "label-dots"
  | "label-spine"
  | "spine-counter"
  | "spine-numbers"
  | "mobile-collapsed"
  | "mobile-minimal"
  | "desktop-hover";

export interface VariantDef {
  id: VariantId;
  index: string;
  concept: ConceptId;
  label: string;
  note: string;
  /** True for the seven hybrids the brief asks for by name. */
  hybrid?: boolean;
  /** Which viewport this treatment is really aimed at. */
  aimedAt: "desktop" | "mobile" | "both";
}

export const VARIANTS: VariantDef[] = [
  {
    id: "label-persistent",
    index: "01",
    concept: "label",
    label: "Active label — persistent",
    note: "Dots at the edge, the active section's name always visible beside it. Inactive names never render.",
    aimedAt: "both",
  },
  {
    id: "label-flash",
    index: "02",
    concept: "label",
    label: "Active label — flash",
    note: "Same dots, but the name fades in on section change and retreats after ~2s. Quieter at rest.",
    aimedAt: "both",
  },
  {
    id: "spine-continuous",
    index: "03",
    concept: "spine",
    label: "Spine — continuous",
    note: "A thin rule that fills with read progress. Markers ride on top.",
    aimedAt: "desktop",
  },
  {
    id: "spine-sections",
    index: "04",
    concept: "spine",
    label: "Spine — sections only",
    note: "No continuous fill. Completed markers are filled, upcoming are hollow.",
    aimedAt: "desktop",
  },
  {
    id: "numbers-edge",
    index: "05",
    concept: "numbers",
    label: "Numbers — edge stack",
    note: "01–04 stacked at the edge in mono. Active is bright, the rest recede.",
    aimedAt: "both",
  },
  {
    id: "label-dots",
    index: "06",
    concept: "label",
    label: "Label + dots",
    note: "Hybrid 1. Dots scale with proximity to active; the active name sits alongside.",
    hybrid: true,
    aimedAt: "both",
  },
  {
    id: "label-spine",
    index: "07",
    concept: "spine",
    label: "Label + spine",
    note: "Hybrid 2. The spine carries position, the label names it.",
    hybrid: true,
    aimedAt: "desktop",
  },
  {
    id: "spine-counter",
    index: "08",
    concept: "spine",
    label: "Spine + 01 / 04 on marker",
    note: "Hybrid 3. The ordinal rides the active marker, replacing the corner counter.",
    hybrid: true,
    aimedAt: "desktop",
  },
  {
    id: "spine-numbers",
    index: "09",
    concept: "numbers",
    label: "Spine with numbered markers",
    note: "Hybrid 4. Markers are 01–04 rather than dots — no separate counter needed.",
    hybrid: true,
    aimedAt: "both",
  },
  {
    id: "mobile-collapsed",
    index: "10",
    concept: "label",
    label: "Mobile — collapse / expand",
    note: "Hybrid 5. Dots only until tapped, then the full labelled list. Tap outside or Esc closes.",
    hybrid: true,
    aimedAt: "mobile",
  },
  {
    id: "mobile-minimal",
    index: "11",
    concept: "numbers",
    label: "Mobile — label + count",
    note: "Hybrid 6. One line: the active name and 01 / 04. No dots, no list.",
    hybrid: true,
    aimedAt: "mobile",
  },
  {
    id: "desktop-hover",
    index: "12",
    concept: "label",
    label: "Desktop — hover / focus reveal",
    note: "Hybrid 7. Dots at rest; all names on hover or keyboard focus. Active name always shown, so nothing essential needs hover.",
    hybrid: true,
    aimedAt: "desktop",
  },
];

export const DEFAULT_VARIANT: VariantId = "label-persistent";

// ---------------------------------------------------------------------------
// Counter treatments — toggled independently of the navigation concept
// ---------------------------------------------------------------------------

export type CounterId =
  | "keep"
  | "remove"
  | "in-nav"
  | "on-dot"
  | "on-label"
  | "numbered"
  | "tap-reveal"
  | "spine-end";

export interface CounterDef {
  id: CounterId;
  index: string;
  label: string;
  note: string;
}

export const COUNTERS: CounterDef[] = [
  { id: "keep", index: "1", label: "Keep as-is", note: "Production baseline: the corner rail, unchanged." },
  { id: "remove", index: "2", label: "Remove entirely", note: "No counter anywhere. Tests whether the nav alone orients." },
  { id: "in-nav", index: "3", label: "Move into the nav", note: "Corner rail drops the ordinal; the navigator carries it." },
  { id: "on-dot", index: "4", label: "Attach to active dot", note: "01 / 04 rides the active dot." },
  { id: "on-label", index: "5", label: "Attach to active label", note: "01 / 04 sits with the section name." },
  { id: "numbered", index: "6", label: "Numbered markers instead", note: "Markers are the count, so no separate counter renders." },
  { id: "tap-reveal", index: "7", label: "Reveal on tap / focus", note: "Mobile: count appears only while the navigator is open or focused." },
  { id: "spine-end", index: "8", label: "At the spine's end", note: "Count anchored to the top or bottom of the spine, not the active marker." },
];

export const DEFAULT_COUNTER: CounterId = "keep";

// ---------------------------------------------------------------------------
// Scrollbar treatments
// ---------------------------------------------------------------------------

export type ScrollbarId =
  | "default"
  | "subtle"
  | "thin"
  | "hidden"
  | "native-spine"
  | "no-internal";

export interface ScrollbarDef {
  id: ScrollbarId;
  index: string;
  label: string;
  note: string;
  /** Honest browser-support note — shown in the lab, not guessed at. */
  support: string;
}

export const SCROLLBARS: ScrollbarDef[] = [
  {
    id: "default",
    index: "1",
    label: "Current / default",
    note: "What ships today: the native page scrollbar with scrollbar-gutter: stable reserving its lane.",
    support: "Universal. scrollbar-gutter is Chrome 94+, Firefox 97+, Safari 18.2+; older Safari ignores it and the ~15px shift returns.",
  },
  {
    id: "subtle",
    index: "2",
    label: "Subtly styled",
    note: "Same width, site-matched colours — a low-alpha white thumb on a transparent track.",
    support: "scrollbar-color works in Firefox 64+, Chrome 121+, Safari 18.2+. ::-webkit-scrollbar covers older Chrome/Safari. Both are declared, so every engine gets one of them.",
  },
  {
    id: "thin",
    index: "3",
    label: "Thinner, lower contrast",
    note: "scrollbar-width: thin plus a narrower webkit thumb.",
    support: "scrollbar-width: thin — Firefox 64+, Chrome 121+, Safari 18.2+. Older WebKit falls back to the ::-webkit-scrollbar width. Note: 'thin' is engine-defined, so Firefox and Chrome do not render the same pixel width.",
  },
  {
    id: "hidden",
    index: "4",
    label: "Hidden, still scrollable",
    note: "Scrollbar painted away; wheel, trackpad, touch, keyboard and the scrollbar's own accessibility role are all untouched.",
    support: "scrollbar-width: none + ::-webkit-scrollbar { display: none }. Works everywhere, but removes a visible affordance and a drag target — a real usability cost on desktop, near-zero on touch where the bar is already an overlay.",
  },
  {
    id: "native-spine",
    index: "5",
    label: "Native kept + spine added",
    note: "Deliberately unstyled, to judge whether the two signals read as redundant.",
    support: "Universal — nothing is overridden.",
  },
  {
    id: "no-internal",
    index: "6",
    label: "Internal scroller removed",
    note: "Suppresses the legacy .work__screen--detail 4px inner bar. In the shipped cinematic/mobile path this element never renders, so this is a no-op there by design.",
    support: "N/A — this is a structural change, not a styling one.",
  },
];

export const DEFAULT_SCROLLBAR: ScrollbarId = "default";

// ---------------------------------------------------------------------------
// Viewports
// ---------------------------------------------------------------------------

export interface ViewportPreset {
  label: string;
  w: number;
  h: number;
  kind: "desktop" | "laptop" | "mobile";
}

export const VIEWPORTS: ViewportPreset[] = [
  { label: "Desktop", w: 1440, h: 900, kind: "desktop" },
  { label: "Laptop", w: 1024, h: 768, kind: "laptop" },
  { label: "Mobile", w: 390, h: 844, kind: "mobile" },
  { label: "Small mobile", w: 360, h: 800, kind: "mobile" },
];

export const DEFAULT_VIEWPORT = VIEWPORTS[0];

// ---------------------------------------------------------------------------
// Stage state pushed across the channel
// ---------------------------------------------------------------------------

export interface StageState {
  context: ContextId;
  variant: VariantId;
  counter: CounterId;
  scrollbar: ScrollbarId;
  /** Mobile collapsed/expanded, for the variants that have both states. */
  expanded: boolean;
  /** Simulate prefers-reduced-motion inside the frame. */
  reducedMotion: boolean;
  /** Lab-only: write #hash on navigate, to evaluate the trade-off. */
  useHash: boolean;
}

export const DEFAULT_STAGE: StageState = {
  // "top", not a chapter: the stage has to load in the page's real initial
  // state with the soft-lock gate closed. Defaulting to a chapter made the
  // overlay release the gate on mount, so the genuine entry was unreachable.
  context: "top",
  variant: DEFAULT_VARIANT,
  counter: DEFAULT_COUNTER,
  scrollbar: DEFAULT_SCROLLBAR,
  expanded: false,
  reducedMotion: false,
  useHash: false,
};
