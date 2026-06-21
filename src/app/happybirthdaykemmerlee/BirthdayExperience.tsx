/* TEMPORARY BIRTHDAY PAGE: remove after Kemmerlee's birthday.
   Client-side magical experience for /happybirthdaykemmerlee. */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Pass from "./Pass";

type Star = {
  top: string;
  left: string;
  size: number;
  dur: string;
  delay: string;
  gold: boolean;
};

export default function BirthdayExperience() {
  const [mounted, setMounted] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Generate the starfield only after mount to avoid SSR hydration mismatch.
  useEffect(() => setMounted(true), []);

  const stars = useMemo<Star[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: 70 }, () => {
      const size = Math.random() * 2.2 + 0.8;
      return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size,
        dur: `${Math.random() * 3 + 2.5}s`,
        delay: `${Math.random() * 4}s`,
        gold: Math.random() > 0.82,
      };
    });
  }, [mounted]);

  const openPass = useCallback(() => setPassOpen(true), []);

  const printPass = useCallback(() => {
    try {
      window.print();
    } catch {
      /* printing is best-effort; the on-screen pass still works */
    }
  }, []);

  const closePass = useCallback(() => {
    setPassOpen(false);
    ctaRef.current?.focus();
  }, []);

  // ESC closes the pass; focus the close button when it opens.
  useEffect(() => {
    if (!passOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePass();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [passOpen, closePass]);

  return (
    <main className="bk-root">
      <div className="bk-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className={`bk-star${s.gold ? " bk-star--gold" : ""}`}
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ["--dur" as string]: s.dur,
              ["--delay" as string]: s.delay,
            }}
          />
        ))}
      </div>

      <div className="bk-glow bk-glow--moon" aria-hidden="true" />
      <div className="bk-glow bk-glow--planet" aria-hidden="true" />

      <section className="bk-stage">
        <img
          className="bk-card bk-card--float"
          src="/images/happy-birthday-kemmerlee.png"
          alt="Happy 8th Birthday Kemmerlee Bea Parkinson celestial birthday card"
          width={978}
          height={1608}
        />

        <p className="bk-subtitle">Your birthday adventure begins among the stars.</p>

        <div className="bk-portal" aria-hidden="true">
          <video
            src="/images/kemmerlee-stars.mp4"
            poster="/images/kemmerlee-stars-poster.png"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <button
          ref={ctaRef}
          type="button"
          className="bk-cta"
          onClick={openPass}
        >
          Explore the Universe at Clark Planetarium
        </button>
      </section>

      {passOpen && (
        <div
          className="bk-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Kemmerlee's Birthday Planetarium Adventure pass"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePass();
          }}
        >
          <div>
            <Pass />
            <div className="bk-pass__actions">
              <button
                type="button"
                className="bk-pass__btn bk-pass__btn--print"
                onClick={printPass}
              >
                Print my pass
              </button>
              <button
                ref={closeRef}
                type="button"
                className="bk-pass__btn"
                onClick={closePass}
              >
                Back to the stars
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print-only pass — kept out of the screen flow, revealed by @media print. */}
      <div className="bk-print" aria-hidden="true">
        <Pass />
      </div>
    </main>
  );
}
