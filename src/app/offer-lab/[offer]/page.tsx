import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import OfferRouteClient from "@/components/offer-lab/OfferRouteClient";
import { PATHS, getPath, type PathId } from "@/data/offerLab";

// Each offer as its own route — the structural alternative to the in-card
// panel. Real URL, real history, shareable, one scroll.
//
// `output: "export"` outside dev means every param is enumerated here, which
// is the point: three offers, three static pages. It ALSO means this page must
// not read `searchParams` — a statically exported route cannot, and the build
// fails with `dynamic = "error"`. Layout and surface are therefore read on the
// client, inside the Suspense boundary `useSearchParams` requires.

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
}: {
  params: Promise<{ offer: string }>;
}) {
  const { offer } = await params;
  if (!VALID.has(offer)) notFound();

  return (
    <Suspense fallback={null}>
      <OfferRouteClient offer={offer as PathId} />
    </Suspense>
  );
}
