// Copy + visual tuning for the cinematic Consulting experience ("Night
// Watch"). The lab route and the live Work screen share this single source
// of truth — knob changes in the lab map 1:1 onto these fields.

export interface CinemaTuning {
  /** Extra scale the camera gains pushing toward the statue (0–0.6). */
  pushScale: number;
  /** Push-in focal point, % across the city plane (statue ≈ 71 / 38). */
  focalX: number;
  focalY: number;
  /** Vertical drift of the city plane across the full scroll, in % of its own height. Negative = upward. */
  cityDrift: number;
  /** Counter-drift of the star field — slower than the city = reads deeper. */
  skyDrift: number;
  /** Drift of the water/mist plane — faster than the city = reads closer. */
  mistDrift: number;
  /** Peak opacity of the dark wash behind the practice + engage acts. */
  washMax: number;
  /** Peak opacity of the blurred-city copy under the wash. */
  blurMax: number;
  /** Edge vignette strength (0–1). */
  vignette: number;
  /** Star field intensity (0–1). */
  stars: number;
  /** Cinema letterbox bars during the push-in, in vh per bar (0 = off). */
  letterbox: number;
}

export const CINEMA_PRESETS: Record<string, { label: string; tuning: CinemaTuning }> = {
  "night-watch": {
    label: "Night Watch — push-in on the statue",
    tuning: {
      pushScale: 0.34,
      focalX: 71,
      focalY: 38,
      cityDrift: -5,
      skyDrift: -1.5,
      mistDrift: 9,
      washMax: 0.78,
      blurMax: 1,
      vignette: 0.75,
      stars: 0.65,
      letterbox: 0,
    },
  },
  "still-water": {
    label: "Still Water — quiet drift, no zoom",
    tuning: {
      pushScale: 0.1,
      focalX: 50,
      focalY: 45,
      cityDrift: -7,
      skyDrift: -2,
      mistDrift: 12,
      washMax: 0.84,
      blurMax: 1,
      vignette: 0.55,
      stars: 0.85,
      letterbox: 0,
    },
  },
  "deep-field": {
    label: "Deep Field — hard push + letterbox",
    tuning: {
      pushScale: 0.52,
      focalX: 72,
      focalY: 36,
      cityDrift: -4,
      skyDrift: -1,
      mistDrift: 7,
      washMax: 0.72,
      blurMax: 0.9,
      vignette: 0.9,
      stars: 0.45,
      letterbox: 4.5,
    },
  },
};

export const CINEMA_DEFAULT_TUNING: CinemaTuning =
  CINEMA_PRESETS["night-watch"].tuning;

// ---------------------------------------------------------------------------
// Copy — act structure
// ---------------------------------------------------------------------------

export const CINEMA_COPY = {
  /** DYMO chapter label pinned top-left of the scene. */
  chapterLabel: "Consulting",
  scrollHint: "Scroll",

  identity: {
    dymo: "Act II — Vantage",
    /** Rendered as staggered serif lines with mono × separators. */
    words: ["Design", "Domain knowledge", "AI", "Systems thinking"],
    founder:
      "Founder-style execution bias: define the problem, build the right thing, and make the handoff usable.",
  },

  practice: {
    dymo: "Act III — The practice",
    heading: "Three ways in.",
    sub: "Pick the lane closest to your problem — each one opens a full dossier.",
  },

  engage: {
    dymo: "Act IV — Start here",
    heading: "Let’s build what’s next.",
    sub: "Exploring a project, workflow, or idea? Let’s talk it through.",
    primaryLabel: "Book a 30-minute call",
    ghostLabel: "Send an email",
  },
} as const;
