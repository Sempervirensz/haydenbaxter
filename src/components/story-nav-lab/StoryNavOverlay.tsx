"use client";

// The navigator, attached to the REAL homepage.
//
// The first version of this lab rendered a reconstruction of the site — its own
// markup, its own copy, its own idea of how much text a chapter holds. That made
// it unapprovable: you cannot judge a navigator against a page that is not the
// page. This attaches to the real thing instead.
//
// It owns no content. It finds the four Work chapters in the live DOM using the
// same selectors production already relies on (see CONSULTING_TARGET in
// src/data/entryChoice.ts), reads the real document scroll, and paints on top.
// Remove this component and the page underneath is untouched.

import { useCallback, useEffect, useRef, useState } from "react";
import StoryNav from "./StoryNav";
import { releaseSoftLock } from "@/components/design-lab/softLockEvents";
import {
  DEFAULT_STAGE,
  PAGE_CONTEXTS,
  STORY_NAV_CHANNEL,
  STORY_SECTIONS,
  type StageState,
} from "@/data/storyNavLab";

/**
 * The live chapter elements, in order.
 *
 * Desktop (WorkSectionCinematic, >=1024px) tags every chapter with
 * `data-cstack-id`. Mobile (WorkSectionMobile) renders the same four
 * `.work__chapter--detail` tracks untagged. Both only resolve once Work has
 * mounted — WorkSectionResponsive renders a bare `<section id="work">` until it
 * has measured the viewport and its dynamic import has landed — which is what
 * makes an empty result usable as a "not ready yet" signal.
 */
function findChapters(): HTMLElement[] {
  const tagged = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cstack-id]")
  ).sort((a, b) => Number(a.dataset.cstackId) - Number(b.dataset.cstackId));
  if (tagged.length) return tagged;
  return Array.from(
    document.querySelectorAll<HTMLElement>("#work .work__chapter--detail")
  );
}

export default function StoryNavOverlay() {
  const [state, setState] = useState<StageState>(DEFAULT_STAGE);
  const [section, setSection] = useState(1);
  const [inStory, setInStory] = useState(false);
  const [progress, setProgress] = useState(0);
  const chaptersRef = useRef<HTMLElement[]>([]);

  // ── Controls from the lab shell ──────────────────────────────────────────
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== STORY_NAV_CHANNEL) return;
      if (d.action === "state") setState(d.value as StageState);
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ source: STORY_NAV_CHANNEL, action: "ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // ── Track the real chapters as Work mounts / the viewport branch flips ───
  useEffect(() => {
    const sync = () => {
      chaptersRef.current = findChapters();
    };
    sync();
    // Work mounts asynchronously and swaps wholesale at 1024px, so re-resolve
    // rather than caching once.
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  // ── Go where the lab's context control points, on the real page ──────────
  // Everything past the deck is behind the soft-lock gate, so most destinations
  // mean: release the gate, wait for Work to actually mount (it is a dynamic
  // import behind a viewport measurement), then land. Reuses the site's own
  // release event rather than reaching into gate internals.
  useEffect(() => {
    const ctx = PAGE_CONTEXTS.find((c) => c.id === state.context);
    if (!ctx) return;

    if (!ctx.needsGate) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    releaseSoftLock();

    let cancelled = false;
    let tries = 0;

    const land = () => {
      if (cancelled) return;
      const target = ctx.chapter
        ? findChapters()[ctx.chapter - 1]
        : ctx.hash
          ? document.querySelector<HTMLElement>(ctx.hash)
          : null;

      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      // Work mounts asynchronously; give it a bounded number of frames rather
      // than settling for the empty #work shell.
      if (tries++ < 60) requestAnimationFrame(land);
    };
    requestAnimationFrame(land);
    return () => {
      cancelled = true;
    };
  }, [state.context]);

  // ── Active section from the real document scroll ─────────────────────────
  // Deliberately position-based rather than reusing useWorkScroll's
  // screenBreaks: the hook short-circuits entirely at <=640px with a coarse
  // pointer, so on phones it would report nothing at all.
  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const chapters = chaptersRef.current;
      if (!chapters.length) {
        setInStory(false);
        return;
      }
      const mid = window.innerHeight / 2;
      let current = 0;
      chapters.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= mid) current = i + 1;
      });

      const first = chapters[0].getBoundingClientRect();
      const last = chapters[chapters.length - 1].getBoundingClientRect();
      // "In the story" = the Work section is the thing on screen.
      setInStory(first.top <= mid && last.bottom > 0);
      if (current > 0) setSection(current);

      const startY = window.scrollY + first.top;
      const endY = window.scrollY + last.bottom - window.innerHeight;
      const span = Math.max(1, endY - startY);
      setProgress(Math.min(1, Math.max(0, (window.scrollY - startY) / span)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Report the live section up so the lab readout cannot claim a section the
  // page is not actually on.
  useEffect(() => {
    window.parent?.postMessage(
      { source: STORY_NAV_CHANNEL, action: "section", value: inStory ? section : 0 },
      "*"
    );
  }, [section, inStory]);

  const navigate = useCallback(
    (id: number) => {
      const el = chaptersRef.current[id - 1];
      if (!el) return;
      el.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      if (state.useHash) {
        const s = STORY_SECTIONS.find((x) => x.id === id);
        if (s) {
          window.history.replaceState(
            null,
            "",
            `#${s.name.toLowerCase().replace(/\s+/g, "-")}`
          );
        }
      }
    },
    [state.reducedMotion, state.useHash]
  );

  if (!inStory) return null;

  return (
    <StoryNav
      variant={state.variant}
      counter={state.counter}
      section={section}
      onNavigate={navigate}
      expanded={state.expanded}
      onExpandedChange={(next) => setState((p) => ({ ...p, expanded: next }))}
      reducedMotion={state.reducedMotion}
      progress={progress}
    />
  );
}
