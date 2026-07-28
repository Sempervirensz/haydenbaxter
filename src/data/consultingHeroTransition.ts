// Copy + type definitions for the Consulting Hero Transition Lab.
// Keeping text and enums out of components so tweaks stay in one place.

export type TextAnimation = "cursive" | "fade" | "slide";
export type CtaStyle = "glass" | "dymo";
export type ButtonTreatment = "dymo" | "candy" | "glass";
/** How the offer dossier enters once a path is selected */
export type DossierTransition = "rise" | "expand" | "float" | "slide";

export interface HeroTransitionState {
  textAnimation: TextAnimation;
  ctaStyle: CtaStyle;
  overlayStrength: number; // 0–100 — drives blur px + dark wash
  buttonRise: number; // px — how far buttons travel upward
  buttonStagger: number; // ms — delay between buttons
  buttonTreatment: ButtonTreatment;
  dossierTransition: DossierTransition;
}

export const DEFAULT_STATE: HeroTransitionState = {
  textAnimation: "cursive",
  ctaStyle: "glass",
  overlayStrength: 55,
  buttonRise: 60,
  buttonStagger: 110,
  buttonTreatment: "candy",
  dossierTransition: "rise",
};

export const HERO_QUOTE = "The best way to predict the future is to create it.";
export const HERO_CTA_LABEL = "Let's work together";

export interface HeroPath {
  id: string;
  label: string;
  href: string;
}

export const HERO_PATHS: HeroPath[] = [
  { id: "ai", label: "AI Systems & Integration", href: "#ai-systems" },
  { id: "supply", label: "Supply Chain & Traceability", href: "#supply-chain" },
  { id: "worldpulse", label: "WorldPulse", href: "#worldpulse" },
];
