import type { HeroVariant } from "@/data/consultingHeroLab";

export interface VariantDefinition {
  heroClass: string;
  showDescriptorByDefault: boolean;
}

export const VARIANT_DEFINITIONS: Record<HeroVariant, VariantDefinition> = {
  cinematicThesis: {
    heroClass: "is-cinematic",
    showDescriptorByDefault: false,
  },
  handwrittenPrelude: {
    heroClass: "is-handwritten",
    showDescriptorByDefault: false,
  },
  labGateway: {
    heroClass: "is-gateway",
    showDescriptorByDefault: true,
  },
  strategyStudio: {
    heroClass: "is-studio",
    showDescriptorByDefault: true,
  },
};
