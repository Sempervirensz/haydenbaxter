import type { Metadata } from "next";
import WorldPulseHeroLab from "@/components/worldpulse-hero-lab/WorldPulseHeroLab";

export const metadata: Metadata = {
  title: "WorldPulse Hero Lab",
};

export default function WorldPulseHeroLabPage() {
  return <WorldPulseHeroLab />;
}
