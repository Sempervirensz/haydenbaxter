import type { Metadata } from "next";
import CtaRowLab from "@/components/cta-row-lab/CtaRowLab";

// The "Let's work together" section with its three choices already on screen,
// in four iterations.
//
// The three-concept interaction explorer that used to live at this path is
// unchanged and now sits at /cta-lab/concepts.

export const metadata: Metadata = {
  title: "CTA row lab",
  description:
    "The Let's work together section with its three choices shown immediately as a small button row — DYMO, rule, glass and editorial iterations.",
  robots: { index: false, follow: false },
};

export default function CtaLabPage() {
  return <CtaRowLab />;
}
