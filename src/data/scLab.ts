// ---------------------------------------------------------------------------
// Supply Chain Lab — isolated data for prototyping
// ---------------------------------------------------------------------------

// --- Variant IDs ---
export const SC_LAB_VARIANTS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;
export type SCLabVariant = (typeof SC_LAB_VARIANTS)[number];

// --- Text Treatment Modes ---
export const TEXT_MODES = [
  "static",
  "cycle",
  "typewriter",
  "glow",
  "stagger",
  "dossier",
] as const;
export type TextMode = (typeof TEXT_MODES)[number];

// --- Globe Storytelling Modes ---
export const GLOBE_MODES = [
  "geographic-anchor",
  "network-visualizer",
  "scale-contrast",
  "text-driven",
] as const;
export type GlobeMode = (typeof GLOBE_MODES)[number];

// --- Region coordinates for globe storytelling ---
export const REGION_COORDS = {
  china: [104, 35] as [number, number],
  vietnam: [108, 14] as [number, number],
  indonesia: [113, -2] as [number, number],
};
export const ASIA_PACIFIC_CENTER: [number, number] = [105, 15];
export const NETWORK_ARCS = [
  { from: "china" as const, to: "vietnam" as const },
  { from: "china" as const, to: "indonesia" as const },
  { from: "vietnam" as const, to: "indonesia" as const },
];

// --- Globe choreography per quote line ---
export interface GlobeCue {
  rotation: [number, number]; // target [lon, lat] to center on
  zoom: number; // scale multiplier (1 = default)
  pulseDots: { coords: [number, number]; label: string }[]; // regions to pulse + label
  arcs: { from: [number, number]; to: [number, number] }[]; // arcs to draw
  arcProgress: number; // 0–1, how much of arcs to reveal
  intensity: number; // 0–1, overall globe brightness/energy
}

export const GLOBE_CHOREOGRAPHY: GlobeCue[] = [
  // Line 0: "Fortune 100 sourcing leader." — full world, slow rotate, global scale
  {
    rotation: [30, 10],
    zoom: 1,
    pulseDots: [],
    arcs: [],
    arcProgress: 0,
    intensity: 0.4,
  },
  // Line 1: "8+ YEARS ACROSS ASIA." — rotate to Asia-Pacific, region brightens
  {
    rotation: [105, 15],
    zoom: 1.15,
    pulseDots: [
      { coords: REGION_COORDS.china, label: "CHINA" },
      { coords: REGION_COORDS.vietnam, label: "VIETNAM" },
      { coords: REGION_COORDS.indonesia, label: "INDONESIA" },
    ],
    arcs: [],
    arcProgress: 0,
    intensity: 0.7,
  },
  // Line 2: "Fluent in Mandarin." — zoom into China, China pulses bright
  {
    rotation: [104, 35],
    zoom: 1.6,
    pulseDots: [
      { coords: REGION_COORDS.china, label: "CHINA" },
    ],
    arcs: [],
    arcProgress: 0,
    intensity: 0.9,
  },
  // Line 3: "Built supplier networks across China, Vietnam, and Indonesia."
  // Network arcs draw on, all 3 countries pulse
  {
    rotation: [108, 10],
    zoom: 1.3,
    pulseDots: [
      { coords: REGION_COORDS.china, label: "CHINA" },
      { coords: REGION_COORDS.vietnam, label: "VIETNAM" },
      { coords: REGION_COORDS.indonesia, label: "INDONESIA" },
    ],
    arcs: [
      { from: REGION_COORDS.china, to: REGION_COORDS.vietnam },
      { from: REGION_COORDS.china, to: REGION_COORDS.indonesia },
      { from: REGION_COORDS.vietnam, to: REGION_COORDS.indonesia },
    ],
    arcProgress: 1,
    intensity: 1,
  },
];

// Auto-play timing (ms per line)
export const CHOREOGRAPHY_TIMING = [3500, 3000, 2500, 4000];

// --- Journey Globe ---
export interface JourneyStop {
  id: string;
  coords: [number, number];
  /** Accomplishment headline shown as primary timeline label */
  headline: string;
  /** Short location tag shown under the headline */
  label: string;
  title: string;
  description: string;
  year: string;
}

export const JOURNEY_STOPS: JourneyStop[] = [
  {
    id: "taiwan",
    coords: [121, 23.5],
    headline: "Became fluent in Mandarin",
    label: "Taiwan",
    title: "Language & Cultural Fluency",
    description: "Taiwan gave me the language, cultural fluency, and confidence that later became a real advantage in supplier relationships and cross-border work.",
    year: "2012",
  },
  {
    id: "china",
    coords: [104, 35],
    headline: "Learned sourcing on the ground",
    label: "China",
    title: "Ground-Level Sourcing",
    description: "At Three Tree, I worked directly with manufacturers—negotiating deals, aligning specs, and visiting factories to strengthen quality and accountability.",
    year: "2016",
  },
  {
    id: "new-york",
    coords: [-74, 40.7],
    headline: "Broke into Fortune 100 procurement",
    label: "New York",
    title: "Fortune 100 Procurement",
    description: "At Disney, I worked across procurement, finance, and legal to improve vendor agreements, onboard partners, and deliver measurable savings.",
    year: "2022",
  },
  {
    id: "se-asia",
    coords: [108, 10],
    headline: "Built traceable supplier systems",
    label: "SE Asia",
    title: "Traceable Supplier Systems",
    description: "Helped onboard factories and strengthen supplier compliance, governance, and traceability across Nike's growing network in Southeast Asia.",
    year: "2023–2024",
  },
];

