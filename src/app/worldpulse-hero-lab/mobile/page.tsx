import type { Metadata } from "next";
import WorldPulseMobileLab from "@/components/worldpulse-hero-lab/WorldPulseMobileLab";

export const metadata: Metadata = {
  title: "WorldPulse Hero Lab — mobile concepts",
  robots: { index: false },
};

export default function WorldPulseMobileLabPage() {
  return <WorldPulseMobileLab />;
}
