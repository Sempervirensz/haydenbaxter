// ETB language lab — the axes.
//
// ONE QUESTION: should the Selected AI Work gallery adopt the design language
// the consulting sheet already speaks?
//
// The two surfaces are built from the same object — `.wt__row`'s base rule is
// byte-for-byte `.etb-bar` (same #fefefe→#f6f5f2 plate, same 14px radius, same
// four-part shadow, same cobalt fill) — and the shipped `data-rows="skin"`
// skin then strips the plate back off to hairlines. So consulting is the ETB
// candy bar deliberately un-built. What survives as shared language at a glance
// is the cobalt and the paper, which is thinner than the shared code implies.
//
// The lab does NOT propose meeting in the middle. The two rows answer different
// questions — consulting is a three-way choice that resolves, ETB is a
// five-item catalogue you scan — so the row FORM, the ground and the motion are
// deliberately left alone. What the axes below move is the vocabulary the two
// surfaces share: type roles, colour meaning, the ink ramp, and whether the
// gallery has a top of hierarchy at all.
//
// Each axis is independent and they combine. `SHIPPED` and `PROPOSED` are the
// two presets that matter — the decision is whether the combined thing reads
// better, not whether any one axis does.

export type TypeAxis = "current" | "triad";
export type AccentAxis = "current" | "selection" | "discipline";
export type MastheadAxis = "current" | "titled";
export type PaperAxis = "current" | "unified";

export interface AxisOption<T extends string> {
  id: T;
  label: string;
  /** What this option actually changes, in declarations. */
  note: string;
}

export interface Axis<T extends string> {
  /** The `data-etb-*` attribute this axis writes. */
  attr: string;
  title: string;
  /** Why the axis exists — the finding it is testing. */
  premise: string;
  options: AxisOption<T>[];
}

/* ---------------------------------------------------------------------------
   1 — TYPE
   The site's rule (`.claude/rules/design-language.md`) is serif for headings,
   sans for body, mono for labels and metadata. The consulting sheet obeys it
   exactly. The gallery breaks it twice, and both breaks are one declaration.
   ------------------------------------------------------------------------ */

