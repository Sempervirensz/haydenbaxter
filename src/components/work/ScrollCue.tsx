"use client";

/* "Scroll to explore" — restored.
 *
 * This element was in the reference implementation and was lost in the port to
 * Next. Its copy survived (WORK_LANDING.scrollHint), its styling survived
 * (eight `.scroll-hint` rules in globals.css, including the `.is-hidden` fade),
 * and legacy/design-inspo still renders it. Only src/** stopped.
 *
 * That left the landing screen with no instruction at all: nothing highlighted,
 * a disc that did not turn, and a contents list that looked like a menu. Tapping
 * the titles was a reasonable inference from a screen that offered no other
 * affordance. This is half of the answer; WorkChapterList is the other half.
 *
 * Markup is the legacy markup exactly, because globals.css already styles all
 * three class names — this is restoring an element, not designing one.
 */

import { useEffect, useRef } from "react";
import { WORK_LANDING } from "@/data/work";

/* The same threshold the scroll hook has always computed for this and never
   had anywhere to send: hide once the visitor is 8% into the Work section. */
const HIDE_AT = 0.08;

export default function ScrollCue() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const work = document.getElementById("work");
    if (!work) return;

    /* Geometry on resize, scrollY in the frame — the pattern the rest of this
       page's scroll work has converged on. No layout read while scrolling. */
    let top = 0;
    let span = 0;
    const measure = () => {
      top = work.getBoundingClientRect().top + window.scrollY;
      span = Math.max(work.offsetHeight - window.innerHeight, 0);
    };

    let queued = false;
    const read = () => {
      queued = false;
      if (span <= 0) return;
      el.classList.toggle("is-hidden", (window.scrollY - top) / span > HIDE_AT);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    measure();
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // Work grows as its chapters mount, and a phone's URL bar collapsing
    // changes innerHeight without firing resize in some browsers.
    const ro = new ResizeObserver(measure);
    ro.observe(work);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="scroll-hint" ref={ref}>
      <div className="scroll-hint__mouse" aria-hidden="true" />
      <span className="scroll-hint__text">{WORK_LANDING.scrollHint}</span>
    </div>
  );
}
