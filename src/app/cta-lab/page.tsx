import type { Metadata } from "next";
import CtaLab from "@/components/cta-lab/CtaLab";

export const metadata: Metadata = {
  title: "CTA Interaction Lab",
  description:
    "Isolated lab for the final-section CTA — three concepts branching Advisory & Partnerships from Profile & Experience.",
  robots: { index: false, follow: false },
};

export default function CtaLabPage() {
  return <CtaLab />;
}
