"use client";

// 04 — Consulting, desktop (≥1024px). The cityscape plus the "Let's work
// together" interaction.
//
// Replaces the previous three-state Stage (cursive quote → frosted wash →
// candy path buttons → offer dossier). That flow asked visitors to pick a
// capability — AI / Supply Chain / WorldPulse — before they could understand
// the offer or make contact. `WorkTogether` asks instead which of the three
// reasons someone actually came, and answers each with one complete screen.
//
// The photo is passed IN to WorkTogether rather than rendered behind it, so it
// sits inside the backdrop root its blur ladder samples.

import WorkTogether from "@/components/work/WorkTogether";
import "@/components/work/work-together.css";

/** Production swaps to the portrait crop at ≤640px — both are committed. */
const HERO_WIDE = "/consulting/hero-2.png";
const HERO_NARROW = "/consulting/mobile-statue.png";

const ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

export default function ConsultingHeroStage({ isActive }: { isActive?: boolean }) {
  return (
    <section className="cns-photo cns-photo--hero cns-stage">
      <WorkTogether
        isActive={isActive}
        media={
          <>
            <picture>
              <source media="(max-width: 640px)" srcSet={HERO_NARROW} />
              <img className="cns-stage__img" src={HERO_WIDE} alt={ALT} />
            </picture>
            <span className="cns-stage__vignette" aria-hidden="true" />
          </>
        }
      />
    </section>
  );
}
