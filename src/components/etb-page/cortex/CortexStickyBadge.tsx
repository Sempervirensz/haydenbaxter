"use client";

import { useEffect, useRef, useState } from "react";

/* The payoff for direction G. The hero mark is deliberately modest; the mark
 * earns its prominence by never leaving — once the hero has scrolled past, a
 * small circular badge pins to the corner and stays there for the length of
 * the page.
 *
 * A scroll listener rather than an IntersectionObserver: it is one rect read
 * per animation frame, it is trivially testable, and it behaves the same in
 * every browser this site has to survive. */

interface Props {
  src: string;
  name: string;
}

export default function CortexStickyBadge({ src, name }: Props) {
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchor = ref.current;
    if (!anchor) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      // The anchor is a zero-height marker left where the hero ends, so this
      // is one rect and no layout thrash.
      setPinned(anchor.getBoundingClientRect().top < 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={ref} className="cortex-badge__anchor" aria-hidden="true" />
      <div
        className="cortex-badge"
        data-pinned={pinned}
        aria-hidden="true"
        data-testid="cortex-sticky-badge"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cortex-badge__img" src={src} alt="" />
        <span className="cortex-badge__vignette" />
        <span className="cortex-badge__name">{name}</span>
      </div>
    </>
  );
}