export const TYPE_AXIS: Axis<TypeAxis> = {
  attr: "data-etb-type",
  title: "Type triad",
  premise:
    "`.etb-bar__summary` is mono doing body work, and `.etb-dos__title` has no font-family at all so it inherits DM Sans 500. The bar NAME staying mono is correct — that is a label, which is mono's job.",
  options: [
    {
      id: "current",
      label: "Shipped",
      note: "Bar summary mono · dossier title DM Sans 500.",
    },
    {
      id: "triad",
      label: "Triad",
      note: "Bar summary → sans (tracking to 0). Dossier title → serif at weight 400, letter-spacing -0.02em. Creates the escalation mono label → serif name 20–26px → serif name 40–72px across the route.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   2 — ACCENT
   Cobalt currently means four things on this page: the selected bar, the
   status pill, the tag pill and the focus ring. Four meanings on one hue is
   none. Consulting solved it by giving each hue exactly one thing to say.
   ------------------------------------------------------------------------ */

export const ACCENT_AXIS: Axis<AccentAxis> = {
  attr: "data-etb-accent",
  title: "Accent meaning",
  premise:
    "Consulting runs two hues that each say one thing — cobalt rgb(37,99,235) is AI/systems, brass rgb(184,146,74) is supply chain. The gallery runs one hue saying four things.",
  options: [
    {
      id: "current",
      label: "Shipped",
      note: "Cobalt on selection, status, tags and focus.",
    },
    {
      id: "selection",
      label: "Selection only",
      note: "Cobalt keeps the selected bar and the focus ring. Status, category and tags drop to the neutral ink ramp already on the paper.",
    },
    {
      id: "discipline",
      label: "Discipline",
      note: "The consulting palette becomes site-wide semantics: cobalt = AI/systems, brass = supply chain. ProcureBridge (Supply Chain Apps) reads brass; the other four read cobalt. Brass takes dark ink (#17150e) on fill — white measures 2.9:1 on it and the palette already anticipates this.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   3 — MASTHEAD
   The route's <h1> is `visually-hidden`, so the loudest thing on
   /emerging-tech-builds is five identical rows.

   This axis renders in the LAB'S OWN FRAME, not inside `ETBDetail` — the
   homepage card mounts the same component and supplies its own chapter header
   ("Selected AI Work · 02 / 04"), so a title added inside the component would
   double up there. If this ships it belongs in the route's rail.
   ------------------------------------------------------------------------ */

export const MASTHEAD_AXIS: Axis<MastheadAxis> = {
  attr: "data-etb-masthead",
  title: "Top of hierarchy",
  premise:
    "Consulting descends display → mono hint on a hairline → rows. The gallery starts at the rows. Land here from a link and nothing tells you what you are looking at.",
  options: [
    { id: "current", label: "Shipped", note: "Back rail only. The h1 is visually hidden." },
    {
      id: "titled",
      label: "Titled",
      note: "Serif title + mono kicker over the hairline treatment `.wt__hint` uses. Belongs in page.tsx's rail, never in ETBDetail.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   4 — PAPER
   Both surfaces already print the same paper, with a wobble in the middle of
   the ramp. This axis is the one with a measurable answer rather than a
   visual one — see the contrast readout in the panel.
   ------------------------------------------------------------------------ */

export const PAPER_AXIS: Axis<PaperAxis> = {
  attr: "data-etb-paper",
  title: "Ink ramp",
  premise:
    "The consulting sheet ships a `data-system=\"drafting\"` layer that raised its whole ramp for readability — --ink-2 0.74→0.82, --ink-3 0.56→0.68, --ink-4 0.40→0.62, each annotated in the CSS with its measured ratio. Those are the values to unify on; the pre-drafting 0.56 is dead and survives only in the stale lab stylesheet.",
  options: [
    { id: "current", label: "Shipped", note: "--etb-muted 0.62 (5.12:1) · --etb-dim 0.38 · dossier card at 12px radius with no shadow." },
    {
      id: "unified",
      label: "Drafting ramp",
      note: "--etb-muted → drafting --ink-3 (0.68), --etb-dim → drafting --ink-4 (0.62), dossier card takes the sheet's 14px radius and --sheet-shadow. A contrast INCREASE: 5.12:1 → ~6.3:1. The gallery inherits the pass the sheet already had.",
    },
  ],
};

/* ------------------------------------------------------------------------ */

export interface LabState {
  type: TypeAxis;
  accent: AccentAxis;
  masthead: MastheadAxis;
  paper: PaperAxis;
}

/** What /emerging-tech-builds renders today. */
export const SHIPPED: LabState = {
  type: "current",
  accent: "current",
  masthead: "current",
  paper: "current",
};

/**
 * The recommendation, all four axes on.
 *
 * `paper` was off here for one round, on a measurement taken against
 * `/consulting-paths-lab` — which carries its own 161KB stylesheet and its own
 * copy of the screen component, both predating the drafting pass. That read
 * 4.18:1 and produced a confident, wrong conclusion that the consulting sheet
 * was failing AA.
 *
 * The live sheet measures 10.32:1. `consulting-paths.css` had already fixed it
 * and annotated the fix in place — `--ink-3 ... 6.3:1 — was 4.2:1` — so the
 * "finding" was a rediscovery of a solved problem, read off a stale surface.
 *
 * Measure the page that ships, not the lab that explored it.
 */
export const PROPOSED: LabState = {
  type: "triad",
  accent: "discipline",
  masthead: "titled",
  paper: "unified",
};

/** Ordered for the panel and for the 1–4 keyboard shortcuts. */
export const AXES = [TYPE_AXIS, ACCENT_AXIS, MASTHEAD_AXIS, PAPER_AXIS] as const;
