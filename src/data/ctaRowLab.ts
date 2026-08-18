// Direct CTA row — lab-only configuration.
//
// The prototype at `/cta-lab` recreates the "Let's work together" section with
// one change: the three choices are on screen from the first frame as a small
// button row, instead of waiting behind a press on the headline.
//
// Every label, link, and piece of copy is re-exported from
// `src/data/workTogether.ts` — the same source the live section renders — so the
// prototype can't drift from production. Nothing here is new copy; the only new
// facts are which path is the primary action and where each button points.

import { PATHS, type DestinationAction, type PathDef, type PathId } from "@/data/workTogether";

export { CTA_HINT, CTA_LABEL, PATHS, getPath } from "@/data/workTogether";
export type { PathDef, PathId } from "@/data/workTogether";

/**
 * Consulting is the clearest action in the row. It is the one path that is a
 * direct commercial ask, and the live section already ranks it first (`01`), so
 * this is the existing hierarchy made visual rather than a new claim.
 */
export const PRIMARY_PATH_ID: PathId = "consulting";

export interface CtaRowButton {
  id: PathId;
  /** The choice, exactly as the live section words it. */
  label: string;
  /**
   * The supporting idea. Reaches assistive tech in every iteration; drawn on
   * screen only by ETB, whose bars are a name over a summary line.
   */
  lede: string;
  /** Mono metadata, revealed on hover/focus at desktop width. */
  meta: string;
  /**
   * The path's own first action, carried through for reference. The row itself
   * opens the destination screen rather than navigating, so this is what the
   * screen's primary button uses once it is open.
   */
  action: DestinationAction;
  primary: boolean;
}

function toButton(path: PathDef): CtaRowButton {
  return {
    id: path.id,
    label: path.label,
    lede: path.lede,
    meta: path.meta,
    action: path.destination.primary,
    primary: path.id === PRIMARY_PATH_ID,
  };
}

/** Left to right on desktop, top to bottom when stacked. Order matches PATHS. */
export const CTA_ROW_BUTTONS: CtaRowButton[] = PATHS.map(toButton);

/* ---------------------------------------------------------------------------
   Iterations

   Five skins for the same row. They differ only in how the buttons are drawn
   and how the primary is ranked — the composition, the copy, the links, and
   the layout are identical across all five, which is what makes them
   comparable.

   Every one is built from vocabulary the site already owns:

     .tag / --track-dymo   the DYMO label plate in globals.css — mono,
                           uppercase, #1c1c1c, deep inset emboss over a hard
                           `0 3px 0 #0b0b0b` edge that collapses on press.
     .etb-bar              the Emerging Tech Builds candy bar in
                           work-details.css — near-white gradient slab, mono
                           name over a summary, sheen sweep, Cobalt Select.
     --wt-paper / --wt-ink the paper/ink pair the destination screens use.
     --ink-body / --ink-muted / --ink-faint  the white ramp in scale.css.

   Which colour the accent is comes from the ACCENT axis below, not from the
   skin, so these notes say "accent" rather than naming a hue.
   ------------------------------------------------------------------------ */

export type CtaRowVariantId = "etb" | "editorial" | "dymo" | "rule" | "glass";

export interface CtaRowVariant {
  id: CtaRowVariantId;
  /** Shown in the lab picker. */
  name: string;
  /** One line — what the direction is. */
  note: string;
  /** The longer read — what it costs and what it buys. */
  verdict: string;
}

