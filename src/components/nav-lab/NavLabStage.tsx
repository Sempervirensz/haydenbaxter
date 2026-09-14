"use client";

// The stage overlay.
//
// It owns NO content. The page underneath is the real homepage composition (see
// `src/app/nav-lab/stage/page.dev.tsx`), and this mounts the concept navbar on
// top of it, hides the production one, and simulates every destination.
//
// WHY THE REAL PAGE AND NOT A MOCK
// A navbar is judged against what it sits on. The findings that decide this are
// all collisions: the bar over the WorldPulse photography, the bar over the
// Work Together chapter's LIGHT cobalt bars where white ink disappears, the bar
// over a pinned scene that is already using the top of the viewport. A
// reconstruction with stand-in tiles would be dark everywhere and would show
// none of them.
//
// TWO THINGS THIS DOES THAT THE REAL PAGE DOESN'T
//   1. It opens the soft lock on mount. `/` is `display: none` below the deck
//      until four cards are flipped, so without this there is nothing to be
//      sticky OVER. It opens it through `releaseSoftLock()` — the same event a
//      production nav link fires — not by editing the gate.
//   2. It hides the production navbar, because the concept replaces it. The
//      hero's nav clearance is a token (`--nav-height`), not a measurement of
//      that element, so the composition below is unaffected.

import { useCallback, useEffect, useRef, useState } from "react";
import { releaseSoftLock } from "@/components/design-lab/softLockEvents";
import Navbar from "@/components/Navbar";
import {
  DEFAULT_CONCEPT,
  DEFAULT_CONDENSE,
  NAV_LAB_CHANNEL,
  WORK_DETAIL_TRACKS,
  WORK_FALLBACK,
  type CondenseMode,
  type ConceptId,
  type LabAnchor,
  type LabMode,
  type NavLabMessage,
} from "@/data/navLab";
import NavLabNav, { type NavTarget } from "./NavLabNav";

/** How long a receipt stays up before it fades. Long enough to read the URL. */
const RECEIPT_MS = 2800;

/** The Work section is a dynamic import; its chapters aren't queryable at once. */
const MOUNT_TIMEOUT_MS = 2000;
const MOUNT_POLL_MS = 120;

