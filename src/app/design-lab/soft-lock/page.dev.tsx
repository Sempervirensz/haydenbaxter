import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SoftLockGate from "@/components/design-lab/SoftLockGate";

// Mirrors the real homepage composition (see src/app/page.tsx) so the soft lock
// can be evaluated in full context. The sections after the cards are passed as
// children to SoftLockGate, which holds them back until the visitor flips all
// four cards or presses Skip — a real (but skippable) lock on every device.
const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export const metadata: Metadata = {
  title: "Soft-Lock Entry — homepage mirror (in context)",
  robots: { index: false },
};

export default function SoftLockPage() {
  return (
    <main className="dlab-mirror">
      <HeroSection />
      <SoftLockGate>
        <BrandsCarousel />
        <WorkSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
      </SoftLockGate>
    </main>
  );
}
