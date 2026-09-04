// Consulting colour lab — the axes and the argument for each direction.
//
// ONE QUESTION
//
// The shipped Consulting screen ("Start a Consulting Project" → the paper
// sheet) reads muted: five steps of grey on cream, and at rest exactly one
// coloured element on the whole panel — the primary button's 45%-alpha
// outline. This lab asks whether a restrained accent system fixes that, and
// what "restrained" should mean.
//
// WHAT IS BEING VARIED, AND WHAT IS NOT
//
// Content is frozen. Every treatment renders the same markup, the same copy
// out of `@/data/consultingPaths`, and the same interaction as production.
// Only the CSS differs, so a difference you can see between two stages is a
// difference in the treatment and nothing else. The three top-level bars above
// the sheet stay production-styled in all four for the same reason.
//
// Nothing in `src/components/work/**` imports this file. Promotion is a
// separate decision and a separate diff.

/* ---------------------------------------------------------------------------
   The measured problem
   ---------------------------------------------------------------------------
   Contrast ratios of the shipped ink ramp against the paper it sits on
   (#f5f4f1). These are what the treatments are trying to beat — the numbers
   are why "muted" is a readability finding and not only a taste one.
   ------------------------------------------------------------------------ */

export interface ContrastRow {
  token: string;
  /** Where it is actually used on the shipped screen. */
  role: string;
  ratio: string;
  /** WCAG AA for normal text is 4.5:1. */
  passes: boolean;
}

export const SHIPPED_CONTRAST: ContrastRow[] = [
  { token: "--ink-1", role: "Path name (serif)", ratio: "17.3:1", passes: true },
  { token: "--ink-2", role: "Credits line", ratio: "7.8:1", passes: true },
  { token: "--ink-3", role: "Lede · summary · secondary button", ratio: "4.2:1", passes: false },
  { token: "--ink-4", role: "Eyebrow · kicker · track numeral", ratio: "2.6:1", passes: false },
];

/* ---------------------------------------------------------------------------
   Treatments
   ------------------------------------------------------------------------ */

export type TreatmentId =
  | "control"
  | "drafting"
  | "portable"
  | "letterpress"
  | "index";

export interface Treatment {
  id: TreatmentId;
  label: string;
  /** One line: the direction's argument, in the panel caption. */
  thesis: string;
  /** The temperature axis the brief asked to see spread across directions. */
  temperature: string;
  /** What actually changed, for the write-up panel. */
  changed: string[];
  /** Why — the visual problem each change is aimed at. */
  solves: string;
  /** What it costs. Every direction has one; a direction with none is unexamined. */
  tradeoff: string;
}

