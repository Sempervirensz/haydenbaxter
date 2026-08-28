"use client";

/* Mobile scroll lab — landing affordances, applied to the REAL landing screen.
 *
 * This edits no production component. The chapter list is rendered in four
 * places (WorkSection, WorkSectionMobile, WorkLanding, and the Safari lab), and
 * threading variant props through all of them to answer a design question would
 * leave lab wiring in shipped components long after the question was settled.
 *
 * So it does what StoryProgressSpine does: finds the live nodes by the same
 * selectors and paints on top. Everything it adds is namespaced `mslx-` and
 * everything it touches is restored on cleanup, so switching arms mid-session
 * cannot leave a half-applied variant behind and make the next arm lie.
 *
 * Dev-only, mounted from page.tsx behind a statically-false ternary.
 */

import { useEffect, useState } from "react";
import { findChapters } from "@/components/work/findChapters";
import {
  LANDING_DEFAULTS,
  isLandingVariant,
  targetChapter,
  type LandingOptions,
} from "./landing-variants";
import {
  listenForLandingMessages,
  readLandingOptions,
  subscribeLanding,
} from "./landing-bus";
import "./mobile-scroll-lab.css";

export default function LandingAffordanceLab() {
  const [opts, setOpts] = useState<LandingOptions>(LANDING_DEFAULTS);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    /* Armed by ANY lab param, `?disc=` included.
       
       It used to require a landing param specifically, which made the HUD's
       landing buttons dead on a phone opened with `?disc=cached` alone: the
       controls were there and pressing them did nothing, which is the exact
       failure these arms exist to fix. */
    const hasAny = ["landing", "start", "play", "cue", "lab", "disc"].some((k) =>
      params.has(k)
    );
    if (!hasAny) return;
    setArmed(true);
    setOpts(readLandingOptions());
    const unsubscribe = subscribeLanding(() => setOpts(readLandingOptions()));
    const unlisten = listenForLandingMessages();
    return () => {
      unsubscribe();
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (!armed) return;
    let cleanups: Array<() => void> = [];
    /* The observer below watches the same subtree this function mutates, so it
       re-enters unless something stops it. Node identity does: everything
       added here is appended INSIDE nodes that already existed, so the landing
       screen and the first row keep their identity across our own writes and
       change only when React actually replaces them. */
    let seenLanding: HTMLElement | null = null;
    let seenFirstItem: Element | null = null;

    const apply = (force: boolean) => {

      const landing = document.querySelector<HTMLElement>(".work__screen--landing");
      const firstItem = landing?.querySelector(".wl-c2__item") ?? null;
      if (!force && landing === seenLanding && firstItem === seenFirstItem) return;
      seenLanding = landing;
      seenFirstItem = firstItem;
      if (!landing) return;

      // Tear down before re-applying: this runs again whenever Work remounts,
      // and stacked listeners would fire one scroll per past arm.
      cleanups.forEach((fn) => fn());
      cleanups = [];

      const go = (chapter: number) => {
        const el = findChapters()[chapter - 1];
        if (!el) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      };

      /* ---- the chapter list ------------------------------------------- */
      /* The rows are real <button>s now (WorkChapterList), so this no longer
         paints controls onto them — it argues with the ones already there.
         Adding a second role="button" over a real button was the failure mode
         waiting to happen here. */
      const items = Array.from(landing.querySelectorAll<HTMLElement>(".wl-c2__item"));
      items.forEach((li, i) => {
        const hit = li.querySelector<HTMLButtonElement>(".wl-c2__hit");
        if (!hit) return;
        const chapter = targetChapter(opts.variant, i);

        if (chapter === null) {
          // `first`: this row stops being a control and says so.
          li.classList.add("mslx-preview");
          hit.disabled = true;
          cleanups.push(() => {
            li.classList.remove("mslx-preview");
            hit.disabled = false;
          });
          return;
        }

        if (chapter === i + 1) return; // shipped — leave the real button alone.

        /* `funnel`: send every row to 01. Captured before the component's own
           handler so the shipped destination never runs, rather than racing
           two scrollIntoView calls against each other. */
        const divert = (e: Event) => {
          e.stopImmediatePropagation();
          e.preventDefault();
          go(chapter);
        };
        hit.addEventListener("click", divert, true);
        cleanups.push(() => hit.removeEventListener("click", divert, true));
      });

      /* ---- chapter 01 as the next step -------------------------------- */
      if (opts.start && items[0]) {
        const first = items[0];
        first.classList.add("mslx-next");
        const tag = document.createElement("span");
        tag.className = "mslx-startTag";
        tag.textContent = "Start here";
        first.appendChild(tag);
        cleanups.push(() => {
          first.classList.remove("mslx-next");
          tag.remove();
        });
      }

      /* ---- the CD as a play control ------------------------------------ */
      if (opts.play !== "off") {
        const wrap = landing.querySelector<HTMLElement>(".cd-player-wrap");
        if (wrap) {
          const hadAriaHidden = wrap.getAttribute("aria-hidden");
          wrap.classList.add("mslx-play");
          // It becomes a control, so it can no longer be hidden from everyone
          // who is not looking at it.
          wrap.removeAttribute("aria-hidden");
          wrap.setAttribute("role", "button");
          wrap.setAttribute("tabindex", "0");
          wrap.setAttribute("aria-label", "Play — start the story at chapter 1");

          const badge = document.createElement("span");
          badge.className = `mslx-playBadge mslx-playBadge--${opts.play}`;
          badge.setAttribute("aria-hidden", "true");
          // `shell` lights the printed button rather than drawing a new one,
          // so it carries no glyph of its own — the artwork already says PLAY.
          badge.textContent = opts.play === "hub" ? "▶" : "";
          wrap.appendChild(badge);

          const onClick = () => go(1);
          const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            go(1);
          };
          wrap.addEventListener("click", onClick);
          wrap.addEventListener("keydown", onKey);
          cleanups.push(() => {
            wrap.classList.remove("mslx-play");
            if (hadAriaHidden !== null) wrap.setAttribute("aria-hidden", hadAriaHidden);
            wrap.removeAttribute("role");
            wrap.removeAttribute("tabindex");
            wrap.removeAttribute("aria-label");
            badge.remove();
            wrap.removeEventListener("click", onClick);
            wrap.removeEventListener("keydown", onKey);
          });
        }
      }

      /* The scroll cue is not an arm any more — it ships. See
         components/work/ScrollCue.tsx. Injecting a second one here would have
         put two "Scroll to explore" prompts on the screen. */
    };

    apply(true);

    /* Work mounts asynchronously and swaps branch wholesale at 1024px, so the
       nodes this painted on can be replaced under it. Re-apply when they are. */
    const mo = new MutationObserver(() => apply(false));
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [armed, opts]);

  return null;
}
