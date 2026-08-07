import type { Metadata } from "next";
import PersonasLab from "@/components/personas-lab/PersonasLab";

export const metadata: Metadata = {
  title: "Personas Lab",
  description:
    "Four glass directions for the Personas section, each expandable on hover, focus and tap.",
  robots: { index: false, follow: false },
};

export default function PersonasLabPage() {
  return <PersonasLab />;
}
