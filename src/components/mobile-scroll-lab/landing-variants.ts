/* Mobile scroll lab — what the Work landing screen offers people.
 *
 * THE OBSERVED PROBLEM
 * Visitors reach the CD screen and tap the chapter titles, expecting to be
 * taken somewhere. Nothing happens.
 *
 * They are not misreading a subtle cue. On a phone the list is deliberately
 * styled as a readable contents list — full opacity, gold numerals, 22–28px
 * serif — while every signal that the screen advances by SCROLLING is absent:
 *
 *   • no row is highlighted (the phone gate sets activeLabel to "")
 *   • the disc does not turn (the same gate never starts the loop)
 *   • the scroll cue is not rendered at all
 *
 * That last one is a port regression, not a decision. `WORK_LANDING.scrollHint`
 * still says "Scroll to explore", globals.css still carries eight `.scroll-hint`
 * rules, and legacy/design-inspo still renders the element. Nothing in src/**
 * does. Copy and styling survived the port; the element did not.
 *
 * So the tap is a correct inference from a screen with a menu, no motion, no
 * highlight and no instruction. These are the candidate answers, as toggles
 * rather than presets, so the cheap fix can be tested apart from the big one.
 */

export type LandingVariant = "shipped" | "funnel" | "first";

export interface LandingOptions {
  variant: LandingVariant;
  /** Give chapter 01 the weight of a next step rather than a list row. */
  start: boolean;
  /** The CD becomes what it looks like: press play, and the story begins.
   *
   *  Two placements, because the artwork supports both and they read
   *  differently. `hub` puts a play glyph in the spindle — big, central,
   *  unmistakably "play the disc". `shell` lights up the PLAY button already
   *  printed on the transport, upper right: smaller and off-centre, but it
   *  makes a control that is ALREADY DRAWN ON THE OBJECT real, rather than
   *  adding a second one next to it. */
  play: "off" | "hub" | "shell";
  /** Retired: the cue now ships. Kept in the type only so a saved URL with
   *  `?cue=1` on it does not fail to parse. */
  cue?: boolean;
}

export const LANDING_DEFAULTS: LandingOptions = {
  variant: "shipped",
  start: false,
  play: "off",
  cue: false,
};

/* Switch, not a lookup table — a top-level Map here is an initializer webpack
   has to keep, and that is exactly how the disc technique table got itself
   bundled into production. See disc-technique-catalog.ts. */
export function isPlayStyle(v: string): v is LandingOptions["play"] {
  return v === "off" || v === "hub" || v === "shell";
}

export function isLandingVariant(v: string): v is LandingVariant {
  switch (v) {
    case "shipped":
    case "funnel":
    case "first":
      return true;
    default:
      return false;
  }
}

/** Which chapter (1-based) a tap on row `index` should scroll to, or null if
 *  that row should not be a control at all in this variant.
 *
 *  `shipped` returns the row's own chapter because that is now what the site
 *  does — WorkChapterList renders real buttons and this arm leaves them alone.
 *  The other two exist to argue with it. */
export function targetChapter(
  variant: LandingVariant,
  index: number
): number | null {
  switch (variant) {
    case "funnel":
      // Every row lands on 01. The row still reads as itself, which is the
      // known cost of this arm: a tap on "Consulting" arriving at WorldPulse
      // is a control that lies, rather than one that is merely dead.
      return 1;
    case "first":
      return index === 0 ? 1 : null;
    default:
      return index + 1;
  }
}
