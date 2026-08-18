"use client";

// Which CTA the Consulting chapter renders, and what its choices open into.
//
// Exists so the row prototype can be viewed INSIDE the real page — surrounded
// by the Work stack, Personas, Connect and the rest — without forking the page
// tree or touching what ships.
//
// The default is `variant: "live"`, so every existing consumer, the homepage
// included, behaves exactly as before: no provider, no change. Only a route
// that explicitly wraps its tree in <CtaVariantProvider> sees the prototype,
// and the only such route is /cta-lab/in-site.

import { createContext, useContext } from "react";
import type { OfferLayoutId, OfferSurfaceId } from "@/data/offerLab";

export interface CtaVariantConfig {
  variant: "live" | "row";
  /**
   * Which screen a choice opens into. `null` keeps the production dossier
   * panel that ships today; a layout id swaps in the offer-lab screen, so the
   * row and the offer page can be judged as one flow.
   */
  offerLayout: OfferLayoutId | null;
  offerSurface: OfferSurfaceId;
  /**
   * When set, the three choices become links to real offer routes instead of
   * disclosure buttons. This is the structural fork: panel-in-a-card versus
   * page-with-an-address.
   */
  offerHref: ((id: string) => string) | null;
}

const DEFAULT: CtaVariantConfig = {
  variant: "live",
  offerLayout: null,
  offerSurface: "dark",
  offerHref: null,
};

const Ctx = createContext<CtaVariantConfig>(DEFAULT);

export const CtaVariantProvider = Ctx.Provider;

export function useCtaVariant(): CtaVariantConfig {
  return useContext(Ctx);
}
