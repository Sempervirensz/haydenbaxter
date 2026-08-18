"use client";

// The CTA row as it would sit inside the real Consulting card.
//
// Same composition as the lab stage — same markup, same skin, same wiring to
// the production destination screens — just without the lab's own frame, so
// the host card supplies the rounded edge, the height and the shadow. Used
// only by /cta-lab/in-site.
//
// The photo is passed IN and rendered inside `.ctar` for the same reason
// WorkTogether takes a `media` prop: `.ctar` is the backdrop root its blur
// ladder samples, and a host-painted photo would sit outside it.

import { useState } from "react";
import { DEFAULT_ACCENT, DEFAULT_VARIANT, type PathId } from "@/data/ctaRowLab";
import type { OfferLayoutId, OfferSurfaceId } from "@/data/offerLab";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import CtaRowStage from "./CtaRowStage";
import "@/components/work/work-together.css";
import "./cta-row-lab.css";

export default function CtaRowInline({
  media,
  offerLayout = null,
  offerSurface = "dark",
}: {
  media: React.ReactNode;
  offerLayout?: OfferLayoutId | null;
  offerSurface?: OfferSurfaceId;
}) {
  const [openId, setOpenId] = useState<PathId | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <CtaRowStage
      variant={DEFAULT_VARIANT}
      accent={DEFAULT_ACCENT}
      width="desktop"
      reducedMotion={reducedMotion}
      openId={openId}
      onOpenChange={setOpenId}
      primary
      media={media}
      frame={false}
      offerLayout={offerLayout}
      offerSurface={offerSurface}
    />
  );
}
