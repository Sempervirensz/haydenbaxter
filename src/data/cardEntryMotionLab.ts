// Copy and tuning constants for /lab/card-entry-motion.
//
// The lab compares four ways of SOURCING the deck's unveil progress. It does not
// re-implement the motion: the transform maths stays in PlayingCard and the
// layout stays in CardDeck, so whatever is measured here is what the homepage
// would do with the same input. Only the input changes.
//
// Kept out of the component per the repo's copy-lives-in-data rule, and so the
// timings can be read and argued about without reading React.

export type MotionOptionId = "control" | "scroll" | "self" | "hybrid";

export interface MotionOption {
  id: MotionOptionId;
  label: string;
  /** One line, shown under the switcher — what this option asks of the visitor. */
  blurb: string;
  /** True when the option draws its progress (wholly or partly) from scroll. */
  usesScroll: boolean;
  /** True when the option starts moving on its own. */
  usesAuto: boolean;
}

export const MOTION_OPTIONS: readonly MotionOption[] = [
  {
    id: "control",
    label: "01 · Current production",
    blurb:
      "Baseline. Progress comes from useScrollProgress, exactly as main does today — including the short-circuit that pins it to 1 when there is no scroll room.",
    usesScroll: false,
    usesAuto: false,
  },
  {
    id: "scroll",
    label: "02 · Scroll-dealt",
    blurb:
      "The composition is pinned and real scroll runway sits behind it. Scrolling spreads and settles the cards; the instruction turns to flipping once they land.",
    usesScroll: true,
    usesAuto: false,
  },
  {
    id: "self",
    label: "03 · Self-dealt",
    blurb:
      "The cards deal themselves in a short staggered sequence, then hand control over. No scroll involved at any point.",
    usesScroll: false,
    usesAuto: true,
  },
  {
    id: "hybrid",
    label: "04 · Hybrid",
    blurb:
      "The cards break out of the stack on their own, then scroll carries them the rest of the way and settles them.",
    usesScroll: true,
    usesAuto: true,
  },
] as const;

/** The four instruction states the lab makes explicit. */
export type MotionPhase = "scroll" | "settling" | "flip" | "released";

export const PHASE_COPY: Record<MotionPhase, string> = {
  scroll: "Scroll to deal the cards",
  settling: "Cards settling",
  flip: "Flip all four cards",
  released: "Gate released",
};

/* ---- Timing. Milliseconds unless named otherwise. --------------------------
   DEAL_MS is one card's travel; the sequence runs DEAL_MS + 3 × STAGGER_MS.
   Deliberately under the cost of the four flips it precedes (4 × 600ms), so the
   entrance cannot outweigh the interaction it is setting up. */
export const DEAL_MS = 820;
export const STAGGER_MS = 90;

/** Hybrid: how far the automatic phase carries the cards before scroll takes over. */
export const HYBRID_AUTO_CEILING = 0.55;
export const HYBRID_AUTO_MS = 520;

/** How long the cards read as "settling" after the motion completes. */
export const SETTLE_MS = 420;

/** Scroll runway, in px, as a share of viewport height — clamped so a short
 *  laptop still gets a usable throw and a tall display doesn't get a marathon. */
export const RUNWAY_VH_SHARE = 0.85;
export const RUNWAY_MIN = 380;
export const RUNWAY_MAX = 760;
