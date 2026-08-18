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
import {
  DEFAULT_CHROME,
  DEFAULT_DIRECTION,
  OFFER_TEMPLATE_MODES,
  isChrome,
  isDirection,
  type OfferTemplateModeId,
} from "@/data/offerDirections";

const LAYOUTS = new Set(OFFER_LAYOUTS.map((l) => l.id));
const SURFACES = new Set(OFFER_SURFACES.map((s) => s.id));
const TEMPLATE_MODES = new Set<string>(OFFER_TEMPLATE_MODES.map((m) => m.id));

export default function OfferRouteClient({ offer }: { offer: PathId }) {
  const sp = useSearchParams();

  // Validate rather than trust: these land in `data-` attributes that drive
  // every layout rule, and an unknown value would silently style nothing.
  const rawLayout = sp.get("layout") ?? "";
  const rawSurface = sp.get("surface") ?? "";
  const rawDirection = sp.get("direction") ?? "";
  const rawTemplate = sp.get("template") ?? "";
  const rawChrome = sp.get("chrome") ?? "";

  const layout = (LAYOUTS.has(rawLayout as OfferLayoutId) ? rawLayout : "editorial") as OfferLayoutId;
  const surface = (SURFACES.has(rawSurface as OfferSurfaceId) ? rawSurface : "dark") as OfferSurfaceId;
  const direction = isDirection(rawDirection) ? rawDirection : DEFAULT_DIRECTION;
  const chrome = isChrome(rawChrome) ? rawChrome : DEFAULT_CHROME;
  const templateMode = (
    TEMPLATE_MODES.has(rawTemplate) ? rawTemplate : "perOffer"
  ) as OfferTemplateModeId;

  // Every axis rides in the query string, so a specific treatment stays
  // linkable while it is still being argued about — and moving sideways to a
  // sibling offer keeps the treatment you were looking at.
  const qs =
    `?direction=${direction}&template=${templateMode}&chrome=${chrome}` +
    `&layout=${layout}&surface=${surface}`;

  return (
    <OfferPage
      path={getPath(offer)}
      direction={direction}
      layout={layout}
      surface={surface}
      templateMode={templateMode}
      chrome={chrome}
      qs={qs}
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
