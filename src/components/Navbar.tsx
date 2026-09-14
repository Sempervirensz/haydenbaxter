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
// the bar becomes two objects: who this is, and the one action. How that fold
// is performed is the `condense` prop below — every mode takes the links out of
// the tab order as they go, because an invisible link that still holds focus is
// a bug this component has had to fix once already, on the mobile panel.
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

import { useCallback, useEffect, useState } from "react";
import { SITE_CONTENT } from "@/data/siteContent";
import { releaseSoftLock } from "@/components/design-lab/softLockEvents";
import { openWorkTogetherPath } from "@/components/work/workTogetherEvents";
import { CONSULTING_TARGET, resolveConsultingChapter } from "@/data/entryChoice";
import WorkTogetherHub from "@/components/WorkTogetherHub";
import type { PathId } from "@/data/workTogether";
import type { CondenseMode } from "@/data/navLab";

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

/**
 * The three props exist for /nav-lab and are inert when omitted, which is how
 * the homepage renders this. They let the lab drive the REAL navbar rather than
 * a copy of it, so what gets approved there is the thing that ships. Same
 * arrangement `SoftLockGate` has with the card-entry lab.
 */
export default function Navbar({
  ctaLabel,
  ctaGlyph,
  condense = "fade",
}: {
  ctaLabel?: string;
  ctaGlyph?: string;
  condense?: CondenseMode;
} = {}) {
  const { wordmark, navLinks, cta } = SITE_CONTENT.header;
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);

  const label = ctaLabel ?? cta.label;
  const glyph = ctaGlyph ?? cta.glyph;

  /* Reads one number and sets one boolean React discards when unchanged, so
     this stays out of the way of the Work section's own scroll work.

     `hold` never condenses. `intent` watches DIRECTION rather than position —
     it cannot flicker, because settling in place is not a change. Everything
     else uses the hysteresis band above. */
  useEffect(() => {
    if (condense === "hold") {
      setCondensed(false);
      return;
    }

    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      if (condense === "intent") {
        // Ignore sub-pixel jitter and rubber-banding at the top.
        if (Math.abs(y - last) > 4) {
          setCondensed(y > last && y > CONDENSE_OUT);
          last = y;
        }
        return;
      }
      // `snap` deliberately keeps the ONE threshold that ships, so the lab's
      // control still reproduces the flicker the other modes are fixing. Wiring
      // the hysteresis into it too would leave nothing to compare against.
      if (condense === "snap") {
        setCondensed(y > CONDENSE_AT);
        return;
      }
      setCondensed((was) => (was ? y > CONDENSE_OUT : y > CONDENSE_IN));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [condense]);

  /* Snap is the only mode that unmounts. The others keep the links in the DOM
     so their width and opacity can animate, and mark the collapsed cluster
     `inert` — which removes it from the tab order the way `display: none` did,
     without removing it from the layout mid-transition. */
  const unmountLinks = condense === "snap" && condensed;
  const linksInert = condense !== "snap" && condensed;

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
      <span className="nav-cta__short">{cta.short}</span>
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
        className={`navbar navbar--yoke navbar--${condense} ${condensed ? "is-condensed" : ""}`}
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
            inert={!condensed || undefined}
            aria-hidden={!condensed || undefined}
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