export const JOURNEY_ARCS = [
  { from: 0, to: 1 }, // Taiwan → China
  { from: 1, to: 2 }, // China → New York
  { from: 2, to: 3 }, // New York → SE Asia
];

// --- Motion Intensity ---
export const MOTION_LEVELS = ["full", "reduced", "off"] as const;
export type MotionLevel = (typeof MOTION_LEVELS)[number];

// --- Density ---
export const DENSITY_LEVELS = ["sparse", "normal", "dense"] as const;
export type DensityLevel = (typeof DENSITY_LEVELS)[number];

// --- Font Mode ---
export const FONT_MODES = [
  "mixed",
  "all-serif",
  "all-sans",
  "all-mono",
  "serif-sans",
  "mono-serif",
] as const;
export type FontMode = (typeof FONT_MODES)[number];

// --- Core quote lines (immutable copy) ---
export interface QuoteLine {
  text: string;
  style: "serif-heavy" | "mono-caps" | "sans-light" | "serif-italic";
}

export const CORE_QUOTE_LINES: QuoteLine[] = [
  { text: "Fortune 100 sourcing leader.", style: "serif-heavy" },
  { text: "8+ YEARS ACROSS ASIA.", style: "mono-caps" },
  { text: "Fluent in Mandarin.", style: "sans-light" },
  {
    text: "Built supplier networks across China, Vietnam, and Indonesia.",
    style: "serif-italic",
  },
];

// --- Supporting microcopy ---
export const SUPPORTING_LINES: string[] = [
  "Built where factory reality meets systems thinking.",
  "Operator depth across sourcing, governance, and supplier execution.",
  "Cross-border fluency in supply networks, data, and decision-making.",
  "From supplier onboarding to traceability logic.",
  "Turned procurement complexity into repeatable systems.",
  "Where supply chain meets product intuition.",
];

// --- Control panel state ---
export interface SCLabConfig {
  variant: SCLabVariant;
  textMode: TextMode;
  fontMode: FontMode;
  globeMode: GlobeMode;
  motionLevel: MotionLevel;
  density: DensityLevel;
  reducedMotionOverride: boolean;
}

export const DEFAULT_CONFIG: SCLabConfig = {
  variant: "A",
  textMode: "static",
  fontMode: "mixed",
  globeMode: "geographic-anchor",
  motionLevel: "full",
  density: "normal",
  reducedMotionOverride: false,
};

// --- Variant labels ---
export const VARIANT_LABELS: Record<SCLabVariant, string> = {
  A: "A \u2014 Editorial Split",
  B: "B \u2014 Globe Statement",
  C: "C \u2014 Operator Dossier",
  D: "D \u2014 Cinematic Minimal",
  E: "E \u2014 Proof Systems",
  F: "F \u2014 Signal Transmission",
  G: "G \u2014 Journey Globe",
  H: "H \u2014 Floating Card",
  I: "I \u2014 Timeline",
  J: "J \u2014 Full-Bleed",
  K: "K \u2014 Hybrid",
  L: "L \u2014 Top Nav",
};

// --- Text mode labels ---
export const TEXT_MODE_LABELS: Record<TextMode, string> = {
  static: "Static",
  cycle: "Cycle",
  typewriter: "Typewriter",
  glow: "Glow",
  stagger: "Stagger",
  dossier: "Dossier",
};

// --- Globe mode labels ---
export const GLOBE_MODE_LABELS: Record<GlobeMode, string> = {
  "geographic-anchor": "Geographic Anchor",
  "network-visualizer": "Network Visualizer",
  "scale-contrast": "Scale Contrast",
  "text-driven": "Text-Driven",
};

// --- Motion level labels ---
export const MOTION_LEVEL_LABELS: Record<MotionLevel, string> = {
  full: "Full",
  reduced: "Reduced",
  off: "Off",
};

// --- Density labels ---
export const DENSITY_LEVEL_LABELS: Record<DensityLevel, string> = {
  sparse: "Sparse",
  normal: "Normal",
  dense: "Dense",
};

// --- Font mode labels ---
export const FONT_MODE_LABELS: Record<FontMode, string> = {
  mixed: "Mixed (4 fonts)",
  "all-serif": "All Serif",
  "all-sans": "All Sans",
  "all-mono": "All Mono",
  "serif-sans": "Serif + Sans",
  "mono-serif": "Mono + Serif",
};

// --- Shared variant props ---
export interface SCLabVariantProps {
  quoteLines: QuoteLine[];
  supportingLines: string[];
  textMode: TextMode;
  fontMode: FontMode;
  globeMode: GlobeMode;
  motionLevel: MotionLevel;
  density: DensityLevel;
}
