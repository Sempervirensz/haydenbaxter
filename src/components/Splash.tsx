"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SPLASH_WORDS } from "@/data/siteContent";

const INTERVAL = 320; // ms between words
const FINAL_HOLD = 5200; // extra ms to linger on the last (instruction) word
const PAUSE_AFTER = 1500; // ms after last word before fade
const FADE_DURATION = 700; // ms for the overlay to fade out

// Routes where the splash should never appear (standalone previews, embeds, etc.)
const NO_SPLASH_ROUTES = [
  "/procurebridge-preview",
  "/emerging-tech-builds",
  "/atomicos-preview",
  "/lab/scroll",
  "/cta-lab",
  "/consulting-paths-lab",
  "/offer-lab",
];

export default function Splash() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splash = ref.current;
    if (!splash) return;

    // Non-null alias so TypeScript knows it survives closures
    const el = splash;

    // Skip splash entirely on preview/embed routes
    if (NO_SPLASH_ROUTES.some((route) => pathname.startsWith(route))) {
      el.remove();
      return;
    }

    // Respect reduced-motion: skip animation, quick fade
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.classList.add("is-fading");
      // Don't physically remove from DOM — that breaks React reconciliation
      // on client-side route changes (Splash is rendered by RootLayout, so
      // React still has it in its tree). Hide via class instead.
      el.classList.add("is-hidden");
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

      // All words shown — pause, then fade out. Don't .remove() the node —
      // see comment above; CSS handles visibility once is-fading lands.
      setTimeout(() => {
        el.classList.add("is-fading");
        setTimeout(() => el.classList.add("is-hidden"), FADE_DURATION);
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
