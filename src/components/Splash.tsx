"use client";

import { useEffect, useRef } from "react";
import { SPLASH_WORDS } from "@/data/siteContent";

const INTERVAL = 320; // ms between words
const PAUSE_AFTER = 400; // ms after last word before fade
const FADE_DURATION = 700; // ms for the overlay to fade out

export default function Splash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splash = ref.current;
    if (!splash) return;

    // Respect reduced-motion: skip animation, quick fade
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      splash.classList.add("is-fading");
      setTimeout(() => splash.remove(), 100);
      return;
    }

    const words = splash.querySelectorAll<HTMLSpanElement>(".splash__word");
    let i = 0;

    function showNext() {
      if (i > 0) words[i - 1].classList.remove("is-visible");

      if (i < words.length) {
        words[i].classList.add("is-visible");
        i += 1;
        setTimeout(showNext, INTERVAL);
        return;
      }

      // All words shown — pause, then fade out
      setTimeout(() => {
        splash.classList.add("is-fading");
        setTimeout(() => splash.remove(), FADE_DURATION);
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
