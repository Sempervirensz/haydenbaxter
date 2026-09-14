"use client";

// Split Yoke — promoted from /nav-lab concept 04.
//
// WHAT CHANGED AND WHY
//
// It is FIXED. The old navbar was `position: absolute` inside the hero, so it
// left after roughly one viewport — and the Work section that follows measures
// ~13,600px at 1280x800. A visitor convinced at chapter three had no way to act
// on it without scrolling to the end or back to the top. That is the whole
// reason for this change; everything else follows from it.
//
// It CONDENSES. Holding five embossed tags over every scene for 13,000px is a
// lot of chrome, so past the hero the four links fold behind one MENU tag and
// the bar becomes two objects: who this is, and the one action. Every fold mode
// takes the links out of the tab order as they go, because an invisible link
// that still holds focus is a bug this component has had to fix once already,
// on the mobile panel.
//
// The fold that SHIPS is `recede` at `long` pace, chosen in /nav-lab after two
// rounds. Three things had to be true before it felt right, and only the last
// is about animation:
//
//   1. Two thresholds, not one. A single 72px line meant a 12px jitter flipped
//      the bar 13 times; a dead band flips it zero times.
//   2. Drawn from scroll POSITION, not switched at a line. A mode that crosses
//      a threshold and then plays an animation is never connected to the hand
//      that caused it, however well eased.
//   3. Measured in screens, not pixels. The first linked build folded across
//      196px — two wheel notches — which felt abrupt no matter how it moved.
//      A viewport-relative window lands the fold exactly as the entry leaves.
//
// The other seven modes stay for the lab's sake; production reads the defaults.
//
// The CTA DISCLOSES rather than navigates. It is a <button> with
// `aria-expanded`, opening the Work Together hub. If it ever becomes a link to
// a real page, `aria-expanded` must go with it — it is a lie to a screen reader
// on something that navigates.
//
// It is rendered by `app/page.tsx`, NOT by HeroSection. The hero sits inside
// the soft lock's pinned scene, which is `position: sticky` with a z-index —
// a stacking context. A fixed bar inside it positions correctly but paints
// underneath the Work section that follows. The hero's clearance is unaffected:
// that comes from the `--nav-height` token, not from this element's box.

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE_CONTENT } from "@/data/siteContent";
import { releaseSoftLock } from "@/components/design-lab/softLockEvents";
import { openWorkTogetherPath } from "@/components/work/workTogetherEvents";
import { CONSULTING_TARGET, resolveConsultingChapter } from "@/data/entryChoice";
import WorkTogetherHub from "@/components/WorkTogetherHub";
import type { PathId } from "@/data/workTogether";
import { DEFAULT_PACE, FOLD_PACES, type CondenseMode, type FoldPace } from "@/data/navLab";

/* All three paths land in the SAME place: the Work Together chapter, with the
   chosen screen open.

   An earlier version sent WorldPulse to its own chapter instead, which read
   well in the abstract and behaved incoherently in practice — it scrolled the
   visitor to chapter 01 while opening a screen in chapter 04, seven thousand
   pixels below where they were now standing. The hub is a remote control for
   one section, not a table of contents for the page: the visitor has said "show
   me the relevant way we could work together", and that section is the thing
   that answers all three. The WorldPulse chapter is still there to be scrolled
   to, and its screen here carries the same outbound links. */

/* Two thresholds, not one.

   A single 72px line meant a two-pixel wheel nudge around the fold flipped the
   whole bar back and forth. Collapsing later than it re-opens gives the state a
   100px dead band to settle in, which is what actually removes the flicker —
   easing the transition only made a flickering bar flicker smoothly. */
const CONDENSE_IN = 160;
const CONDENSE_OUT = 60;

/** The single line `snap` still uses — kept so the lab's control is faithful. */
const CONDENSE_AT = 72;

/* Where a LINKED fold begins — a dead zone, so a small nudge at the top of the
   page does not start dismantling the bar. The window's LENGTH is a fraction of
   viewport height (see FOLD_PACES), not a pixel count: the fold is happening
   over the entry, so it should be measured in screens rather than in pixels
   that mean different things on a laptop and a 4K panel. */
const FOLD_START = 64;

/** Modes drawn from scroll position rather than switched at a threshold. */
const LINKED_MODES = new Set<CondenseMode>(["track", "cascade", "recede"]);

