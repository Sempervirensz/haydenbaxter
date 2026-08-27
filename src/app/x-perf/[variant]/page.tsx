import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PerfStage from "@/components/x-perf/PerfStage";
import { PERF_VARIANTS } from "@/data/perfLab";
import "@/components/x-perf/perf-lab.css";

/* Deliberately a REAL route, not page.dev.tsx.
 *
 * Every other lab was made dev-only on 2026-08-26 because labs were shipping
 * and indexable. This one has to ship: it exists to be measured on a real phone
 * on real cellular, which is the one environment that reproduced the problem and
 * the one no local test could reach. It is noindex/nofollow, absent from the
 * sitemap, and should be deleted once the question is settled. */
export const metadata: Metadata = {
  title: "Load lab",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return PERF_VARIANTS.map((v) => ({ variant: v.id }));
}

export default async function PerfVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (!PERF_VARIANTS.some((v) => v.id === variant)) notFound();
  return <PerfStage variant={variant} />;
}
