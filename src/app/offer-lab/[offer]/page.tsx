import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OfferPage from "@/components/offer-lab/OfferPage";
import { PATHS, getPath, type PathId } from "@/data/offerLab";
import type { OfferLayoutId, OfferSurfaceId } from "@/data/offerLab";

// Each offer as its own route — the structural alternative to the in-card
// panel. Real URL, real history, shareable, indexable, one scroll.
//
// `output: "export"` outside dev means every param has to be enumerated, which
// is exactly the point: three offers, three pages, all statically rendered.

export function generateStaticParams() {
  return PATHS.map((p) => ({ offer: p.id }));
}

const VALID = new Set<string>(PATHS.map((p) => p.id));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ offer: string }>;
}): Promise<Metadata> {
  const { offer } = await params;
  if (!VALID.has(offer)) return { title: "Offer" };
  const d = getPath(offer as PathId).destination;
  return {
    title: `${d.title} — offer lab`,
    description: d.lede,
    robots: { index: false, follow: false },
  };
}

export default async function OfferRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ offer: string }>;
  searchParams: Promise<{ layout?: string; surface?: string }>;
}) {
  const { offer } = await params;
  if (!VALID.has(offer)) notFound();

  // Layout and surface ride in the query string so a specific treatment can be
  // linked and compared without rebuilding — the lab's own switcher writes it.
  const sp = await searchParams;
  const layout = (sp.layout ?? "editorial") as OfferLayoutId;
  const surface = (sp.surface ?? "dark") as OfferSurfaceId;

  const path = getPath(offer as PathId);
  const qs = `?layout=${layout}&surface=${surface}`;

  return (
    <OfferPage
      path={path}
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
