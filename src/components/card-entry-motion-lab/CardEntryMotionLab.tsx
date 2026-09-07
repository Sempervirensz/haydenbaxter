"use client";

// /lab/card-entry-motion — four card-entry motions, side by side, on the real entry.
//
// What makes this lab trustworthy is what it does NOT rebuild. The hero, the
// deck, the four cards, the flip, the soft lock, the flip indicator and every
// pixel of their CSS are the production components. The only thing this file
// supplies is the SOURCE of the deck's unveil progress — the one variable under
// test — via CardDeck's optional `progressOverride`. The transform maths in
// PlayingCard, the `--card-width` clamp and the responsive rules are untouched,
// so `transformScale` degrades here exactly as it does on the homepage.
//
// Two conditions are held deliberately:
//   1. The gate stays CLOSED for the whole entrance, as production does.
//   2. Its children are a stub, so the heavy sections never mount. Mounting them
//      would put ~11.8MB and every downstream surface on the main thread during
//      the card animation — which is the condition that made the motion feel bad
//      on a real phone (see 3784966). A lab that reproduced that would be
//      measuring the wrong page.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "@/components/HeroSection";
import SoftLockGate from "@/components/design-lab/SoftLockGate";
import { CARDS } from "@/data/cards";
import {
  DEAL_MS,
  HYBRID_AUTO_CEILING,
  HYBRID_AUTO_MS,
  MOTION_OPTIONS,
  PHASE_COPY,
  RUNWAY_MAX,
  RUNWAY_MIN,
  RUNWAY_VH_SHARE,
  SETTLE_MS,
  STAGGER_MS,
  type MotionOptionId,
  type MotionPhase,
} from "@/data/cardEntryMotionLab";
import "./card-entry-motion-lab.css";

const DECK_COUNT = CARDS.length;

// Inline, not left to the stylesheet, and this is load-bearing rather than
// belt-and-braces. In dev Next can inject card-entry-motion-lab.css after first
// paint; until it lands these three elements are ordinary blocks at the end of
// the document, and they add their own height to `scrollHeight`. That flips
// `scrollSpace <= 0` to false inside useScrollProgress, which samples once on
// mount and then only on scroll — so on any viewport where the real entry has no
// scroll room the control baseline latched the rect branch and stayed there,
// showing bunched cards where the homepage shows settled ones. Measured before
// this: wrong on 1 of 8 loads at 1280x780 and 2 of 8 at 1440x900. An inline
// `position: fixed` is out of flow from the very first paint, stylesheet or not.
const OUT_OF_FLOW = { position: "fixed" } as const;
const ZERO = Object.freeze(CARDS.map(() => 0));
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Mirrors PlayingCard's own scale basis so the diagnostic reads the real number. */
const DESKTOP_CARD_WIDTH = 280;