export const TREATMENTS: Treatment[] = [
  {
    id: "control",
    label: "Control",
    thesis: "Exactly what ships today. Nothing overridden.",
    temperature: "Neutral cream",
    changed: ["Nothing. This is the reference."],
    solves:
      "It is the thing being argued against — the panel as it renders on the site right now.",
    tradeoff:
      "At rest the sheet carries one coloured element: the primary button's 45%-alpha outline. Metadata sits at 2.6:1, body copy at 4.2:1, and the serif names are held at 78% opacity by a hover rule that production never satisfies.",
  },
  {
    id: "drafting",
    label: "Drafting",
    thesis: "Colour means action, not category. One system blue, on a cool sheet.",
    temperature: "Cool · technical",
    changed: [
      "Paper cooled to a blue-grey drafting stock; hairlines re-mixed from slate rather than pure black.",
      "Ink ramp lifted — body copy to 6.3:1, metadata to 5.1:1.",
      "Kicker and track numeral set in cobalt at rest, preceded by a square registration tick.",
      "A real gutter rule between the two columns; the credits line re-set as a spec row with hairline dividers.",
      "Primary CTA becomes a solid cobalt fill on BOTH paths — the one saturated element per column.",
      "Secondary drops the pill entirely: mono uppercase over a 1px rule that thickens and turns cobalt on hover.",
      "Brass survives only as the supply path's identity tick and numeral.",
    ],
    solves:
      "Primary vs. secondary is unmistakable at a glance — a filled control against a text link, not two outlined pills of the same weight. Making blue mean 'this is the action' stops the two accent families competing for the same job.",
    tradeoff:
      "Contradicts the shipped comment that each path's CTA should carry that path's hue, so the button no longer proves which conversation you are starting. Two solid fills is also the loudest this site has been on a light surface — it is the direction most at risk of reading as a product page.",
  },
  {
    id: "portable",
    label: "Portable",
    thesis:
      "Everything Drafting does except the paper — so it can ship to all three screens, not just this one.",
    temperature: "Neutral · the shipped sheet",
    changed: [
      "Drafting's ink ramp, metadata colour, gutter rule, spec row and button ranks — unchanged.",
      "The sheet stays #f5f4f1. No cool paper, no slate hairlines.",
      "Hairlines lift from 0.18 to 0.24 alpha so the spec row's dividers still read on the warmer ground.",
      "Same system blue for every call to action; brass still only an identity tick.",
    ],
    solves:
      "WorldPulse and Experience render the same `.cpp-screen` and hard-code the same `data-surface=\"paper\"`. Drafting's cool sheet is therefore a change to all three or to none — ship it on Consulting alone and two paper colours sit one click apart in the same card. This is the subset that ports: the hierarchy win comes from the ramp and the filled-vs-link rank, and neither needs the surface to move.",
    tradeoff:
      "Loses the most distinctive thing about Drafting. On the warm sheet the cobalt reads a shade louder, because the neutrals are no longer in its family — the thing the cool stock was doing was making the accent look native rather than dropped on.",
  },
  {
    id: "letterpress",
    label: "Letterpress",
    thesis: "Hierarchy from scale and material. The DYMO plate does the asking.",
    temperature: "Warm · editorial",
    changed: [
      "Paper warmed toward a printed stock; hairlines warmed to match.",
      "Ink ramp lifted, and the summary re-set at reading size on a 44ch measure with more leading.",
      "The track numeral goes poster-scale — serif, set in the path's own hue at low alpha, anchoring each column's top-left.",
      "Kicker on a brass hairline; brass becomes the section's connective accent while each path keeps its hue for numeral and kicker.",
      "Primary CTA becomes a DYMO plate: dark slab, mono uppercase, hard bottom edge, a press state on :active, and a 3px cap in the path's hue.",
      "Secondary stays a hairline pill, lifted to legible ink.",
    ],
    solves:
      "Gives the section the entry point it does not currently have: a poster figure that starts each column, then a scale drop into the name, the summary, and the ask. Borrows the site's most recognisable control — the embossed label — into a panel that had none of it.",
    tradeoff:
      "Two dark plates at the foot of a light sheet are heavy, and they pull the eye to the bottom before the copy is read. The emboss is a dark-surface idiom; on paper it has to be argued for rather than assumed.",
  },
  {
    id: "index",
    label: "Index",
    thesis:
      "The panel is not short of colour — it is short of contrast. Same accents, three jobs each.",
    temperature: "Between · closest to shipped",
    changed: [
      "Ink ramp lifted; nothing else neutral is touched.",
      "The serif names come off the 78% hold at rest. Dimming becomes a real hover signal instead: the sibling recedes when one column is hovered.",
      "Kicker and track numeral take the path's own hue at rest — the single largest change, moving the metadata layer from 2.6:1 grey to 6.6:1 / 5.4:1 colour.",
      "The 2px identity rule tracklist currently hides returns as a lane bar in the gutter.",
      "A 4.5% hue wash at the top of each column fading to nothing, lifting to 10% on hover, with the hairline above it taking the path's hue.",
      "Primary CTA fills with the path's OWN hue, keeping the cue ring. Secondary stays an outline pill at legible ink.",
    ],
    solves:
      "Tests whether the muted feeling is a colour problem at all. Everything decorative stays where it is; the gain comes from the ramp, the un-dimmed names, and giving each accent exactly three jobs — kicker, lane bar, CTA fill — so hue reads as identity rather than decoration.",
    tradeoff:
      "The most conservative of the three: if the real fault is that the section has no focal point, this does not add one. And a brass fill beside a cobalt fill can read as two primaries competing rather than as two equal paths.",
  },
];

