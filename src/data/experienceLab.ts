// "My Experience" — design lab source of truth.
//
// WHAT IS UNDER REVIEW
//
// Path 03 of the Consulting chapter ("Review My Experience"). In production it
// is `WorkTogetherSolo` rendering `workTogether.ts → EXPERIENCE.destination`
// into the paper sheet that unfurls beneath the three track rows. Nothing in
// this file is wired to that; the lab is additive and removable.
//
// WHAT THE FACTS ARE
//
// Career, scale, language and education below are the source material Hayden
// supplied for the review. Two of them do NOT exist anywhere else in the repo
// yet — "100+ factories" and both universities — so they are NOT carried into
// production by this file. It is read only by `/experience-lab`.
//
// Everything else is already claimed on the site and is repeated here so a
// concept can be read without cross-referencing:
//   Nike / Disney / Aosom       siteContent.ts → brands.logos
//   Founder at WorldPulse       work.ts → WORK_SCREENS[0].full.caption
//   8+ years, fluent Mandarin   about.ts → intro
//   M.S. AI in Business (ASU)   workTogether.ts → EXPERIENCE.signals
//
// NOTHING HERE IS INVENTED. No dates, no titles, no metrics, no clients beyond
// what was given. Where a fact was supplied without a qualifier — Utah State
// has no degree letters attached — none is added.

/* ---------------------------------------------------------------------------
   Career
   ------------------------------------------------------------------------ */

export interface CareerStop {
  id: string;
  company: string;
  role: string;
  /** Chronological position, 01 = earliest. */
  index: string;
  /** Which half of the operating perspective this stop sits in. A framing of
      the same four facts, not an additional claim about any employer. */
  phase: "operations" | "technology";
}

/** Chronological. Aosom → Disney → Nike → WorldPulse. */
export const CAREER: CareerStop[] = [
  { id: "aosom", company: "Aosom", role: "Supply Chain", index: "01", phase: "operations" },
  { id: "disney", company: "Disney", role: "Procurement", index: "02", phase: "operations" },
  { id: "nike", company: "Nike", role: "Sourcing Lead", index: "03", phase: "operations" },
  { id: "worldpulse", company: "WorldPulse", role: "Founder", index: "04", phase: "technology" },
];

/** Newest first — the order a record is read in, not the order it happened. */
export const CAREER_RECENT: CareerStop[] = [...CAREER].reverse();

export const PHASE_LABEL: Record<CareerStop["phase"], string> = {
  operations: "Global operations",
  technology: "Emerging technology",
};

/* ---------------------------------------------------------------------------
   Scale, language, education
   ------------------------------------------------------------------------ */

export interface Figure {
  id: string;
  figure: string;
  caption: string;
  /** The same fact set as one mono line, for concepts that run them together. */
  inline: string;
}

export const FIGURES: Figure[] = [
  {
    id: "years",
    figure: "8+",
    caption: "Years in global supply chain",
    inline: "8+ years",
  },
  {
    id: "factories",
    figure: "100+",
    caption: "Factories supported",
    inline: "100+ factories",
  },
  {
    id: "language",
    figure: "中文",
    caption: "Fluent Mandarin",
    inline: "Mandarin",
  },
];

export interface Education {
  id: string;
  school: string;
  /** Short form for tight columns. */
  schoolShort: string;
  program: string;
  /** Mono, uppercase-safe short form. */
  programShort: string;
}

export const EDUCATION: Education[] = [
  {
    id: "asu",
    school: "Arizona State University",
    schoolShort: "Arizona State",
    program: "M.S. Artificial Intelligence in Business",
    programShort: "M.S. AI in Business",
  },
  {
    id: "usu",
    school: "Utah State University",
    schoolShort: "Utah State",
    program: "International Business + Chinese",
    programShort: "Intl Business + Chinese",
  },
];

/** The capability set, in the order that reads operations → technology. */
export const CAPABILITIES = [
  "Global sourcing",
  "Procurement",
  "Supplier governance",
  "Logistics",
  "Traceability",
  "Digital Product Passports",
  "AI product development",
  "Cross-cultural operations",
];

/* ---------------------------------------------------------------------------
   The positioning line
   ------------------------------------------------------------------------ */

export const PERSPECTIVE = {
  axisA: "Global operations",
  axisB: "Emerging technology",
  join: "One operating perspective.",
};

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
