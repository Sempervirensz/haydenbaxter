// The homepage entry choice — the copy and destination shared by the production
// soft-lock gate and the lab that produced it.
//
// A quiet decision point under the deck, in the cadence a children's book uses
// at the foot of a page: keep going, or take the other path. Three lines of
// type, no panel and no controls — the cards above stay the dominant object.
//
// Only the last line is a link. The first is an instruction about the cards
// themselves, which are directly above and already interactive.
//
// Lives here rather than in the lab's own data file so the shipped gate and
// /entry-cta-lab cannot drift apart in wording or destination.

export const ENTRY_CHOICE = {
  /**
   * Shown while the cards are still spreading, in place of `story`. The entry
   * asks for one gesture at a time: scroll until they settle, then flip. Both
   * lines occupy the same slot and the block is height-locked, so the swap
   * cannot shift the deck sitting directly above it.
   */
  dealing: "Scroll to deal the cards.",
  story: "Flip the four cards to continue in Story Mode.",
  /** Lowercase italic, set apart — the pause between the two routes. */
  divider: "or",
  direct: {
    text: "Skip ahead and see where I can add value",
    /**
     * Consulting is chapter 04 inside the Work section and has no id of its own,
     * so `#work` is the honest fallback for a middle-click / open-in-new-tab and
     * for the case where the chapter never mounts. The click handler resolves the
     * real chapter — see resolveConsultingChapter in SoftLockGate.
     */
    href: "#work",
  },
} as const;

/** How many cards the deck holds — the flip indicator renders one mark each. */
export const DECK_SIZE = 4;

/**
 * How the Consulting chapter is found in the live DOM, in priority order.
 *
 * Desktop (>=1024px, WorkSectionCinematic) tags every chapter with
 * `data-cstack-id`; Consulting is 4. Mobile (WorkSectionMobile) renders the
 * same four `.work__chapter--detail` tracks but carries no tags, so Consulting
 * is the fourth one. Both selectors resolve only once the Work section has
 * mounted its real content, which is what makes them usable as a readiness
 * signal — `WorkSectionResponsive` renders a bare `<section id="work">` until it
 * has measured the viewport and its dynamic import has landed.
 */
export const CONSULTING_TARGET = {
  tagged: '[data-cstack-id="4"]',
  detailTracks: "#work .work__chapter--detail",
  detailIndex: 3,
  fallback: "#work",
  /** Give the async Work mount this long before settling for the fallback. */
  mountTimeoutMs: 2000,
} as const;

/**
 * The Consulting chapter, or null while the Work section is still a placeholder.
 * Returning null rather than the `#work` shell is the point: it doubles as the
 * "Work has actually mounted" signal the click handler waits on.
 */
export function resolveConsultingChapter(): Element | null {
  const tagged = document.querySelector(CONSULTING_TARGET.tagged);
  if (tagged) return tagged;

  const tracks = document.querySelectorAll(CONSULTING_TARGET.detailTracks);
  return tracks.length > CONSULTING_TARGET.detailIndex
    ? tracks[CONSULTING_TARGET.detailIndex]
    : null;
}
