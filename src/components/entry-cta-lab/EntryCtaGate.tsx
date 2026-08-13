"use client";

// Lab mirror of the production soft-lock gate (components/design-lab/SoftLockGate),
// with one thing changed: the space under the deck carries a quiet route choice
// instead of an instruction plus a Skip button.
//
// Deliberately a copy rather than a prop on the real gate — nothing on the
// production homepage moves while this is being reviewed. Everything outside the
// `.ecta__choice` block is the existing gate verbatim: the card deck, the
// open-state copy, and the SEO-safe hidden-not-unmounted gating.
//
// Both routes use the gate's existing behaviour. Story Mode releases it by
// flipping four cards (`onRevealedChange` → `released`), exactly as today. The
// direct route releases it the way a nav link does (`skipped`) and then lands on
// the Consulting chapter.

import { useCallback, useEffect, useState } from "react";
import CardDeck from "@/components/CardDeck";
import {
  SOFT_LOCK_RELEASE,
  type SoftLockReleaseDetail,
} from "@/components/design-lab/softLockEvents";
import {
  CONSULTING_TARGET,
  DECK_SIZE,
  DEFAULT_INDICATOR,
  DEFAULT_VARIANT,
  ROUTE_CHOICE,
  type IndicatorDesign,
  type RouteVariant,
} from "@/data/entryCtaLab";
import EntryProgress from "./EntryProgress";
import "@/components/design-lab/design-lab.css";
import "./entry-cta-lab.css";

/**
 * The Consulting chapter, or null while the Work section is still a placeholder.
 * Returning null rather than the `#work` shell is the point: it doubles as the
 * "Work has actually mounted" signal the click handler waits on.
 */
function resolveConsultingChapter(): Element | null {
  const tagged = document.querySelector(CONSULTING_TARGET.tagged);
  if (tagged) return tagged;

  const tracks = document.querySelectorAll(CONSULTING_TARGET.detailTracks);
  return tracks.length > CONSULTING_TARGET.detailIndex
    ? tracks[CONSULTING_TARGET.detailIndex]
    : null;
}

export default function EntryCtaGate({
  variant = DEFAULT_VARIANT,
  indicator = DEFAULT_INDICATOR,
  labControl,
  children,
}: {
  /** Presentation only — every iteration behaves the same. */
  variant?: RouteVariant;
  /** Which of the three flip-indicator designs to render. */
  indicator?: IndicatorDesign;
  /** Lab furniture, rendered in flow beneath the guide. See the note there. */
  labControl?: React.ReactNode;
  children: React.ReactNode;
}) {
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
      // animates the CD spin and the cinematic parallax at once.
      //
      // One shot is enough: the cinematic chapters are vh-height tracks that
      // land in a single commit, so the chapter's offset is already final by the
      // time the observer below can see it. Covered by the landing assertion in
      // tests/entry-cta.spec.ts at both breakpoints.
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
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
        />
        <CardDeck onRevealedChange={handleRevealed} />
      </section>

      {/* The choice, in the black space right under the cards. */}
      <div className={`dlab-soft__guide ${open ? "is-open" : ""}`} aria-live="polite">
        {!open ? (
          <div className={`ecta__choice ecta__choice--${variant}`}>
            {/* Directly beneath the card row and above the route choice. */}
            <EntryProgress design={indicator} flipped={flipped} />

            <p className="ecta__line ecta__line--story">{ROUTE_CHOICE.story}</p>

            {/* Not aria-hidden: "A or B" is the meaning, and hiding it would
                leave two unrelated sentences to a screen reader. */}
            <span className="ecta__or">{ROUTE_CHOICE.divider}</span>

            <a
              className="ecta__line ecta__line--direct"
              href={ROUTE_CHOICE.direct.href}
              onClick={handleDirectClick}
            >
              <span className="ecta__lineText">{ROUTE_CHOICE.direct.text}</span>
              <span className="ecta__arrow" aria-hidden="true">
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

      {/* Lab furniture, in flow rather than floating. The entry is about one
          screen tall and the choice sits at the bottom of it, so a fixed control
          in any corner lands on either the deck or the type. Nothing here
          depends on scroll position, so costing the page a few rows of height is
          free — and it keeps the review surface completely unobstructed. */}
      {labControl && <div className="ecta__labBar">{labControl}</div>}

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
