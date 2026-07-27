"use client";

// Responsive Work section switch.
//   >= 1024px  → cinematic version (WorkSectionCinematic): CD-scroll landing +
//                full-bleed cinematic project cards. UNCHANGED.
//   <  1024px  → WorkSectionMobile: the same CD-scroll landing + scroll tracks,
//                with the four APPROVED mobile card designs as the detail
//                content (WorldPulse B · Emerging Tech B · Supply Chain A ·
//                Consulting C). Replaces the legacy WorkSection here.
//
// The choice is made client-side after measuring the viewport. Until measured
// (SSR + first paint) we render an empty #work section so the nav anchor exists
// and there's no hydration mismatch; the correct version mounts on the client.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WorkSectionCinematic = dynamic(() => import("@/components/work/WorkSectionCinematic"));
const WorkSectionMobile = dynamic(() => import("@/components/work/WorkSectionMobile"));

const CINEMATIC_MIN_WIDTH = "(min-width: 1024px)";

export default function WorkSectionResponsive() {
  const [cinematic, setCinematic] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(CINEMATIC_MIN_WIDTH);
    const update = () => setCinematic(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (cinematic === null) {
    return <section id="work" className="work" aria-hidden="true" />;
  }
  return cinematic ? <WorkSectionCinematic /> : <WorkSectionMobile />;
}
