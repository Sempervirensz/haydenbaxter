import type { Metadata } from "next";
import CredibilityLab from "@/components/credibility-lab/CredibilityLab";

export const metadata: Metadata = {
  title: "Credibility Lab | Hayden Baxter",
  description: "Homepage proof, recommendation, and FAQ concepts in the current site context.",
  robots: { index: false, follow: false },
};

export default function CredibilityLabPage() {
  return <CredibilityLab />;
}
