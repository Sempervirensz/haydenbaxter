// The four Work chapters' identities — ordinal and name, nothing else.
//
// Extracted so a consumer that needs only "what are the chapters called" does
// not have to import src/data/work.ts, which carries the AtomicOS, CaseBrief
// and Cortex demo payloads with it. StoryProgressSpine needs four ordinals and
// four names; importing them via work.ts cost the homepage 15 kB of First Load
// JS for that.
//
// WORK_SCREENS spreads these, so this stays the single source of truth and the
// spine cannot drift from the chapter rail.

export interface WorkChapter {
  id: number;
  /** "01 / 04" — the form the mobile chapter rail renders. */
  number: string;
  name: string;
}

export const WORK_CHAPTERS: WorkChapter[] = [
  { id: 1, number: "01 / 04", name: "WorldPulse" },
  { id: 2, number: "02 / 04", name: "Selected AI Work" },
  { id: 3, number: "03 / 04", name: "Supply Chain" },
  { id: 4, number: "04 / 04", name: "Consulting" },
];