export default function NavLabStage() {
  const [mode, setMode] = useState<LabMode>("concepts");
  const [concept, setConcept] = useState<ConceptId>(DEFAULT_CONCEPT);
  /* Refine drives the SHIPPED navbar. Undefined means "whatever production
     does", so the lab opens showing the real thing rather than a variant. */
  const [ctaLabel, setCtaLabel] = useState<string | undefined>(undefined);
  const [ctaGlyph, setCtaGlyph] = useState<string | undefined>(undefined);
  const [condense, setCondense] = useState<CondenseMode>(DEFAULT_CONDENSE);
  const [hubOpen, setHubOpen] = useState(false);
  const [receipt, setReceipt] = useState<NavTarget | null>(null);
  const timerRef = useRef<number | null>(null);

  /* Open the entry gate so there is a page to scroll.

     Deferred by a macrotask on purpose. This overlay is the FIRST child of the
     stage route and `SoftLockGate` is a later sibling, so React runs this
     effect before the gate's effect has subscribed to SOFT_LOCK_RELEASE —
     dispatched inline, the event lands with no listener and the page stays
     `is-locked` with every section present but zero-height. A timeout is used
     rather than rAF because rAF doesn't fire in a backgrounded tab, and this
     lab gets opened in one. */
  useEffect(() => {
    const id = window.setTimeout(() => releaseSoftLock(), 0);
    return () => window.clearTimeout(id);
  }, []);

  /* In CONCEPTS mode the eight directions replace the navbar, so production's
     is hidden — as a stylesheet rather than an edit to `Navbar.tsx`, so the lab
     leaves no mark on the component it is proposing to replace.

     In REFINE mode there is nothing to hide: the stage mounts the real navbar
     itself, below, and the whole point is that what you are judging is the
     shipping component. */
  useEffect(() => {
    if (mode !== "concepts") return;
    const style = document.createElement("style");
    style.dataset.navLab = "hide-production-nav";
    style.textContent =
      ".navbar, .nav-mobile, .nav-mobile__panel { display: none !important; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, [mode]);

  /* Scroll to a target that may not have mounted yet.

     The Work chapters arrive with a dynamic import, and `#work` is replaced
     rather than filled — an element resolved too early is a detached node that
     scrolls nowhere. So this resolves at press time and retries briefly. */
  const scrollToAnchor = useCallback((anchor: LabAnchor) => {
    const deadline = Date.now() + MOUNT_TIMEOUT_MS;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Resolve a Work chapter the way production does, because the Work section
       renders two different DOMs: the cinematic stack tags its chapters at
       >=1024px, and the mobile stack renders untagged `--detail` tracks. Asking
       only for the tagged form scrolls nowhere on every phone preset. */
    const resolve = (): HTMLElement | null => {
      if (anchor.selector) {
        return anchor.selector === "top"
          ? document.body
          : document.querySelector<HTMLElement>(anchor.selector);
      }
      if (anchor.tagged) {
        const tagged = document.querySelector<HTMLElement>(anchor.tagged);
        if (tagged) return tagged;
      }
      if (anchor.detailIndex !== undefined) {
        const tracks = document.querySelectorAll<HTMLElement>(WORK_DETAIL_TRACKS);
        if (tracks.length > anchor.detailIndex) return tracks[anchor.detailIndex];
      }
      return null;
    };

    const attempt = () => {
      const el = resolve();
      if (!el) {
        if (Date.now() < deadline) {
          window.setTimeout(attempt, MOUNT_POLL_MS);
        } else {
          // The chapters never mounted. Land on the section rather than doing
          // nothing, so a press is never silently inert.
          document
            .querySelector<HTMLElement>(WORK_FALLBACK)
            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
        return;
      }
      if (anchor.selector === "top") {
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        return;
      }
      // Offset by the bar, so a sticky navbar doesn't land on top of the thing
      // it just scrolled to — which is itself one of the findings this lab is
      // meant to surface.
      const bar = document.querySelector<HTMLElement>(".nlab-nav__inner");
      const offset = bar?.getBoundingClientRect().height ?? 0;
      const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - offset - 8);
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });

      // `behavior: "smooth"` is silently a no-op inside a CSS-scaled iframe,
      // which is exactly how this route is framed by the lab shell — the scroll
      // is requested, nothing moves, and the concept looks like it ignored the
      // control. Instant scrolling is unaffected, so the request is checked and
      // repeated without the animation. Harmless where smooth does work: by
      // then the position already matches and the second call is a no-op.
      window.setTimeout(() => {
        if (Math.abs(window.scrollY - top) > 4) window.scrollTo(0, top);
      }, 600);
    };

    attempt();
  }, []);

  const navigate = useCallback(
    (target: NavTarget) => {
      setReceipt(target);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setReceipt(null), RECEIPT_MS);
      if (target.anchor) scrollToAnchor(target.anchor);
    },
    [scrollToAnchor]
  );

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  /* Controls from the lab shell, which frames this route in an iframe. */
  useEffect(() => {
    const onMessage = (e: MessageEvent<NavLabMessage>) => {
      const msg = e.data;
      if (!msg || msg.source !== NAV_LAB_CHANNEL) return;
      if (msg.action === "concept") setConcept(msg.value);
      if (msg.action === "hub") setHubOpen(msg.value);
      if (msg.action === "jump") scrollToAnchor(msg.value);
      if (msg.action === "mode") setMode(msg.value);
      if (msg.action === "condense") setCondense(msg.value);
      // "" is a real choice for the glyph (none), so only the label treats an
      // empty string as "leave production alone".
      if (msg.action === "ctaLabel") setCtaLabel(msg.value || undefined);
      if (msg.action === "ctaGlyph") setCtaGlyph(msg.value);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [scrollToAnchor]);

  /* Refine: the real navbar, with the two things still open about it wired to
     the shell's controls. Keyed on the mode so switching back and forth
     remounts it cleanly rather than leaving a half-collapsed bar behind. */
  if (mode === "refine") {
    return (
      <Navbar
        key={`refine:${condense}`}
        ctaLabel={ctaLabel}
        ctaGlyph={ctaGlyph}
        condense={condense}
      />
    );
  }

  return (
    <>
      <NavLabNav
        concept={concept}
        onNavigate={navigate}
        hubOpen={hubOpen}
        onHubOpenChange={setHubOpen}
      />

      {/* The destination receipt. Production routing for About and Resume is
          not finalized and Journal's host is still open, so the lab states the
          destination instead of navigating to an invented one. */}
      {receipt && (
        <div className="nlab-receipt" role="status">
          <span className="nlab-receipt__tag">{receipt.label}</span>
          <span className="nlab-receipt__url">{receipt.href}</span>
          {receipt.external && <span className="nlab-receipt__flag">external</span>}
          {receipt.provisional && <span className="nlab-receipt__flag">provisional</span>}
        </div>
      )}
    </>
  );
}
