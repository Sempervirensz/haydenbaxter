"use client";

// Soft-lock gate. Renders the real card-deck section + the soft lock, and holds
// the rest of the page (`children`) back until the visitor flips all four cards
// OR presses Skip. This makes the lock REAL on every device (mobile included) —
// you can't scroll past the entry until you engage or skip — while staying soft
// (Skip is always right there). The gated sections are passed as children from
// the server page, so no server/client import issues.

import { useCallback, useEffect, useState } from "react";
import CardDeck from "@/components/CardDeck";
import {
  SOFT_LOCK_RELEASE,
  type SoftLockReleaseDetail,
} from "./softLockEvents";
import "./design-lab.css";

export default function SoftLockGate({ children }: { children: React.ReactNode }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [released, setReleased] = useState(false); // latches once all four flip
  const [skipped, setSkipped] = useState(false);

  const handleRevealed = useCallback((count: number) => {
    setRevealedCount(count);
    if (count >= 4) setReleased(true);
  }, []);

  // A nav link to a gated section counts as engaging with the entry — without
  // this, #work / #about / #connect silently do nothing on first load.
  const [pendingHash, setPendingHash] = useState<string | null>(null);

  useEffect(() => {
    const onRelease = (e: Event) => {
      const { hash } = (e as CustomEvent<SoftLockReleaseDetail>).detail ?? {};
      setSkipped(true);
      if (hash) setPendingHash(hash);
    };
    window.addEventListener(SOFT_LOCK_RELEASE, onRelease);
    return () => window.removeEventListener(SOFT_LOCK_RELEASE, onRelease);
  }, []);

  const open = released || skipped;

  // Runs after the commit that removes `display: none`, so the target is laid
  // out and scrollable — no polling or rAF needed (rAF wouldn't fire at all if
  // the tab were backgrounded).
  useEffect(() => {
    if (!open || !pendingHash) return;
    const target = document.querySelector(pendingHash);
    setPendingHash(null);
    if (!target) return;
    target.scrollIntoView({ behavior: "auto", block: "start" });
    history.replaceState(null, "", pendingHash);
  }, [open, pendingHash]);

  return (
    <>
      {/* Real homepage card-deck section — unchanged markup. */}
      <section className="bg-[#0a0a0a] relative pb-8">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
        />
        <CardDeck onRevealedChange={handleRevealed} />
      </section>

      {/* Soft lock — instructions in the black space right under the cards. */}
      <div className={`dlab-soft__guide ${open ? "is-open" : ""}`} aria-live="polite">
        {!open ? (
          <>
            <span className="dlab-soft__cue">Begin here</span>
            <p className="dlab-soft__prompt">Flip the four cards to open the site.</p>
            <p className="dlab-soft__hint">
              Tap each card to reveal it
              {revealedCount > 0 ? ` — ${revealedCount} of 4` : ""}
            </p>
            <button type="button" className="dlab-soft__skip" onClick={() => setSkipped(true)}>
              Skip the intro <span aria-hidden="true">→</span>
            </button>
          </>
        ) : (
          <>
            <p className="dlab-soft__prompt dlab-soft__prompt--open">
              {skipped && !released ? "Explore freely." : "Enter the site."}
            </p>
            <span className="dlab-soft__scroll" aria-hidden="true">
              Scroll to explore ↓
            </span>
          </>
        )}
      </div>

      {/* SEO-safe lock: the rest of the site is ALWAYS rendered (so it's in the
          HTML for crawlers), just hidden until the lock releases on flip-all /
          skip. aria-hidden keeps it out of the a11y tree + tab order while locked. */}
      <div className={`dlab-gate__content ${open ? "is-open" : "is-locked"}`} aria-hidden={!open}>
        {children}
      </div>
    </>
  );
}
