export type HeroVariant = "cinematicThesis" | "handwrittenPrelude" | "labGateway" | "strategyStudio";
export type RevealTrigger = "click" | "scroll";
export type RevealAnimation = "slideUp" | "fade" | "stagger";
export type PathLayout = "vertical" | "horizontal" | "staggered";
export type TypographyMode = "editorial" | "modern" | "monoAccented" | "handwrittenMixed";
export type TextPosition = "upperCenter" | "center";

export interface ServicePath {
  id: "ai" | "supply" | "traceability";
  title: string;
  descriptor?: string;
}

export interface HeroLabState {
  variant: HeroVariant;
  thesisLine: string;
  supportLineEnabled: boolean;
  supportLineText: string;
  buttonLabel: string;
  revealTrigger: RevealTrigger;
  revealAnimation: RevealAnimation;
  pathLayout: PathLayout;
  featuredAIPath: boolean;
  typographyMode: TypographyMode;
  textPosition: TextPosition;
  overlayDarkness: number;
  motionIntensity: number;
}

export interface VariantPreset {
  thesisLine: string;
  supportLineEnabled: boolean;
  supportLineText: string;
  buttonLabel: string;
}

export const HERO_VARIANTS: readonly HeroVariant[] = [
  "cinematicThesis",
  "handwrittenPrelude",
  "labGateway",
  "strategyStudio",
] as const;

export const HERO_VARIANT_LABELS: Record<HeroVariant, string> = {
  cinematicThesis: "1. Cinematic Thesis",
  handwrittenPrelude: "2. Handwritten Prelude",
  labGateway: "3. Lab Gateway",
  strategyStudio: "4. Strategy Studio",
};

export const REVEAL_TRIGGER_OPTIONS: readonly RevealTrigger[] = ["click", "scroll"] as const;
export const REVEAL_TRIGGER_LABELS: Record<RevealTrigger, string> = {
  click: "Click",
  scroll: "Scroll",
};

export const REVEAL_ANIMATION_OPTIONS: readonly RevealAnimation[] = ["slideUp", "fade", "stagger"] as const;
export const REVEAL_ANIMATION_LABELS: Record<RevealAnimation, string> = {
  slideUp: "Slide-Up",
  fade: "Fade",
  stagger: "Stagger",
};

export const PATH_LAYOUT_OPTIONS: readonly PathLayout[] = ["vertical", "horizontal", "staggered"] as const;
export const PATH_LAYOUT_LABELS: Record<PathLayout, string> = {
  vertical: "Vertical",
  horizontal: "Horizontal",
  staggered: "Staggered",
};

export const TYPOGRAPHY_OPTIONS: readonly TypographyMode[] = [
  "editorial",
  "modern",
  "monoAccented",
  "handwrittenMixed",
] as const;
export const TYPOGRAPHY_LABELS: Record<TypographyMode, string> = {
  editorial: "Editorial",
  modern: "Modern",
  monoAccented: "Mono-Accented",
  handwrittenMixed: "Handwritten Mixed",
};

export const TEXT_POSITION_OPTIONS: readonly TextPosition[] = ["upperCenter", "center"] as const;
export const TEXT_POSITION_LABELS: Record<TextPosition, string> = {
  upperCenter: "Upper-Center",
  center: "Center",
};

export const VARIANT_PRESETS: Record<HeroVariant, VariantPreset> = {
  cinematicThesis: {
    thesisLine: "From ambiguity to operational clarity.",
    supportLineEnabled: false,
    supportLineText: "",
    buttonLabel: "Reveal Paths",
  },
  handwrittenPrelude: {
    thesisLine: "I sketch what systems are trying to say.",
    supportLineEnabled: true,
    supportLineText: "Then we shape it into practical decisions.",
    buttonLabel: "See Directions",
  },
  labGateway: {
    thesisLine: "Enter the operating layer.",
    supportLineEnabled: true,
    supportLineText: "Choose a route into prototype, operations, or product intelligence.",
    buttonLabel: "Open Gateway",
  },
  strategyStudio: {
    thesisLine: "A strategy studio for decisions that need to ship.",
    supportLineEnabled: true,
    supportLineText: "Applied AI, supply-chain systems, and traceability strategy.",
    buttonLabel: "View Service Paths",
  },
};

export const DEFAULT_PATHS: ServicePath[] = [
  { id: "ai", title: "AI Strategy & Prototypes", descriptor: "Practical concepts and lightweight prototypes." },
  { id: "supply", title: "Supply Chain Advisory", descriptor: "Operational clarity across complex systems." },
  { id: "traceability", title: "Traceability & DPP", descriptor: "Transparency strategy tied to real product experience." },
];

export const DEFAULT_HERO_LAB_STATE: HeroLabState = {
  variant: "cinematicThesis",
  thesisLine: VARIANT_PRESETS.cinematicThesis.thesisLine,
  supportLineEnabled: VARIANT_PRESETS.cinematicThesis.supportLineEnabled,
  supportLineText: VARIANT_PRESETS.cinematicThesis.supportLineText,
  buttonLabel: VARIANT_PRESETS.cinematicThesis.buttonLabel,
  revealTrigger: "click",
  revealAnimation: "slideUp",
  pathLayout: "horizontal",
  featuredAIPath: true,
  typographyMode: "editorial",
  textPosition: "center",
  overlayDarkness: 58,
  motionIntensity: 65,
};