export const DEFAULT_TREATMENT: TreatmentId = "index";

export function getTreatment(id: TreatmentId): Treatment {
  return TREATMENTS.find((t) => t.id === id) ?? TREATMENTS[0];
}

/* ---------------------------------------------------------------------------
   Masthead axis
   ---------------------------------------------------------------------------
   Independent of the treatments and applied to all four equally, so it can be
   judged without confounding the colour comparison.

   `CONSULTING_SCREEN.title` ("Strategy that ships.") has been in
   `src/data/consultingPaths.ts` all along and production does not render it —
   the shipped masthead is one 13px grey lede and nothing else. That is a
   hierarchy finding in its own right, so it gets its own switch rather than
   being folded into whichever direction happened to want it.
   ------------------------------------------------------------------------ */

export type MastheadId = "production" | "headline";

export const MASTHEADS: { id: MastheadId; label: string; note: string }[] = [
  {
    id: "production",
    label: "Production",
    note: "The lede alone, as it ships. No heading-level anchor above the two paths.",
  },
  {
    id: "headline",
    label: "With headline",
    note: "Restores CONSULTING_SCREEN.title, already written and already in the data file, above the lede.",
  },
];

/* ---------------------------------------------------------------------------
   Drafting — the button row
   ---------------------------------------------------------------------------
   Drafting is the direction being taken forward, and the first question asked
   of it was whether its buttons are straight and aligned. Measured at 1800px:
   both primaries at the same y, both secondaries at the same y, identical
   button boxes across the two columns, left edges flush — every delta is 0.
   The one thing that is NOT equal is the secondary's rule, which runs the
   length of its label: "View Selected AI Work" is 69px shorter than "View
   Supply Chain Experience".

   Four answers to that, all inside Drafting's thesis (one system blue, a
   filled primary, a quiet secondary). Only the row changes.
   ------------------------------------------------------------------------ */

export type ActionsId = "stack" | "rule" | "equal" | "split";

export interface ActionsRow {
  id: ActionsId;
  label: string;
  /** What is straight, and what is allowed to vary. */
  note: string;
  tradeoff: string;
}

export const DRAFTING_ACTIONS: ActionsRow[] = [
  {
    id: "stack",
    label: "Stack",
    note: "As shown so far. Primary at its label's width, ruled text link beneath, left edges flush. Both primaries on one y, both links on one y — already straight everywhere except one place.",
    tradeoff: "The secondary's rule runs the length of its label, so the two columns end 69px apart. That single unequal edge is what reads as not-quite-aligned once you look for it.",
  },
  {
    id: "rule",
    label: "Rule",
    note: "Stack, with the secondary's underline spanning the full column instead of its label. One property changes; the two columns now end on the same line.",
    tradeoff: "A rule the width of the column reads slightly more like a divider than like an underlined link — it needs the label left-aligned to stay legible as a control.",
  },
  {
    id: "equal",
    label: "Equal",
    note: "Four identical boxes: same width within a column and across both. The secondary becomes an outlined box the size of the primary.",
    tradeoff: "Gives up the text-link secondary, so the rank gap narrows from filled-vs-link to filled-vs-outlined. The most orderly and the least editorial. Needs 1000px of card; below that it renders as Stack.",
  },
  {
    id: "split",
    label: "Split",
    note: "One row, one baseline: primary flush left, text link flush right. The row's outer edges are straight in both columns and the gap absorbs the label difference.",
    tradeoff: "The most horizontal of the four, which suits a wide card and nothing else — it needs 1180px and falls back to Stack below that. Puts the two ranks at equal optical height, which slightly flattens the hierarchy Drafting just built.",
  },
];

export const DEFAULT_ACTIONS: ActionsId = "stack";
