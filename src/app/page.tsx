import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import CardDeck from "@/components/CardDeck";
import BrandsCarousel from "@/components/BrandsCarousel";

const WorkSection = dynamic(() => import("@/components/WorkSection"));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className="bg-[#0a0a0a] relative pb-8">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
        />
        <CardDeck />
      </section>
      <BrandsCarousel />
      <WorkSection />
    </main>
  );
}
