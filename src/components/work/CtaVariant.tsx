"use client";

// Which CTA the Consulting chapter renders.
//
// Exists so the row prototype can be viewed INSIDE the real page — surrounded
// by the Work stack, Personas, Connect and the rest — without forking the page
// tree or touching what ships.
//
// The default is "live", so every existing consumer, the homepage included,
// behaves exactly as before: no provider, no change. Only a route that
// explicitly wraps its tree in <CtaVariantProvider value="row"> sees the
// prototype, and the only such route is /cta-lab/in-site.

import { createContext, useContext } from "react";

export type CtaVariant = "live" | "row";

const Ctx = createContext<CtaVariant>("live");

export const CtaVariantProvider = Ctx.Provider;

export function useCtaVariant(): CtaVariant {
  return useContext(Ctx);
}
