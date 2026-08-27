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
import { WORK_LANDING } from "@/data/work";
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

const HINT_ID = "mslx-scroll-hint";

export default function LandingAffordanceLab() {
  const [opts, setOpts] = useState<LandingOptions>(LANDING_DEFAULTS);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Armed by any landing param, so `?disc=` alone leaves this inert.
    const hasAny =
      params.has("landing") || params.has("start") || params.has("play") || params.has("cue");
    if (!hasAny && !params.has("lab")) return;
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
      const items = Array.from(landing.querySelectorAll<HTMLElement>(".wl-c2__item"));
      items.forEach((li, i) => {
        const chapter = targetChapter(opts.variant, i);
        const name = li.querySelector(".wl-c2__name")?.textContent ?? "";

        if (chapter === null) {
          // Not a control in this arm. `first` says so out loud; the others
          // simply leave the row as shipped.
          if (opts.variant === "first") {
            li.classList.add("mslx-preview");
            cleanups.push(() => li.classList.remove("mslx-preview"));
          }
          return;
        }

        /* role + tabindex rather than a real <button>, because this enhances
           existing markup from outside. If an arm wins, the row should become
           an actual <button> in the component — this is enough to judge feel,
           not enough to ship. */
        li.classList.add("mslx-tappable");
        li.setAttribute("role", "button");
        li.setAttribute("tabindex", "0");
        li.setAttribute("aria-label", `${name} — chapter ${chapter}`);

        const onClick = () => go(chapter);
        const onKey = (e: KeyboardEvent) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault(); // Space would otherwise page-scroll away.
          go(chapter);
        };
        li.addEventListener("click", onClick);
        li.addEventListener("keydown", onKey);
        cleanups.push(() => {
          li.classList.remove("mslx-tappable");
          li.removeAttribute("role");
          li.removeAttribute("tabindex");
          li.removeAttribute("aria-label");
          li.removeEventListener("click", onClick);
          li.removeEventListener("keydown", onKey);
        });
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

      /* ---- the cue the port dropped ------------------------------------ */
      if (opts.cue && !document.getElementById(HINT_ID)) {
        /* Rebuilt to the legacy markup exactly — `.scroll-hint` > mouse + text
           — because globals.css still styles all three class names. This is
           restoring an element, not designing one. */
        const hint = document.createElement("div");
        hint.id = HINT_ID;
        hint.className = "scroll-hint";
        const mouse = document.createElement("div");
        mouse.className = "scroll-hint__mouse";
        mouse.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        text.className = "scroll-hint__text";
        text.textContent = WORK_LANDING.scrollHint;
        hint.append(mouse, text);

        const list = landing.querySelector(".wl-c2__list");
        if (list?.parentElement === landing) list.after(hint);
        else landing.appendChild(hint);

        /* Half a restoration is worse than none: globals.css already styles
           `.scroll-hint.is-hidden` with a 600ms fade, and useWorkScroll already
           computes the flag for it (`progress > 0.08`) — but nothing has
           consumed either since the port. A cue that says "Scroll to explore"
           and is still saying it four chapters later stops being a cue and
           becomes furniture.
           
           Same threshold as the hook, computed the cheap way this branch has
           been arguing for all along: geometry cached outside the scroll frame,
           and only `scrollY` read inside it. */
        const work = document.querySelector<HTMLElement>("#work");
        let top = 0;
        let span = 0;
        const measure = () => {
          if (!work) return;
          top = work.getBoundingClientRect().top + window.scrollY;
          span = Math.max(work.offsetHeight - window.innerHeight, 0);
        };
        let queued = false;
        const read = () => {
          queued = false;
          if (span <= 0) return;
          const progress = (window.scrollY - top) / span;
          hint.classList.toggle("is-hidden", progress > 0.08);
        };
        const onScroll = () => {
          if (queued) return;
          queued = true;
          requestAnimationFrame(read);
        };
        measure();
        read();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);
        const ro = work ? new ResizeObserver(measure) : null;
        ro?.observe(work!);

        cleanups.push(() => {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", measure);
          ro?.disconnect();
          hint.remove();
        });
      }
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
