"use client";

import { useEffect, useRef } from "react";
import { SPLASH_WORDS } from "@/data/siteContent";

const INTERVAL = 320; // ms between words
const FINAL_HOLD = 1400; // extra ms to linger on the last (CTA) word
const PAUSE_AFTER = 1000; // ms after last word before fade
const FADE_DURATION = 700; // ms for the overlay to fade out

export default function Splash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splash = ref.current;
    if (!splash) return;

    // Non-null alias so TypeScript knows it survives closures
    const el = splash;

    // Respect reduced-motion: skip animation, quick fade
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.classList.add("is-fading");
      setTimeout(() => el.remove(), 100);
      return;
    }

    const words = el.querySelectorAll<HTMLSpanElement>(".splash__word");
    let i = 0;

    function showNext() {
      // Keep the final (CTA) word on screen through the pause + fade —
      // only hide the previous word when advancing between greetings.
      if (i > 0 && i < words.length) words[i - 1].classList.remove("is-visible");

      if (i < words.length) {
        words[i].classList.add("is-visible");
        i += 1;
        // Linger longer on the final CTA before starting the fade sequence.
        const delay = i === words.length ? INTERVAL + FINAL_HOLD : INTERVAL;
        setTimeout(showNext, delay);
        return;
      }

      // All words shown — pause, then fade out
      setTimeout(() => {
        el.classList.add("is-fading");
        setTimeout(() => el.remove(), FADE_DURATION);
      }, PAUSE_AFTER);
    }

    setTimeout(showNext, 200);
  }, []);

  return (
    <div ref={ref} className="splash" id="splash" aria-hidden="true">
      {SPLASH_WORDS.map((word) => (
        <span key={word} className="splash__word">
          {word}
        </span>
      ))}
    </div>
  );
}
