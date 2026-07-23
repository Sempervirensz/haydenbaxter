import type { Metadata } from "next";
import NarrativeLab from "@/components/NarrativeLab";

export const metadata: Metadata = {
  title: "Narrative Lab",
  description: "Compare multiple homepage narrative directions without changing production homepage.",
};

export default function NarrativeLabPage() {
  return <NarrativeLab />;
}