/**
 * The three props exist for /nav-lab and are inert when omitted, which is how
 * the homepage renders this. They let the lab drive the REAL navbar rather than
 * a copy of it, so what gets approved there is the thing that ships. Same
 * arrangement `SoftLockGate` has with the card-entry lab.
 */
export default function Navbar({
  ctaLabel,
  ctaGlyph,
  condense = "recede",
  pace = DEFAULT_PACE,
}: {
  ctaLabel?: string;
  ctaGlyph?: string;
  condense?: CondenseMode;
  pace?: FoldPace;
} = {}) {
  const { wordmark, navLinks, cta } = SITE_CONTENT.header;
  /* 0 = open, 1 = folding (MENU live, links still readable), 2 = folded. */
  const [foldStage, setFoldStage] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);

  const label = ctaLabel ?? cta.label;
  const glyph = ctaGlyph ?? cta.glyph;

  /* The phone bar swaps in a shorter wording below 430px. That pairing is
     written for the shipped label — "Let's work together" → "Work with me" is
     the same voice, abbreviated — and an override has no such partner, so
     using `cta.short` alongside one puts TWO different promises on the same
     button depending on screen width. Measured with "Quick Site Nav": the full
     wording is 159px in a 402px bar with nothing escaping, so there is room to
     simply not abbreviate. An override therefore replaces both strings. */
  const shortLabel = ctaLabel ?? cta.short;

  /* Two shapes of fold, and the difference is what "natural" means here.

     The STATE modes (snap / fade / stagger / intent) cross a line and then play
     an animation at their own pace. However well eased, that motion is
     disconnected from the hand that caused it — you push, and a moment later
     something happens on its own schedule.

     The LINKED modes draw the fold from scroll POSITION instead, writing a 0→1
     `--fold` custom property the stylesheet reads. Nothing transitions: the bar
     is simply drawn at the position you have scrolled to, so it folds under
     your finger and unfolds again if you back up a pixel. Same principle the
     entry deck already uses (`dealProgress` in SoftLockGate).

     Smoothstep rather than a linear ramp — it leaves and arrives at rest
     without overshooting, which is the grounded half of the design language.
     An elastic curve here would read as floaty chrome. */
  const paceDef = FOLD_PACES.find((p) => p.id === pace) ?? FOLD_PACES[2];

  /* The four STATE modes read their duration from here too, so "pace" means
     one thing across all eight rather than only applying to the linked half.
     Their fixed ~300ms was the other half of "everything feels quick". */
  useEffect(() => {
    navRef.current?.style.setProperty("--fold-ms", `${paceDef.ms}ms`);
  }, [paceDef.ms]);

  const stageRef = useRef(0);
  useEffect(() => {
    const nav = navRef.current;

    if (condense === "hold") {
      setFoldStage(0);
      nav?.style.setProperty("--fold", "0");
      return;
    }

    const linked = LINKED_MODES.has(condense);
    /* A scroll-linked fold has no CSS transition, so the reduced-motion block
       in globals.css cannot reach it — zeroing a duration does nothing to a
       property being redrawn every frame. Quantising the progress to 0 or 1 is
       what actually honours the preference: the bar still folds, it just stops
       travelling to get there. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = window.scrollY;

    const update = () => {
      const y = window.scrollY;

      if (linked) {
        // Read each update rather than cached: `innerHeight` is free, and this
        // keeps the window correct through a resize or a mobile URL bar
        // collapsing without a second listener to go stale.
        const span = Math.max(120, window.innerHeight * paceDef.vh);
        const raw = (y - FOLD_START) / span;
        const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        const eased = reduced ? (p >= 0.5 ? 1 : 0) : p * p * (3 - 2 * p);
        // Written straight to the DOM rather than to React state: this changes
        // every frame of a scroll, and a re-render per frame is the one thing
        // guaranteed to make it feel worse than it does today.
        nav?.style.setProperty("--fold", eased.toFixed(4));
        /* Three stages rather than a boolean, because "visible" and
           "interactive" stop agreeing once the fold is continuous. The links
           stay focusable while they can still be read; MENU becomes focusable
           only once it can be seen. React bails out when the stage has not
           changed, so the frames between crossings cost nothing. */
        const stage = eased >= 0.98 ? 2 : eased > 0.35 ? 1 : 0;
        if (stage !== stageRef.current) {
          stageRef.current = stage;
          setFoldStage(stage);
        }
        return;
      }

      if (condense === "intent") {
        // Ignore sub-pixel jitter and rubber-banding at the top.
        if (Math.abs(y - last) > 4) {
          setFoldStage(y > last && y > CONDENSE_OUT ? 2 : 0);
          last = y;
        }
        return;
      }
      // `snap` deliberately keeps the ONE threshold that ships, so the lab's
      // control still reproduces the flicker the other modes are fixing. Wiring
      // the hysteresis into it too would leave nothing to compare against.
      if (condense === "snap") {
        setFoldStage(y > CONDENSE_AT ? 2 : 0);
        return;
      }
      setFoldStage((was) =>
        was === 2 ? (y > CONDENSE_OUT ? 2 : 0) : y > CONDENSE_IN ? 2 : 0
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      nav?.style.removeProperty("--fold");
    };
  }, [condense, paceDef.vh]);

  /* The links' natural width, measured once and handed to CSS.

     A linked fold interpolates the cluster's width, and `auto` cannot be
     interpolated — so the stylesheet needs a real number to scale against.
     `scrollWidth` reports the content width even while the container is
     clipped partway through a fold, which is exactly when this is read. */
  useEffect(() => {
    const measure = () => {
      const el = linksRef.current;
      if (!el) return;
      navRef.current?.style.setProperty("--nav-links-w", `${el.scrollWidth}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [navLinks.length, condense]);

  const condensed = foldStage >= 1;

  /* Snap is the only mode that unmounts. The others keep the links in the DOM
     so width and opacity can be drawn at any point of the fold, and mark the
     cluster `inert` once it is gone — which removes it from the tab order the
     way `display: none` did, without removing it from the layout partway
     through. */
  const unmountLinks = condense === "snap" && foldStage === 2;
  const linksInert = condense !== "snap" && foldStage === 2;
  const foldInert = foldStage === 0;

  // In-page anchors can't resolve while the soft lock hides their targets, so
  // hand the destination to the gate: it opens, then scrolls once the content
  // is committed. Anything else (Journal, the Resume PDF) is left to the browser.
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setMenuOpen(false);
      if (!href.startsWith("#") || href === "#") return;
      e.preventDefault();
      releaseSoftLock(href);
    },
    []
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Choosing a path from the hub.

     Three things have to happen in order, and the middle one is asynchronous:
     the gate opens, the Work section mounts its chapters, and only then can the
     chapter be scrolled to and its screen opened. The Work stack is a dynamic
     import and `#work` is REPLACED on mount rather than filled, so an element
     resolved now would be a detached node. Hence the poll. */
  const chooseFromHub = useCallback((path: PathId) => {
    setHubOpen(false);
    releaseSoftLock();

    const deadline = Date.now() + CONSULTING_TARGET.mountTimeoutMs;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const attempt = () => {
      // Production's own resolver: it already walks tagged chapter → detail
      // track → nothing, which is what the two Work stacks need. Reusing it
      // means the nav cannot drift from how the soft-lock gate finds the same
      // chapter.
      const el = resolveConsultingChapter();

      if (!el) {
        if (Date.now() < deadline) {
          window.setTimeout(attempt, 120);
        } else {
          // Never leave a press inert: land on the section even if the
          // chapters never resolved.
          document
            .querySelector(CONSULTING_TARGET.fallback)
            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
        return;
      }

      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      // The section is in the DOM now, so it is subscribed and can hear this.
      openWorkTogetherPath(path);
      reaim();
    };

    /* Re-aim after the scroll.

       The Work stack is still laying out when the first press arrives — its
       chapters grow as the stack mounts and its imagery resolves — so the
       position we just scrolled to moves out from under us. Measured: the first
       CTA press after the entry landed at 6824px for a chapter that settled at
       12993px, i.e. most of a chapter short, while every later press was exact.

       Bounded on both ends. Only drift larger than a deliberate nudge is
       corrected, it gives up after a few tries, and any input from the visitor
       cancels it outright — a page that keeps yanking itself back is worse than
       one that lands imprecisely. */
    function reaim() {
      let tries = 8;
      let cancelled = false;
      const stop = () => {
        cancelled = true;
        for (const ev of ["wheel", "touchstart", "keydown"])
          window.removeEventListener(ev, stop);
      };
      for (const ev of ["wheel", "touchstart", "keydown"])
        window.addEventListener(ev, stop, { once: true, passive: true });

      const tick = () => {
        if (cancelled || tries-- <= 0) return stop();
        const target = resolveConsultingChapter();
        if (!target) return stop();
        if (Math.abs(target.getBoundingClientRect().top) > 24) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          window.setTimeout(tick, 150);
        } else {
          stop();
        }
      };
      // Let a smooth scroll finish before correcting it, or the two fight.
      window.setTimeout(tick, reduced ? 0 : 650);
    }

    attempt();
  }, []);

  const openHub = useCallback(() => {
    setMenuOpen(false);
    setHubOpen(true);
  }, []);

  const renderLink = (link: (typeof navLinks)[number], className: string) => (
    <a
      key={link.label}
      href={link.href}
      className={className}
      onClick={(e) => handleAnchorClick(e, link.href)}
      {...("external" in link && link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
    </a>
  );

  const ctaButton = (extraClass = "") => (
    <button
      type="button"
      className={`tag tag--cta nav-cta ${extraClass}`}
      aria-haspopup="dialog"
      aria-expanded={hubOpen}
      onClick={openHub}
    >
      <span className="nav-cta__long">{label}</span>
      <span className="nav-cta__short">{shortLabel}</span>
      <span className="nav-cta__glyph" aria-hidden="true">
        {glyph}
      </span>
    </button>
  );

  return (
    <>
      {/* No py-* here: `.navbar` owns the vertical padding via --nav-pad-block,
          because the hero derives its nav clearance from the resulting height. */}
      <nav
        ref={navRef}
        className={`navbar navbar--yoke navbar--${condense} ${condensed ? "is-condensed" : ""}`}
        data-fold-stage={foldStage}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <a href="#main" className="navbar__mark">
          {wordmark}
        </a>

        {/* The four links leave the tab order with the visual, either by
            unmounting (snap) or by going inert once collapsed — `aria-hidden`
            alone would not do it, and a focusable link behind nothing is the
            bug the mobile panel already had to fix once. */}
        {!unmountLinks && (
          <div
            ref={linksRef}
            className="nav-tags"
            inert={linksInert || undefined}
            aria-hidden={linksInert || undefined}
          >
            {navLinks.map((link, i) => (
              <span
                key={link.label}
                className="nav-tags__slot"
                /* Stagger leaves right-to-left, so the index counts from the
                   end; every other mode resolves this to a 0ms delay. */
                style={{ "--nav-tag-i": navLinks.length - 1 - i } as React.CSSProperties}
              >
                {renderLink(link, "tag tag--nav")}
              </span>
            ))}
          </div>
        )}

        <div className="nav-actions">
          {/* Present from the first frame of the collapse so the right cluster
              settles at one width, rather than jumping as MENU pops in after
              the links have gone. */}
          <button
            type="button"
            className={`tag tag--nav nav-fold ${condensed ? "is-shown" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="nav-fold-panel"
            inert={foldInert || undefined}
            aria-hidden={foldInert || undefined}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          {ctaButton()}
        </div>

        {/* The folded panel, and the mobile menu — one element, because they
            hold the same four destinations and differ only in where they sit. */}
        {menuOpen && (
          <div className="nav-panel" id="nav-fold-panel">
            {navLinks.map((link) => renderLink(link, "tag tag--nav"))}
          </div>
        )}
      </nav>

      {/* Mobile: the closed header keeps the CTA on screen. The old hamburger
          hid the one action a visitor arrives ready to take, on the device most
          of them arrive on. */}
      <div className={`nav-mobile ${hubOpen ? "is-dimmed" : ""}`}>
        <a href="#main" className="nav-mobile__mark">
          {wordmark}
        </a>
        <div className="nav-mobile__actions">
          {ctaButton("nav-cta--compact")}
          <button
            type="button"
            className="tag tag--nav"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-panel"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Inside the bar, so it can hang off its bottom edge exactly rather
            than from a hard-coded offset that only matches at one width. */}
        {menuOpen && (
          <div className="nav-mobile__panel" id="nav-mobile-panel">
            {navLinks.map((link) => renderLink(link, "tag tag--nav"))}
          </div>
        )}
      </div>

      <WorkTogetherHub
        open={hubOpen}
        onClose={() => setHubOpen(false)}
        onChoose={chooseFromHub}
        labelledBy="nav-hub-title"
      />
    </>
  );
}
