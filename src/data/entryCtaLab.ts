// Lab-only configuration for /entry-cta-lab: the design iterations under review.
//
// The copy, the deck size and the Consulting destination are SHARED with the
// shipped gate and live in src/data/entryChoice.ts — re-exported here so the lab
// and production cannot drift apart.

export {
  ENTRY_CHOICE as ROUTE_CHOICE,
  DECK_SIZE,
  CONSULTING_TARGET,
  resolveConsultingChapter,
} from "./entryChoice";

// Copy + configuration for the entry route choice (/entry-cta-lab).
//
// A quiet decision point under the deck, in the cadence a children's book uses
// at the foot of a page: keep going, or take the other path. Three lines of
// type, no panel and no controls — the cards above stay the dominant object.
//
// Only the last line is a link. The first is an instruction about the cards
// themselves, which are directly above and already interactive.

/**
 * Iterations of the same three lines.
 *
 * Identical DOM and identical behaviour in every one — only presentation moves,
 * driven by a class on the block. That is deliberate: what's being compared is
 * emphasis and hierarchy, so an iteration can't win by also changing what the
 * thing does or says.
 */
export type RouteVariant = "quiet" | "even" | "storyLed" | "drawn" | "warm";

export interface RouteVariantDef {
  id: RouteVariant;
  index: string;
  label: string;
  note: string;
}

export const ROUTE_VARIANTS: RouteVariantDef[] = [
  {
    id: "quiet",
    index: "01",
    label: "Quiet",
    note: "The baseline. Instruction held back, the link brighter and underlined.",
  },
  {
    id: "even",
    index: "02",
    label: "Even",
    note: "Both lines at one brightness — only the underline and arrow mark the link.",
  },
  {
    id: "storyLed",
    index: "03",
    label: "Story-led",
    note: "Story Mode leads: larger and brighter, with the skip line receding beneath it.",
  },
  {
    id: "drawn",
    index: "04",
    label: "Drawn",
    note: "No rule at rest — the underline draws in from the left on hover and focus.",
  },
  {
    id: "warm",
    index: "05",
    label: "Warm",
    note: "Colour rather than brightness marks the link: cream at rest, both lines equal weight.",
  },
];

/* Opens on the iteration that carries the flip bar. The lab previously opened
   on 01 Quiet, where the bar is hidden by design — which made the feature look
   as though it had never been built. */
export const DEFAULT_VARIANT: RouteVariant = "storyLed";

/** Query param and postMessage channel the responsive viewer drives. */
export const VARIANT_PARAM = "v";
export const VARIANT_CHANNEL = "ecta-ctl";

export function isRouteVariant(v: unknown): v is RouteVariant {
  return ROUTE_VARIANTS.some((r) => r.id === v);
}

/* ---------------------------------------------------------------------------
   Flip indicator
   -------------------------------------------------------------------------*/

/**
 * Three designs for the four markers that sit between the deck and the route
 * choice. One marker per card, in deck order.
 *
 * All three render the same DOM and reserve the same box, so switching cannot
 * shift the deck above or the type below — the comparison is about the mark,
 * not about layout.
 */
export type IndicatorDesign = "miniCards" | "dots" | "squares";

export interface IndicatorDesignDef {
  id: IndicatorDesign;
  index: string;
  label: string;
  note: string;
}

export const INDICATOR_DESIGNS: IndicatorDesignDef[] = [
  {
    id: "miniCards",
    index: "01",
    label: "Mini cards",
    note: "Four small card outlines that turn face-up — rank and suit appear as each fills.",
  },
  {
    id: "dots",
    index: "02",
    label: "Four dots",
    note: "Four empty circles that fill solid, hollow to filled rather than dim to bright.",
  },
  {
    id: "squares",
    index: "03",
    label: "Four squares",
    note: "Four square outlines that fill from the inside, keeping their edge.",
  },
];

export const DEFAULT_INDICATOR: IndicatorDesign = "miniCards";

/** Query param and postMessage action the responsive viewer drives. */
export const INDICATOR_PARAM = "i";

export function isIndicatorDesign(v: unknown): v is IndicatorDesign {
  return INDICATOR_DESIGNS.some((d) => d.id === v);
}
