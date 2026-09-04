// The operating record behind "Review My Experience".
//
// This is the PRODUCTION source. `src/data/experienceLab.ts` re-exports from
// here, so the lab at /experience-lab and the live section can never drift —
// the same relationship `ctaLab.ts` has with `workTogether.ts` and
// `consultingPathsLab.ts` has with `consultingPaths.ts`.
//
// WHAT IT REPLACED
//
// Path 03 used to render `WorkTogetherSolo`: two titled blocks of mono chips
// ("Leadership", "Selected work") over a credential strip. Measured on a phone
// at 402x874 it put 873px of content into a 518px sheet — 355px of the record
// below the fold of a nested scroller with no scroll affordance — and the five
// facts that actually carry weight (Nike, Disney, Aosom, Mandarin, the M.S.)
// all sat in that lower 355px. Its longest credential, the ASU chip, wrapped to
// three lines and became the largest object on the sheet while NIKE rendered
// at the size of a word.
//
// Most of what it listed was also redundant by the time a visitor reached it:
// the brands marquee has already shown Nike / Disney / Aosom, WorldPulse has
// had a full chapter, and so have the AI builds. What the page had never said
// is the SHAPE of the record — the scale, the language, and the education that
// connects global operations to emerging technology.
//
// SOURCING
//
// Every fact below was supplied by Hayden for the design review. Three of them
// are new to this repo and are introduced here deliberately:
//
//   "100+ factories"        no prior source in the repo
//   Arizona State           named for the first time; the M.S. itself already
//                           appeared in workTogether.ts -> EXPERIENCE.signals
//   Utah State              no prior source in the repo
//
// The rest are carried from what the site already claims:
//   Nike / Disney / Aosom   siteContent.ts -> brands.logos
//   Founder at WorldPulse   work.ts -> WORK_SCREENS[0].full.caption
//   8+ years, Mandarin      about.ts -> intro
//
// Nothing is invented. No dates, no titles, no metrics, no clients beyond what
// was given — and no degree letters beyond what was given either: Arizona State
// carries the M.S. because the source states it, and Utah State is named by its
// programme because the source does not.

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

/** Chronological. Aosom -> Disney -> Nike -> WorldPulse. */
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
   The three figures
   ------------------------------------------------------------------------ */

export interface Figure {
  id: string;
  /** Set at display scale. Short enough to read as a quantity at a glance. */
  figure: string;
  caption: string;
  /** The same fact as one mono line, for anything that runs them together. */
  inline: string;
}

/* The third figure is a language rather than a number on purpose: at display
   scale it makes Mandarin a quantity of difference instead of a line item, and
   it is the only one of the three that cannot be inferred from the chapters
   above it. */
export const FIGURES: Figure[] = [
  { id: "years", figure: "8+", caption: "Years in global supply chain", inline: "8+ years" },
  { id: "factories", figure: "100+", caption: "Factories supported", inline: "100+ factories" },
  { id: "language", figure: "中文", caption: "Fluent Mandarin", inline: "Mandarin" },
];

/* ---------------------------------------------------------------------------
   Education
   ------------------------------------------------------------------------ */

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

/* ---------------------------------------------------------------------------
   Positioning
   ------------------------------------------------------------------------ */

export const PERSPECTIVE = {
  axisA: "Global operations",
  axisB: "Emerging technology",
  join: "One operating perspective.",
};

/** The capability set, in the order that reads operations -> technology. */
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