export default function CardEntryMotionLab() {
  const [option, setOption] = useState<MotionOptionId>("control");

  // Two counters, because Replay and Reset are different questions. Bumping
  // `motionRun` re-runs the entrance; bumping `gateRun` additionally remounts the
  // gate, which is the only way to clear latched flip state — `released` is a
  // one-way latch inside SoftLockGate and the lab does not reach into it.
  const [motionRun, setMotionRun] = useState(0);
  const [gateRun, setGateRun] = useState(0);

  const [reduced, setReduced] = useState(false);
  const [auto, setAuto] = useState<readonly number[]>(ZERO);
  const [autoDone, setAutoDone] = useState(true);
  const [scrollProg, setScrollProg] = useState(0);
  const [settled, setSettled] = useState(true);

  const [flips, setFlips] = useState(0);
  const [open, setOpen] = useState(false);

  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [runway, setRunway] = useState(0);
  const [cardW, setCardW] = useState(0);
  const [scrollSpace, setScrollSpace] = useState(0);
  const [diagOpen, setDiagOpen] = useState(true);

  const meta = useMemo(
    () => MOTION_OPTIONS.find((o) => o.id === option) ?? MOTION_OPTIONS[0],
    [option]
  );
  const sceneRef = useRef<HTMLDivElement>(null);

  /* ---- prefers-reduced-motion, watched live ------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* ---- Viewport, runway, card width, scroll space ------------------------ */
  const measure = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setViewport({ w, h });
    setRunway(Math.round(Math.min(Math.max(h * RUNWAY_VH_SHARE, RUNWAY_MIN), RUNWAY_MAX)));
    const btn = sceneRef.current?.querySelector<HTMLElement>(".card-hover-wrapper");
    if (btn) setCardW(btn.offsetWidth);
    setScrollSpace(document.documentElement.scrollHeight - h);
  }, []);

  useEffect(() => {
    measure();
    if (window.innerWidth < 640) setDiagOpen(false);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Re-measure after a switch: the track's height and the card size both change.
  useEffect(() => {
    const id = window.setTimeout(measure, 60);
    return () => window.clearTimeout(id);
  }, [option, motionRun, gateRun, open, measure]);

  /* ---- Automatic phase (options 03 and 04) ------------------------------- */
  useEffect(() => {
    if (reduced || !meta.usesAuto) {
      setAuto(ZERO);
      setAutoDone(true);
      return;
    }

    const ceiling = option === "self" ? 1 : HYBRID_AUTO_CEILING;
    const duration = option === "self" ? DEAL_MS : HYBRID_AUTO_MS;
    const total = duration + (DECK_COUNT - 1) * STAGGER_MS;

    setAuto(ZERO);
    setAutoDone(false);

    let raf = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const elapsed = now - started;
      setAuto(CARDS.map((_, i) => clamp01((elapsed - i * STAGGER_MS) / duration) * ceiling));
      if (elapsed < total) {
        raf = requestAnimationFrame(tick);
      } else {
        setAutoDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [option, motionRun, gateRun, reduced, meta.usesAuto]);

  /* ---- Scroll phase (options 02 and 04) ---------------------------------- */
  useEffect(() => {
    if (reduced || !meta.usesScroll) {
      setScrollProg(0);
      return;
    }

    let ticking = false;
    const update = () => {
      const r = Math.max(runway, 1);
      setScrollProg(clamp01(window.scrollY / r));
      setScrollSpace(document.documentElement.scrollHeight - window.innerHeight);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [option, motionRun, gateRun, reduced, meta.usesScroll, runway]);

  /* ---- Progress handed to the real deck ---------------------------------- */
  const deckProgress = useMemo<number | readonly number[] | null>(() => {
    // Option 01 must stay the untouched baseline: `null` means CardDeck reads
    // useScrollProgress, short-circuit and all.
    if (option === "control") return null;
    if (reduced) return 1;
    if (option === "scroll") return scrollProg;
    if (option === "self") return auto;
    return auto.map((a) => clamp01(a + (1 - HYBRID_AUTO_CEILING) * scrollProg));
  }, [option, reduced, scrollProg, auto]);

  /* ---- Phase --------------------------------------------------------------
     `motionComplete` is "the entrance has finished", which each option answers
     differently; `settled` adds the short beat where the cards have landed but
     are still reading as settling rather than as an invitation to flip. */
  const motionComplete =
    option === "control" ||
    reduced ||
    (option === "scroll" ? scrollProg >= 1 : option === "self" ? autoDone : autoDone && scrollProg >= 1);

  useEffect(() => {
    if (!motionComplete) {
      setSettled(false);
      return;
    }
    if (reduced || option === "control") {
      setSettled(true);
      return;
    }
    const id = window.setTimeout(() => setSettled(true), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [motionComplete, reduced, option, motionRun, gateRun]);

  const phase: MotionPhase = open
    ? "released"
    : option === "control" || reduced
      ? "flip"
      : option === "self"
        ? motionComplete && settled
          ? "flip"
          : "settling"
        : option === "scroll"
          ? !motionComplete
            ? "scroll"
            : settled
              ? "flip"
              : "settling"
          : !autoDone
            ? "settling"
            : !motionComplete
              ? "scroll"
              : settled
                ? "flip"
                : "settling";

  /* ---- Controls ----------------------------------------------------------- */
  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const replay = useCallback(() => {
    scrollTop();
    setScrollProg(0);
    setMotionRun((n) => n + 1);
  }, [scrollTop]);

  const reset = useCallback(() => {
    scrollTop();
    setScrollProg(0);
    setFlips(0);
    setOpen(false);
    setMotionRun((n) => n + 1);
    setGateRun((n) => n + 1);
  }, [scrollTop]);

  const choose = useCallback(
    (next: MotionOptionId) => {
      if (next === option) return;
      setOption(next);
      // Changing option resets scroll AND flip state, per the lab brief — a deck
      // left half-flipped from the previous option would misreport the next one.
      scrollTop();
      setScrollProg(0);
      setAuto(ZERO);
      setFlips(0);
      setOpen(false);
      setMotionRun((n) => n + 1);
      setGateRun((n) => n + 1);
    },
    [option, scrollTop]
  );

  const handleRevealed = useCallback((count: number) => setFlips(count), []);

  /* ---- Render ------------------------------------------------------------- */
  const pinned = meta.usesScroll && !reduced;
  const transformScale = cardW ? cardW / DESKTOP_CARD_WIDTH : 0;
  const headline =
    typeof deckProgress === "number"
      ? deckProgress
      : Array.isArray(deckProgress)
        ? deckProgress[0]
        : null;

  const composition = (
    <div ref={sceneRef} className={pinned ? "cem-scene" : undefined}>
      <HeroSection />
      <SoftLockGate
        key={`${option}-${gateRun}`}
        deckProgress={deckProgress}
        onRevealedChange={handleRevealed}
        onOpenChange={setOpen}
      >
        {/* Rendered only once the gate is open, not merely hidden behind its
            `display: none`. That is what the brief asked for, and it also closes
            a dev-only race that made the control baseline unfaithful: Next can
            inject design-lab.css after first paint, and in that window the
            locked subtree is not yet display:none, so the stub inflates
            scrollHeight. useScrollProgress samples once on mount and then only
            on scroll — so it latched the rect branch against a document that was
            about to shrink, and with no scroll room it never recomputed. The
            homepage never showed this (its gated children are heavier but its
            CSS arrives in one chunk); the lab did, at 1280x780, about half the
            time. An empty subtree has no height whether or not the CSS landed. */}
        {open ? (
          <section className="cem-stub">
            <p className="cem-stub__label">Gate released</p>
            <p className="cem-stub__note">
              Stub. On the homepage the Work stack, Personas, Connect, About and Journal mount
              here — deliberately absent so the entrance is measured against a closed gate.
            </p>
          </section>
        ) : null}
      </SoftLockGate>
    </div>
  );

  return (
    <div className="cem-root">
      {pinned ? (
        <div style={{ height: `calc(100svh + ${runway}px)` }}>{composition}</div>
      ) : (
        composition
      )}

      <div className="cem-phase" data-phase={phase} role="status" aria-live="polite" style={OUT_OF_FLOW}>
        <span className="cem-phase__dot" />
        <span>{PHASE_COPY[phase]}</span>
      </div>

      <aside className="cem-diag" style={OUT_OF_FLOW}>
        <button
          type="button"
          className="cem-diag__toggle"
          onClick={() => setDiagOpen((v) => !v)}
          aria-expanded={diagOpen}
        >
          <span>Diagnostics</span>
          <span aria-hidden="true">{diagOpen ? "−" : "+"}</span>
        </button>
        {diagOpen && (
          <div className="cem-diag__body">
            <Row k="viewport" v={`${viewport.w} × ${viewport.h}`} />
            <Row
              k="scroll space"
              v={`${scrollSpace}px`}
              tone={scrollSpace <= 0 ? "warn" : "ok"}
            />
            <Row k="runway" v={pinned ? `${runway}px` : "—"} />
            <Row k="progress" v={headline === null ? "hook" : headline.toFixed(3)} />
            <Row k="card width" v={`${cardW}px`} />
            <Row
              k="transform scale"
              v={transformScale.toFixed(3)}
              tone={transformScale < 0.6 ? "warn" : undefined}
            />
            <Row k="travel" v={`±${Math.round(100 * transformScale)}px`} />
            <Row k="phase" v={phase} />
            <Row k="flips" v={`${flips} of ${DECK_COUNT}`} tone={flips === DECK_COUNT ? "ok" : undefined} />
            <Row k="gate" v={open ? "released" : "closed"} />
            <Row k="reduced motion" v={reduced ? "on" : "off"} tone={reduced ? "warn" : undefined} />
            <div className="cem-diag__bar">
              <div
                className="cem-diag__barFill"
                style={{ width: `${Math.round((headline ?? 0) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </aside>

      <nav className="cem-switch" aria-label="Motion option" style={OUT_OF_FLOW}>
        {MOTION_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`cem-switch__btn ${o.id === option ? "is-active" : ""}`}
            aria-pressed={o.id === option}
            onClick={() => choose(o.id)}
          >
            {o.label}
          </button>
        ))}
        <span className="cem-switch__spacer" />
        <button type="button" className="cem-switch__act" onClick={replay}>
          Replay
        </button>
        <button type="button" className="cem-switch__act" onClick={reset}>
          Reset
        </button>
        <p className="cem-switch__blurb">{meta.blurb}</p>
      </nav>
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "warn" | "ok" }) {
  return (
    <div className="cem-diag__row">
      <span className="cem-diag__k">{k}</span>
      <span className={`cem-diag__v ${tone ? `cem-diag__v--${tone}` : ""}`}>{v}</span>
    </div>
  );
}
