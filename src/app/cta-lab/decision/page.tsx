import type { Metadata } from "next";
import CtaDecision from "@/components/cta-decision/CtaDecision";

// A first-screen decision interface: one person, three ways in.
//
// ROUTE NOTE: the brief asked for `/cta-lab`, but that route is already a
// working lab — `src/app/cta-lab/page.tsx` plus `concepts/` and `in-site/`,
// backed by fourteen files under `src/components/cta-lab/`, and it is the
// explorer that produced the CTA row now in production. Writing over it would
// have broken the brief's own rule against altering existing experiences, so
// this sits alongside it as a sibling segment instead.
//
// `/cta-lab` is already listed in NON_PUBLIC_PREFIXES (src/data/site.ts) and in
// Splash's NO_SPLASH_ROUTES, both of which match by prefix, so this route is
// noindexed and splash-free without either file being touched.

export const metadata: Metadata = {
  title: "Decision lab — one person, three ways in",
  description:
    "An experimental first-screen decision interface for choosing between consulting, WorldPulse, and experience.",
  robots: { index: false, follow: false },
};

export default function CtaDecisionPage() {
  return <CtaDecision />;
}
