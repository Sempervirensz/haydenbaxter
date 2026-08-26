import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import PersonasSection from "@/components/PersonasSection";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import EntryCtaLab from "@/components/entry-cta-lab/EntryCtaLab";

// Lab for the entry route chooser — Story Mode vs. Business Mode beneath the
// deck. Composition is src/app/page.tsx verbatim, with EntryCtaLab standing in
// for SoftLockGate — same hero, same deck, same gated sections in the same
// order, so what's reviewed is the real homepage and not an approximation of it.
// The Work section has to be here in full because Business Mode routes into its
// Consulting chapter.
//
// The production homepage is untouched; this route is where the idea lives until
// it is approved.
const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export const metadata: Metadata = {
  title: "Entry route chooser — Story Mode vs. Business Mode",
  robots: { index: false },
};

export default function EntryCtaLabPage() {
  return (
    <main>
      <HeroSection />
      <EntryCtaLab>
        <BrandsCarousel />
        <WorkSection />
        <PersonasSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
        <SiteFooter />
      </EntryCtaLab>
    </main>
  );
}
