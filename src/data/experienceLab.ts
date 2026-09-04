// "My Experience" — design lab.
//
// The eight directions explored for path 03 of the Consulting chapter, and the
// record of why 04 was chosen. Direction 04 SHIPPED: it is now
// `src/components/work/ExperienceScreen.tsx`, and concept 04 in this lab
// renders that same component, so the lab cannot show something the site does
// not.
//
// THE FACTS LIVE IN PRODUCTION
//
// Career, figures, education and the positioning line are re-exported from
// `src/data/experience.ts` rather than restated — the same relationship
// `ctaLab.ts` has with `workTogether.ts`. A lab that kept its own copy would
// drift the moment either side was edited, and the sourcing notes that justify
// each fact live with the production data where they are enforceable.

export {
  CAREER,
  CAREER_RECENT,
  PHASE_LABEL,
  FIGURES,
  EDUCATION,
  CAPABILITIES,
  PERSPECTIVE,
} from "@/data/experience";

export type { CareerStop, Figure, Education } from "@/data/experience";

/* ---------------------------------------------------------------------------
   Concepts
   ------------------------------------------------------------------------ */

export type ConceptId =
  | "ledger"
  | "trajectory"
  | "axes"
  | "scale"
  | "liner"
  | "sentence"
  | "record"
  | "playhead";

export interface ConceptMeta {
  id: ConceptId;
  /** Lab-only index, shown in the switcher. */
  index: string;
  /** Lab-only internal name. */
  name: string;
  /** One line: what this direction believes. */
  thesis: string;
  /** What design problem it is solving differently from the others. */
  solves: string;
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "ledger",
    index: "01",
    name: "Ledger",
    thesis:
      "Four names and four roles on hairlines. No headline, no chips, no argument — the record is the argument.",
    solves:
      "Density. Tests whether the section can say everything it needs to in one screen with nothing to scroll.",
  },
  {
    id: "trajectory",
    index: "02",
    name: "Trajectory",
    thesis:
      "The sequence is the credibility. A single spine runs Aosom → Disney → Nike → WorldPulse and ends on the venture.",
    solves:
      "Direction. A logo strip says he was near three companies; a spine says he moved through them and arrived somewhere.",
  },
  {
    id: "axes",
    index: "03",
    name: "Two Axes",
    thesis:
      "Operations and technology are drawn as two bands joined by one mark, with the conclusion set last instead of first.",
    solves:
      "Coherence. Answers “why do these belong together” structurally rather than by writing a sentence that claims it.",
  },
  {
    id: "scale",
    index: "04",
    name: "Scale",
    thesis:
      "Three figures at display size — 8+, 100+, 中文 — with the employers demoted to a footnote beneath them.",
    solves:
      "Weight. Inverts the current composition, where the longest credential is the largest object and the strongest one is a small chip.",
  },
  {
    id: "liner",
    index: "05",
    name: "Liner Notes",
    thesis:
      "The record sleeve, taken literally. Side A is operations, Side B is the venture, and the credits run underneath.",
    solves:
      "Nativeness, at risk. The page is already a CD player — this asks whether a career record should be pressed rather than listed.",
  },
  {
    id: "sentence",
    index: "06",
    name: "One Sentence",
    thesis:
      "Not a section. One serif paragraph where the evidence sits in dark ink and the connective prose recedes.",
    solves:
      "The premise. Challenges whether this moment needs a structure at all, or just one well-set thought.",
  },
  {
    id: "record",
    index: "07",
    name: "Record",
    thesis:
      "A museum object label: mono field names in a left column, values right, hairlines between, CURRENT last.",
    solves:
      "Authority. Credibility from the form of an archival record rather than from persuasion or scale.",
  },
  {
    id: "playhead",
    index: "08",
    name: "Playhead",
    thesis:
      "Four names, one open at a time, with a scrub line that fills to the chosen stop — the row interaction above it, one level down.",
    solves:
      "Length. Short at rest and deep on demand, which is the only way to have both inside a 300×500 sheet.",
  },
];

export function getConcept(id: ConceptId): ConceptMeta {
  return CONCEPTS.find((c) => c.id === id) ?? CONCEPTS[0];
}

/* ---------------------------------------------------------------------------
   Lab device presets
   ------------------------------------------------------------------------ */

export interface DevicePreset {
  label: string;
  w: number;
  h: number;
}

/* The band Hayden is evaluating in, plus one small phone below it and one
   tablet above so a concept can't be tuned to a single width. Heights are the
   real CSS viewport of each device; the card fills it. */
export const DEVICE_PRESETS: DevicePreset[] = [
  { label: "iPhone SE · 375", w: 375, h: 667 },
  { label: "iPhone 13 · 390", w: 390, h: 844 },
  { label: "iPhone 16 Pro · 402", w: 402, h: 874 },
  { label: "Plus / Max · 430", w: 430, h: 932 },
  { label: "Tablet · 768", w: 768, h: 1024 },
];