export const CTA_ROW_VARIANTS: CtaRowVariant[] = [
  {
    id: "etb",
    name: "A · ETB",
    note: "The Emerging Tech Builds candy bar. Cobalt Select on hover, summary line, sheen sweep.",
    verdict:
      "A close mirror of the /emerging-tech-builds accordion: the same near-white candy surface, the same mono uppercase name over a summary line, the same '›' chevron, the same diagonal sheen sweep, and the same Cobalt Select fill on hover. Consulting is ranked by being ALREADY selected — cobalt at rest — which is the most native way to say 'this one' in a language whose whole selection signal is the blue fill. Two real trades: it is the only iteration whose buttons are not small, because the summary line is what makes an ETB bar an ETB bar, and it puts a bright near-white slab in the foreground of a night photograph, which is the loudest any of these get. It also ties this section visually to the builds page — an asset if you want one system across the site, a liability if the Work chapter is meant to read as its own place.",
  },
  {
    id: "dymo",
    name: "B · DYMO",
    note: "The label plate from the nav and the connect row. Accent ink on the primary.",
    verdict:
      "The most unmistakably this site: it is the same embossed plate the header tags and the connect row use, down to the hard bottom edge that collapses under a press. The primary earns its rank with gold ink rather than a louder plate, so the three read as one set of labels with one of them lit. Costs the most visual weight of the four — three plates in a photograph's foreground is a lot of furniture for a section that is otherwise editorial.",
  },
  {
    id: "rule",
    name: "C · Rule",
    note: "Type on a hairline. No plates. An accent underline marks the primary.",
    verdict:
      "The most restrained, and the closest in spirit to the section it sits in — the live rows are type on a rule too, so this reads as the same family rather than as controls bolted underneath. The primary is marked by a 2px gold rule against the others' hairline, which is a quiet hierarchy but an unambiguous one. The risk is affordance: with no plate and no fill these can read as labels rather than as things to press, and that is exactly what a CTA cannot afford.",
  },
  {
    id: "glass",
    name: "D · Glass",
    note: "Frosted pills, accent hairline on the primary.",
    verdict:
      "The personas cards' language brought down to control size — frosted, hairline-bordered, and sitting on the photograph rather than over it. It keeps the cityscape readable through the buttons, which is the one direction here that treats the photo as part of the composition instead of as a backdrop. Gold on the primary does the ranking. Softest of the four, and the least tactile: nothing about a frosted pill says it presses.",
  },
  {
    id: "editorial",
    name: "E · Editorial",
    note: "Paper fill on the primary, glass ghosts behind it. Accent only marks the open one.",
    verdict:
      "The strongest hierarchy of the four — a paper fill against a night photograph is as loud as a button gets, and it introduces no colour the section doesn't already own since the paper is the destination screens' own surface. The trade is that it is the least branded: without the DYMO emboss or the gold it could belong to any dark portfolio. Right answer if conversion matters more than voice.",
  },
];

export const DEFAULT_VARIANT: CtaRowVariantId = "etb";

export function getVariant(id: CtaRowVariantId): CtaRowVariant {
  return CTA_ROW_VARIANTS.find((v) => v.id === id) ?? CTA_ROW_VARIANTS[0];
}

/* ---------------------------------------------------------------------------
   Accent

   A second axis, kept separate from the iteration so a skin and a colour can
   be judged independently rather than as eight fixed combinations.

   Both values are already in the repo — neither is a new brand colour:

     gold  #d8b15a, which work-details.css calls "the one accent", and which
           the privacy links, the footer focus ring, the personas cards and the
           404 all use. On paper it darkens to #8a6a1f, the value personas-lab
           landed on: #d8b15a on #f5f4f1 is about 1.9:1 and fails any contrast
           bar you care to set.
     blue  #2563eb, which is what the destination screen ALREADY uses for its
           block labels, its list bullets and its primary action — so this
           option is the one that matches the screens the row opens into.

   The accent is deliberately restricted to the primary's ink and edge, the
   current-item marker, and the screen's existing accented parts. It never
   touches body copy.
   ------------------------------------------------------------------------ */

export type CtaRowAccentId = "gold" | "blue";

export const CTA_ROW_ACCENTS: Array<{ id: CtaRowAccentId; label: string; note: string }> = [
  { id: "blue", label: "Blue", note: "#2563eb — the destination screens' own accent." },
  { id: "gold", label: "Gold", note: "#d8b15a — the site's single accent." },
];

/** Blue, because it is what the screens the row opens into already use. */
export const DEFAULT_ACCENT: CtaRowAccentId = "blue";

/* ---------------------------------------------------------------------------
   Imagery — the same committed crops the production Consulting stage uses.
   Sourced from src/components/work/ConsultingHeroStage.tsx.
   ------------------------------------------------------------------------ */

export const HERO_WIDE = "/consulting/hero-2.png";
export const HERO_NARROW = "/consulting/mobile-statue.png";

export const HERO_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";
