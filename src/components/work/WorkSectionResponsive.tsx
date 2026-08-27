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
import { useEffect, useRef, useState } from "react";

const WorkSectionCinematic = dynamic(() => import("@/components/work/WorkSectionCinematic"));
const WorkSectionMobile = dynamic(() => import("@/components/work/WorkSectionMobile"));

const CINEMATIC_MIN_WIDTH = "(min-width: 1024px)";

export default function WorkSectionResponsive() {
  const [cinematic, setCinematic] = useState<boolean | null>(null);
  const shellRef = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(CINEMATIC_MIN_WIDTH);
    const update = () => setCinematic(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Both branches are dynamic imports pulling heavy children — a three.js
   * globe among them. Behind the closed entry gate they are invisible, but
   * `display: none` stops pixels, not React mounting and not the network, so
   * they used to cost their full download and mount before anyone could flip
   * a card.
   *
   * Two triggers, whichever comes first:
   *
   *   idle after load — the normal path. The load event has already fired, so
   *     this is off the critical path, and it lands seconds before anyone
   *     finishes flipping four cards. Arming ONLY on visibility (measured)
   *     moves the mount to the exact moment the gate opens and the visitor
   *     starts scrolling: worst scroll frame 168ms, against 33ms when the
   *     section was already mounted.
   *
   *   intersection — the safety net, for the skip-ahead link and for any path
   *     that reaches Work before idle ever fires.
   *
   * The DOM is untouched either way: the shell and every sibling section
   * render exactly as before, so the crawler payload is unchanged. */
  useEffect(() => {
    if (armed) return;
    const el = shellRef.current;
    let idleHandle: number | undefined;
    let timer: number | undefined;

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };

    const armOnIdle = () => {
      // Safari has no requestIdleCallback; a timeout is the documented stand-in.
      if (w.requestIdleCallback) idleHandle = w.requestIdleCallback(() => setArmed(true), { timeout: 4000 });
      else timer = window.setTimeout(() => setArmed(true), 1500);
    };

    if (document.readyState === "complete") armOnIdle();
    else window.addEventListener("load", armOnIdle, { once: true });

    const io = el
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) setArmed(true);
          },
          { rootMargin: "400px" }
        )
      : null;
    if (el && io) io.observe(el);

    return () => {
      window.removeEventListener("load", armOnIdle);
      if (idleHandle !== undefined) w.cancelIdleCallback?.(idleHandle);
      if (timer !== undefined) window.clearTimeout(timer);
      io?.disconnect();
    };
  }, [armed]);

  if (cinematic === null || !armed) {
    return <section ref={shellRef} id="work" className="work" aria-hidden="true" />;
  }
  return cinematic ? <WorkSectionCinematic /> : <WorkSectionMobile />;
}
