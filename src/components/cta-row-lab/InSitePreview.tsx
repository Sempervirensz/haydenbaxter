"use client";

// The real page tree, with the Consulting chapter opted in to the row.
//
// Section order and components are the homepage's own — see src/app/page.tsx.
// The only differences are the provider wrapping the tree and the absent
// soft-lock gate, so the Work stack is reachable by scrolling.

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import PersonasSection from "@/components/PersonasSection";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import { CtaVariantProvider } from "@/components/work/CtaVariant";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export default function InSitePreview() {
  return (
    <CtaVariantProvider value="row">
      <main>
        <HeroSection />
        <BrandsCarousel />
        <WorkSection />
        <PersonasSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
        <SiteFooter />
      </main>
    </CtaVariantProvider>
  );
}
