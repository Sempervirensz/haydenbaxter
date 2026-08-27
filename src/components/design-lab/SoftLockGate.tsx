"use client";

// Soft-lock gate. Renders the real card-deck section + the soft lock, and holds
// the rest of the page (`children`) back until the visitor takes one of two
// routes. This makes the lock REAL on every device (mobile included) — you can't
// scroll past the entry until you choose — while staying soft, because the
// second route is always right there. The gated sections are passed as children
// from the server page, so no server/client import issues.
//
// The two routes, presented as a quiet decision point rather than an instruction
// with an escape hatch (see /entry-cta-lab, where this was designed):
//   Story Mode — flip all four cards; the indicator fills one mark per card.
//   Skip ahead — a link that opens the gate and lands on the Consulting chapter.
//
// The old "Skip the intro" button is gone; the second line replaces it. Nav
// links still release the gate via SOFT_LOCK_RELEASE, as before.

import { useCallback, useEffect, useState } from "react";
import CardDeck from "@/components/CardDeck";
import {
  CONSULTING_TARGET,
  DECK_SIZE,
  ENTRY_CHOICE,
  resolveConsultingChapter,
} from "@/data/entryChoice";
import FlipIndicator from "./FlipIndicator";
import {
  SOFT_LOCK_RELEASE,
  type SoftLockReleaseDetail,
} from "./softLockEvents";
import "./design-lab.css";

export default function SoftLockGate({ children }: { children: React.ReactNode }) {
  // Which cards are face-up, straight from CardDeck. The indicator renders this
  // set; nothing else counts flips independently.
  const [flipped, setFlipped] = useState<ReadonlySet<number>>(() => new Set());
  const [released, setReleased] = useState(false); // latches once all four flip
  const [skipped, setSkipped] = useState(false);


  const handleRevealed = useCallback((count: number, ids: ReadonlySet<number>) => {
    setFlipped(ids);
    if (count >= DECK_SIZE) setReleased(true);
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

  /* ---- The direct route → the Consulting chapter ----------------------- */

  const [pendingConsulting, setPendingConsulting] = useState(false);

  const handleDirectClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab / new window) fall through to the href.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setSkipped(true);
    setPendingConsulting(true);
  }, []);

  useEffect(() => {
    if (!open || !pendingConsulting) return;

    const land = (el: Element) => {
      setPendingConsulting(false);
      // Instant, like the nav jump above. The Work section is scroll-driven for
      // its whole height, so smooth-scrolling several thousand pixels through it
      // animates the CD spin and the cinematic parallax at once — and this is
      // the route for someone who chose to skip ahead.
      el.scrollIntoView({ behavior: "auto", block: "start" });
    };

    // Work mounts asynchronously — WorkSectionResponsive renders an empty
    // `#work` until it has measured the viewport, and the branch it picks is a
    // dynamic import on top of that. So on the commit that opens the gate the
    // Consulting chapter usually is not in the DOM yet. Wait for it instead of
    // landing on the empty shell.
    let observer: MutationObserver | undefined;
    let timeout: number | undefined;

    const found = resolveConsultingChapter();
    if (found) {
      land(found);
    } else {
      observer = new MutationObserver(() => {
        const el = resolveConsultingChapter();
        if (!el) return;
        observer?.disconnect();
        window.clearTimeout(timeout);
        land(el);
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Don't watch forever. If Work never mounts, the section anchor is still a
      // better landing than leaving the visitor parked at the top of the page.
      timeout = window.setTimeout(() => {
        observer?.disconnect();
        const fallback = document.querySelector(CONSULTING_TARGET.fallback);
        if (fallback) land(fallback);
        else setPendingConsulting(false);
      }, CONSULTING_TARGET.mountTimeoutMs);
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timeout);
    };
  }, [open, pendingConsulting]);

  return (
    <>
      {/* Real homepage card-deck section — unchanged markup. */}
      <section className="bg-[#0a0a0a] relative pb-8">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
        />
        <CardDeck onRevealedChange={handleRevealed} />
      </section>

      {/* Soft lock — instructions in the black space right under the cards. */}
      <div className={`dlab-soft__guide ${open ? "is-open" : ""}`} aria-live="polite">
        {!open ? (
          <div className="dlab-soft__choice">
            {/* Directly beneath the card row and above the choice. */}
            <FlipIndicator flipped={flipped} />

            <p className="dlab-soft__line">{ENTRY_CHOICE.story}</p>

            {/* Not aria-hidden: "A or B" is the meaning, and hiding it would
                leave two unrelated sentences to a screen reader. */}
            <span className="dlab-soft__or">{ENTRY_CHOICE.divider}</span>

            <a
              className="dlab-soft__line dlab-soft__line--direct"
              href={ENTRY_CHOICE.direct.href}
              onClick={handleDirectClick}
            >
              <span className="dlab-soft__lineText">{ENTRY_CHOICE.direct.text}</span>
              <span className="dlab-soft__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
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
          the direct route. aria-hidden keeps it out of the a11y tree + tab order
          while locked. */}
      <div className={`dlab-gate__content ${open ? "is-open" : "is-locked"}`} aria-hidden={!open}>
        {children}
      </div>
    </>
  );
}
