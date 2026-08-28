"use client";

/* The Work landing contents list — and, as of now, actual navigation.
 *
 * WHY THIS EXISTS
 * Visitors reached the CD screen and tapped these titles expecting to be taken
 * somewhere. Nothing happened. They were not misreading a subtle cue: on a
 * phone the list is deliberately styled as a readable contents list — full
 * opacity, gold numerals, 22-28px serif — so it reads as a menu, because it is
 * one. It just had no behaviour behind it.
 *
 * WHY THE BUTTON IS AN OVERLAY RATHER THAN A WRAPPER
 * The semantically tidier markup is <li><button><span/><span/></button></li>.
 * But `.wl-c2__item` is the grid, and five rules across as many media queries
 * set its columns, gap and padding; moving the grid onto a wrapping button
 * means re-pointing all of them and risking a layout regression at some width
 * nobody rechecks. So the spans stay exactly where they were and the control is
 * a transparent button stretched over the row: a real <button> with a real
 * accessible name, full-row hit target, and not one existing rule touched.
 *
 * Extracted because three components rendered this list near-identically
 * (WorkLanding for desktop, WorkSectionMobile for phones, the legacy
 * WorkSection for labs). Adding behaviour to three copies is how two of them
 * quietly become wrong.
 */

import { useCallback } from "react";
import { WORK_LANDING, WORK_SCROLL_CONFIG } from "@/data/work";
import { findChapters } from "./findChapters";

interface Props {
  /** The chapter the disc is currently pointing at, or "" for none. */
  activeLabel: string;
}

export default function WorkChapterList({ activeLabel }: Props) {
  const trackList = WORK_SCROLL_CONFIG.zones.filter((z) => z.label !== "");

  const go = useCallback((chapter: number) => {
    /* Same resolver the story spine uses, so a title and a spine marker for the
       same chapter cannot scroll to different places. */
    const el = findChapters()[chapter - 1];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <ol className="wl-c2__list" aria-label={WORK_LANDING.title}>
      {trackList.map((zone, i) => {
        const isActive = zone.label === activeLabel;
        const number = String(i + 1).padStart(2, "0");
        return (
          <li
            key={zone.label}
            className={`wl-c2__item ${isActive ? "is-active" : ""}`}
          >
            <span className="wl-c2__num">{number}</span>
            <span className="wl-c2__name">{zone.label}</span>
            <button
              type="button"
              className="wl-c2__hit"
              onClick={() => go(i + 1)}
              aria-current={isActive ? "step" : undefined}
              /* The visible text is not inside the button, so name it here.
                 The ordinal is included because "WorldPulse" alone does not
                 say that this is chapter one of four. */
              aria-label={`${zone.label} — chapter ${i + 1} of ${trackList.length}`}
            />
          </li>
        );
      })}
    </ol>
  );
}
