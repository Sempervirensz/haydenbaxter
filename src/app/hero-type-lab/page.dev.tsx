import type { Metadata } from "next";
import HeroTypeLab from "@/components/hero-type-lab/HeroTypeLab";

export const metadata: Metadata = {
  title: "Hero Type Lab",
  description:
    "Five size + measure iterations for the hero headline, measured live at mobile, desktop and ultrawide.",
  robots: { index: false, follow: false },
};

export default function HeroTypeLabPage() {
  return <HeroTypeLab />;
}
