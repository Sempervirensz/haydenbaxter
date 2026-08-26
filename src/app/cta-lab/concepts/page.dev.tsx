import type { Metadata } from "next";
import CtaLab from "@/components/cta-lab/CtaLab";

// The three-concept CTA interaction explorer (Rail / Split / Fold). It was at
// /cta-lab until the direct-row prototype took that path; nothing about the lab
// itself changed. Still under the /cta-lab prefix, so the noindex allowlist in
// src/data/site.ts covers it without an edit.

export const metadata: Metadata = {
  title: "CTA Interaction Lab",
  description:
    "Isolated lab for the final-section CTA — three concepts branching the Let's work together interaction.",
  robots: { index: false, follow: false },
};

export default function CtaLabConceptsPage() {
  return <CtaLab />;
}
