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

import { useCallback, useEffect, useRef, useState } from "react";
import CardDeck from "@/components/CardDeck";
import { resolveRunway, resolveSceneTop } from "@/data/entryMotion";
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

// The three optional props exist for /lab/card-entry-motion and are inert when
// omitted, which is how the homepage renders it. `deckProgress` is forwarded
// straight to CardDeck's own optional override; `onRevealedChange` and
// `onOpenChange` are read-only observers. There is still exactly one source of
// truth for flip state and gate state — this component — and none of these props
// can change it.
export default function SoftLockGate({
  children,
  scene,
  deckProgress,
  onRevealedChange,
  onOpenChange,
}: {
  children: React.ReactNode;
  /**
   * Rendered at the top of the pinned scene, above the deck. The homepage passes
   * its hero here rather than as a sibling, because the hero, the deck and the
   * guidance have to pin as ONE object — pinning the deck alone would let the
   * headline slide out from over it while the cards spread.
   */
  scene?: React.ReactNode;
  deckProgress?: number | readonly number[] | null;
  onRevealedChange?: (count: number, flipped: ReadonlySet<number>) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  // Which cards are face-up, straight from CardDeck. The indicator renders this
  // set; nothing else counts flips independently.
  const [flipped, setFlipped] = useState<ReadonlySet<number>>(() => new Set());
  const [released, setReleased] = useState(false); // latches once all four flip
  const [skipped, setSkipped] = useState(false);


  // Held in a ref so `handleRevealed` keeps a stable identity: CardDeck lists it
  // in an effect's dependencies, and a new function every render would re-run
  // that effect on every commit.
  const observerRef = useRef(onRevealedChange);
  observerRef.current = onRevealedChange;

  const handleRevealed = useCallback((count: number, ids: ReadonlySet<number>) => {
    setFlipped(ids);
    if (count >= DECK_SIZE) setReleased(true);
    observerRef.current?.(count, ids);
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

  /* ---- Scroll-dealt entrance -------------------------------------------
     The composition is pinned and the scroll distance runs BEHIND it, so the
     cards spread without the entry moving and without costing it any vertical
     space. `deckProgress` from a caller (the lab) always wins; the homepage
     passes nothing and gets this.

     Progress latches once the cards reach settled. Scrubbing back would re-bunch
     cards the visitor has already been invited to flip — and once one is face-up
     it would drag a revealed card back under its neighbours. */
  const sceneRef = useRef<HTMLDivElement>(null);
  const [dealProgress, setDealProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [metrics, setMetrics] = useState({ viewportH: 0, sceneH: 0 });
  const settledRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const measure = () => {
      setMetrics({
        viewportH: window.innerHeight,
        sceneH: sceneRef.current?.offsetHeight ?? 0,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    // The scene's height moves with the fluid type scale and with font loading,
    // so a resize listener alone would measure it once, too early.
    const ro = new ResizeObserver(measure);
    if (sceneRef.current) ro.observe(sceneRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const runway = reduced ? 0 : resolveRunway(metrics.viewportH);

  useEffect(() => {
    if (reduced || runway <= 0) {
      setDealProgress(1);
      settledRef.current = true;
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      if (settledRef.current) return;
      const next = Math.min(Math.max(window.scrollY / runway, 0), 1);
      if (next >= 1) settledRef.current = true;
      setDealProgress(next);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, runway]);

  const pinned = !reduced && runway > 0;
  const sceneTop = resolveSceneTop(metrics.viewportH, metrics.sceneH);

  const open = released || skipped;

  const openObserverRef = useRef(onOpenChange);
  openObserverRef.current = onOpenChange;
  useEffect(() => {
    openObserverRef.current?.(open);
  }, [open]);

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
      {/* The track owns the scroll distance; the scene rides it without moving.
          Both stay in place after the gate opens — collapsing the track at that
          moment would reflow the document under a visitor who is already
          scrolled into it, and jump the viewport. Left alone, the runway simply
          becomes the last stretch of the entry and the site follows below it. */}
      <div
        className="entry-track"
        style={pinned ? { height: `calc(100svh + ${runway}px)` } : undefined}
      >
        <div
          ref={sceneRef}
          className={`entry-scene ${pinned ? "is-pinned" : ""}`}
          style={pinned ? { top: `${sceneTop}px` } : undefined}
        >
          {scene}
      {/* Real homepage card-deck section.
          pb-2, not pb-8: that stacked with the card row's own pb-8 for ~80px of
          dead space between the captions and the flip indicator. Reclaiming it
          is what pays for the hero's nav clearance without shrinking the deck. */}
      <section className="bg-[#0a0a0a] relative pb-2">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
        />
        <CardDeck
          onRevealedChange={handleRevealed}
          progressOverride={deckProgress ?? dealProgress}
        />
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

        </div>
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
