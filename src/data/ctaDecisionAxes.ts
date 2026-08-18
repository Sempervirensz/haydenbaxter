// Decision lab — the control axes for the disc.
//
// Each axis exists to settle an argument, not to offer a knob. Every option
// carries what it costs alongside what it buys, because an axis whose options
// have no stated cost has not been thought about hard enough to choose from.
//
// The five are deliberately independent: the disc's ROLE, its PLACEMENT, its
// SIZE, its MOTION, and its FINISH. Crossing them is how you find out whether
// a treatment you like survives being made smaller, faded, or still.

export interface AxisOption<T extends string> {
  id: T;
  label: string;
  note: string;
}

/* ---------------------------------------------------------------------------
   1. ROLE — the question the whole lab exists to answer
   ------------------------------------------------------------------------ */

export type DiscRole = "anchor" | "backdrop" | "none";

export const DISC_ROLES: AxisOption<DiscRole>[] = [
  {
    id: "anchor",
    label: "Anchor",
    note: "A companion object beside the choice. Sharp, sticky, holds its own column.",
  },
  {
    id: "backdrop",
    label: "Backdrop",
    note: "Oversized and set behind everything as atmosphere. Cinematic, but it stops being an object you read.",
  },
  {
    id: "none",
    label: "None",
    note: "Type only. The control — the one setting that tells you whether the disc is earning its place.",
  },
];

/* ---------------------------------------------------------------------------
   2. PLACEMENT — low yield, but it decides what is read first
   ------------------------------------------------------------------------ */

export type DiscPlace = "right" | "left";

export const DISC_PLACES: AxisOption<DiscPlace>[] = [
  { id: "right", label: "Right", note: "Type first, object second. Conventional in a left-to-right read." },
  { id: "left", label: "Left", note: "Object first. The disc introduces the page and the choice answers it." },
];

/* ---------------------------------------------------------------------------
   3. SCALE
   ------------------------------------------------------------------------ */

export type DiscScale = "sm" | "md" | "lg" | "xl";

export const DISC_SCALES: AxisOption<DiscScale>[] = [
  { id: "sm", label: "S", note: "A token. Present, never competing with the headline." },
  { id: "md", label: "M", note: "A peer to the tracklist." },
  { id: "lg", label: "L", note: "The visual anchor. Current default." },
  { id: "xl", label: "XL", note: "Dominant. The page becomes about the object." },
];

/* ---------------------------------------------------------------------------
   4. MOTION — where the site's "grounded motion" rule gets tested
   ------------------------------------------------------------------------ */

export type DiscMotion = "settle" | "cue" | "drift" | "parallax" | "none";

export const DISC_MOTIONS: AxisOption<DiscMotion>[] = [
  {
    id: "settle",
    label: "Settle",
    note: "Rotates to a resting angle per track. Grounded and quiet. Current default.",
  },
  {
    id: "cue",
    label: "Cue",
    note: "Sweeps through a longer arc before settling, like a disc being cued. Reads as cause and effect. Costs about half a second before the panel is stable.",
  },
  {
    id: "drift",
    label: "Drift",
    note: "Turns continuously, very slowly. Alive rather than animated. Costs a permanently moving element on a page whose job is a decision.",
  },
  {
    id: "parallax",
    label: "Parallax",
    note: "Drifts against the scroll, scroll-driven so there is no listener. Only reads on a page long enough to scroll.",
  },
  { id: "none", label: "None", note: "Static. What every reduced-motion visitor sees anyway." },
];

/* ---------------------------------------------------------------------------
   5. FINISH — sharpness is a stated value on this site, so fading is a trade
   ------------------------------------------------------------------------ */

export type DiscFinish = "sharp" | "faded" | "spotlit";

export const DISC_FINISHES: AxisOption<DiscFinish>[] = [
  {
    id: "sharp",
    label: "Sharp",
    note: "Full contrast, every concentric detail intact. The disc is an object on the page.",
  },
  {
    id: "faded",
    label: "Faded",
    note: "Dimmed and lowered in contrast so type leads. Cinematic. Costs the detail that makes it read as a physical thing.",
  },
  {
    id: "spotlit",
    label: "Spotlit",
    note: "Sharp at the centre, falling into the dark at the rim. Keeps the detail and still lets the page breathe.",
  },
];

/* ---------------------------------------------------------------------------
   Settings
   ------------------------------------------------------------------------ */

export interface DiscSettings {
  role: DiscRole;
  place: DiscPlace;
  scale: DiscScale;
  motion: DiscMotion;
  finish: DiscFinish;
}

export const DEFAULT_DISC: DiscSettings = {
  role: "anchor",
  place: "right",
  scale: "lg",
  motion: "settle",
  finish: "sharp",
};

/** Reads settings out of a query string so any combination stays linkable. */
export function readDiscSettings(sp: URLSearchParams): DiscSettings {
  const pick = <T extends string>(
    key: string,
    options: AxisOption<T>[],
    fallback: T
  ): T => {
    const raw = sp.get(key) ?? "";
    return options.some((o) => o.id === raw) ? (raw as T) : fallback;
  };
  return {
    role: pick("disc", DISC_ROLES, DEFAULT_DISC.role),
    place: pick("place", DISC_PLACES, DEFAULT_DISC.place),
    scale: pick("scale", DISC_SCALES, DEFAULT_DISC.scale),
    motion: pick("motion", DISC_MOTIONS, DEFAULT_DISC.motion),
    finish: pick("finish", DISC_FINISHES, DEFAULT_DISC.finish),
  };
}

export function discQuery(s: DiscSettings): string {
  return `?disc=${s.role}&place=${s.place}&scale=${s.scale}&motion=${s.motion}&finish=${s.finish}`;
}
