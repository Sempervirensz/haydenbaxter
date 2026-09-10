// ETB language lab — the axes.
//
// ONE QUESTION, ANSWERED: should the Selected AI Work gallery speak the
// consulting sheet's design language? Direction B shipped — share the
// vocabulary, keep the grammar. Type roles, ink ramp and colour meaning are now
// common to both surfaces; row form, ground and motion stay different, because
// a three-way choice that resolves is not a five-item catalogue you scan.
//
// SO WHAT IS THIS STILL FOR
//
// Two things. It is the before/after: every axis below now REVERTS its half of
// B on the live page, so the argument stays checkable instead of being a claim
// in a commit message. And it is the harness for what is still open — the
// artifact lists directions A (converge fully on Drafting) and D (push the
// DYMO plate back onto consulting), and both would be built here first.
//
// The default state applies nothing at all. The gallery under `shipped` is not
// a reconstruction of the gallery — it is the gallery, with a panel beside it.
// That is the whole reason this lab frames the real page rather than redrawing
// it: a reconstruction hides exactly the findings that decide the design.
//
// WHAT THIS LAB GOT WRONG, KEPT ON PURPOSE
//
// The ink-ramp axis shipped backwards on its first pass. It was measured
// against /consulting-paths-lab — which carries its own 161KB stylesheet and
// its own copy of the screen component, both predating the drafting pass — and
// read 4.18:1, producing a confident and wrong conclusion that the consulting
// sheet was failing AA. The live sheet measures 10.32:1, and
// `consulting-paths.css` had already fixed it and annotated the fix in place:
// `--ink-3 ... 6.3:1 — was 4.2:1`. Measure the page that ships.

/** Every axis is the same two-way switch: what the site does now, or what it
 *  did before direction B. */
export type AxisValue = "shipped" | "before";

export interface AxisOption {
  id: AxisValue;
  label: string;
  /** What this option actually changes, in declarations. */
  note: string;
}

export interface Axis {
  /** The `data-etb-*` attribute this axis writes. */
  attr: string;
  title: string;
  /** Why the axis exists — the finding it carries. */
  premise: string;
  options: [AxisOption, AxisOption];
}

/* ---------------------------------------------------------------------------
   1 — TYPE
   ------------------------------------------------------------------------ */

export const TYPE_AXIS: Axis = {
  attr: "data-etb-type",
  title: "Type triad",
  premise:
    "Serif names, sans argues, mono labels. The bar NAME stays mono uppercase — that is a DYMO label, which is mono's job. What moved is the sentence under it, and the dossier title, which had no font-family at all and inherited DM Sans 500.",
  options: [
    {
      id: "shipped",
      label: "Shipped",
      note: "Bar summary in sans at 0 tracking. Dossier title in DM Serif Display at 400 — the face ships 400 only, so the old 500 was a synthesised bold. Names now escalate mono → serif 20–26px → serif 40–72px across the route.",
    },
    {
      id: "before",
      label: "Before B",
      note: "Bar summary back to mono at 0.02em; dossier title back to inherited DM Sans 500.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   2 — ACCENT
   ------------------------------------------------------------------------ */

export const ACCENT_AXIS: Axis = {
  attr: "data-etb-accent",
  title: "Accent meaning",
  premise:
    "Cobalt used to mean four things at once here: selected row, status pill, tag pill, focus ring. It now means one — which discipline the project belongs to — matching the consulting sheet, where cobalt is AI/systems and brass is supply chain.",
  options: [
    {
      id: "shipped",
      label: "Shipped",
      note: "Hue comes from `disciplineOf(project)`; ProcureBridge reads brass. Status left the accent and carries its distinction on the ink ramp instead. Tags took full-strength accent ink — the old 72% alpha measured 3.4:1, this measures 4.7:1.",
    },
    {
      id: "before",
      label: "Before B",
      note: "Every project cobalt again, and the status pill blue along with the tags.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   3 — MASTHEAD
   ------------------------------------------------------------------------ */

export const MASTHEAD_AXIS: Axis = {
  attr: "data-etb-masthead",
  title: "Top of hierarchy",
  premise:
    "The h1 was visually-hidden, so the loudest thing on the route was five identical rows. It is real markup now, in the ROUTE's frame — never inside ETBDetail, which the homepage card also mounts with its own chapter header.",
  options: [
    {
      id: "shipped",
      label: "Shipped",
      note: "Mono kicker on `.wt__hint`'s hairline, then the name in the serif. Both strings read from the screen's own data — `credibilityLine` and `title`.",
    },
    { id: "before", label: "Before B", note: "Masthead hidden; the route opens on the back rail and the rows." },
  ],
};

/* ---------------------------------------------------------------------------
   4 — INK RAMP
   ------------------------------------------------------------------------ */

export const PAPER_AXIS: Axis = {
  attr: "data-etb-paper",
  title: "Ink ramp",
  premise:
    "The gallery now recedes at the same rate as the consulting sheet, on the ramp the drafting pass established there — each step annotated in that CSS with the ratio it clears. Watch the readout: reverting is a contrast REDUCTION.",
  options: [
    {
      id: "shipped",
      label: "Shipped",
      note: "--etb-muted 0.68 (6.31:1) · --etb-dim 0.62 (5.10:1) · dossier card on the sheet's 14px radius and shadow.",
    },
    {
      id: "before",
      label: "Before B",
      note: "--etb-muted 0.62 (5.12:1) · --etb-dim 0.38 (2.60:1) · category ink back to 0.42 (2.9:1) · flat 12px card.",
    },
  ],
};

/* ------------------------------------------------------------------------ */

export interface LabState {
  type: AxisValue;
  accent: AxisValue;
  masthead: AxisValue;
  paper: AxisValue;
}

/** What /emerging-tech-builds renders today. Applies no overrides at all. */
export const SHIPPED: LabState = {
  type: "shipped",
  accent: "shipped",
  masthead: "shipped",
  paper: "shipped",
};

/** The gallery as it stood before direction B. */
export const BEFORE: LabState = {
  type: "before",
  accent: "before",
  masthead: "before",
  paper: "before",
};

/** Ordered for the panel and for the 1–4 keyboard shortcuts. */
export const AXES = [TYPE_AXIS, ACCENT_AXIS, MASTHEAD_AXIS, PAPER_AXIS] as const;
