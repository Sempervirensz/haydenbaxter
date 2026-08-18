"use client";

// Reads `?layout=` and `?surface=` at runtime.
//
// This has to be a CLIENT read, not a server one. `next.config.ts` sets
// `output: "export"` outside dev, and a statically exported route cannot
// `await searchParams` — the build fails outright with `dynamic = "error"`.
// Prerendering the page and reading the query string after hydration keeps the
// treatment deep-linkable without making the route dynamic.
//
// `useSearchParams` suspends during prerender, so the caller must wrap this in
// a <Suspense> boundary or the build fails a second, different way.

import { useSearchParams } from "next/navigation";
import OfferPage from "./OfferPage";
import {
  OFFER_LAYOUTS,
  OFFER_SURFACES,
  PATHS,
  getPath,
  type OfferLayoutId,
  type OfferSurfaceId,
  type PathId,
} from "@/data/offerLab";

const LAYOUTS = new Set(OFFER_LAYOUTS.map((l) => l.id));
const SURFACES = new Set(OFFER_SURFACES.map((s) => s.id));

export default function OfferRouteClient({ offer }: { offer: PathId }) {
  const sp = useSearchParams();

  // Validate rather than trust: these land in `data-` attributes that drive
  // every layout rule, and an unknown value would silently style nothing.
  const rawLayout = sp.get("layout") ?? "";
  const rawSurface = sp.get("surface") ?? "";
  const layout = (LAYOUTS.has(rawLayout as OfferLayoutId) ? rawLayout : "editorial") as OfferLayoutId;
  const surface = (SURFACES.has(rawSurface as OfferSurfaceId) ? rawSurface : "dark") as OfferSurfaceId;

  const qs = `?layout=${layout}&surface=${surface}`;

  return (
    <OfferPage
      path={getPath(offer)}
      layout={layout}
      surface={surface}
      backHref={`/cta-lab/in-site${qs}`}
      backLabel="Back to the site"
      siblings={PATHS.filter((p) => p.id !== offer).map((p) => ({
        id: p.id,
        label: p.label,
        href: `/offer-lab/${p.id}${qs}`,
      }))}
    />
  );
}
