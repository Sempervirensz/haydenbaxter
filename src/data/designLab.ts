// Design Lab — registry of homepage UX experiments. Keep copy here so the lab
// components stay layout-only and new experiments are easy to add.

export const DESIGN_LAB_INTRO = {
  kicker: "Design Lab",
  title: "Teach the site to be touched.",
  lede:
    "A space to test how the homepage invites interaction — click, flip, open, reveal, explore — rather than passive scrolling. Nothing here touches the live site.",
};

export type ExperimentStatus = "live" | "planned";

export interface LabExperiment {
  id: string;
  num: string;
  title: string;
  blurb: string;
  status: ExperimentStatus;
  /** If set, the experiment opens as its own full page rather than inline. */
  href?: string;
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "four-card-threshold",
    num: "01",
    title: "Four-Card Threshold",
    blurb:
      "A refined entry: reveal four identity cards to open the experience. Teaches that the site is interactive without saying so.",
    status: "live",
  },
  {
    id: "soft-lock-entry",
    num: "02",
    title: "Soft-Lock Entry (homepage mirror)",
    blurb:
      "A true mirror of the real first page (actual hero + card deck) with a SOFT lock beneath: instructions teach the visitor to flip and explore, with a Skip for non-interactors. Opens as a full page.",
    status: "live",
    href: "/design-lab/soft-lock",
  },
  {
    id: "guided-scroll",
    num: "03",
    title: "Softer guided scroll",
    blurb:
      "A gentler on-ramp where subtle cues invite the first interaction as the visitor scrolls, instead of a hard threshold.",
    status: "planned",
  },
  {
    id: "exploration-guide",
    num: "04",
    title: "Persistent exploration guide",
    blurb:
      "A quiet, always-present companion that hints at what can be opened next — a map rather than a gate.",
    status: "planned",
  },
  {
    id: "recruiter-minimal",
    num: "05",
    title: "Recruiter-friendly minimal",
    blurb:
      "A stripped, fast-scanning variant for time-poor visitors: the substance up front, interaction optional.",
    status: "planned",
  },
  {
    id: "cinematic-intro",
    num: "06",
    title: "Cinematic homepage intro",
    blurb:
      "A more filmic opening sequence that sets tone before the work — pulling from the cinematic Work stack language.",
    status: "planned",
  },
];
