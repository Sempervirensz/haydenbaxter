"use client";

// One framed stage — the live "Let's work together" composition with only the
// Consulting answer swapped out.
//
// Everything outside that one panel is the production article, deliberately:
// the same photograph and grain, the same serif headline in the sky, the same
// `.wt__row` candy bars in the same order, and the same `WorkTogetherScreen`
// for Explore WorldPulse and Review My Experience. The lab is judging ONE
// change, so nothing else is allowed to differ.
//
// It is a copy of `WorkTogether.tsx` rather than a prop added to it, because
// the brief is explicit that production stays untouched until this is settled.
// If the two paths ship, the merge is small: give WorkTogether an optional
// screen-renderer prop and delete this file.
//
// `.wt` is a size container named `wt`, so mounting it in a 390px frame gives
// the real narrow layout without a viewport media query — the same trick the
// CTA row lab uses.

import { useCallback, useEffect, useRef } from "react";
import { CTA_HINT, CTA_LABEL, PATHS, getPath, type PathId } from "@/data/workTogether";
import {
  getLayout,
  type PlayKeyId,
  type TrackStyleId,
} from "@/data/consultingPathsLab";
import { HERO_ALT, HERO_NARROW, HERO_WIDE } from "@/data/ctaRowLab";
import WorkTogetherScreen from "@/components/work/WorkTogetherScreen";
import ConsultingPathsScreen, { type ScreenSkin } from "./ConsultingPathsScreen";
import ConsultingPathsSoloScreen from "./ConsultingPathsSoloScreen";
import type { ConsultingPathId } from "@/data/consultingPathsLab";

interface Props {
  width: "desktop" | "narrow" | "gallery";
  /** Which top-level choice is open. Owned by the shell so a side-by-side
      compare shows ONE state at two widths, and switching viewport mode —
      which unmounts a stage — doesn't drop it. */
  openId: PathId | null;
  onOpenChange: (id: PathId | null) => void;
  /** Only the primary stage claims focus and the Escape key, so a compare has
      one tab sequence rather than two interleaved ones. */
  primary: boolean;
  /** false renders the production consulting panel instead, for A/B. */
  twoPaths: boolean;
  /** Which direction, palette, surface and type scheme to draw. */
  skin: ScreenSkin;
  /**
   * Whether the three top-level bars follow the skin too.
   *
   * "production" leaves `work-together.css` entirely in charge of them, which
   * is what ships today and what the redesign has to be argued against.
   */
  rows: "skin" | "production";
  /** Tracklist only: which drawing of the three choices. */
  trackStyle: TrackStyleId;
  /** Tracklist only: which transport key. */
  playKey: PlayKeyId;
  /** Gallery only: the direction's name and the one-line argument for it. */
  label?: string;
  note?: string;
  /** Gallery only: open a path on mount, so the contact sheet compares the
      expanded state rather than five identical rest states. */
  initialOpen?: ConsultingPathId | null;
}

export default function ConsultingPathsStage({
  width,
  openId,
  onOpenChange,
  primary,
  twoPaths,
  skin,
  rows,
  trackStyle,
  playKey,
  label,
  note,
  initialOpen = null,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => onOpenChange(null), [onOpenChange]);

  useEffect(() => {
    if (!openId || !primary) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, primary, close]);

  // Focus into the screen on open, back to the bar that opened it on close.
  const prevOpen = useRef<PathId | null>(null);
  useEffect(() => {
    if (!primary || prevOpen.current === openId) return;
    const opening = openId !== null;
    const returnTo = prevOpen.current;
    prevOpen.current = openId;

    const root = rootRef.current;
    if (!root) return;

    if (opening) {
      root
        .querySelector<HTMLElement>("[data-wt-focus='destination']")
        ?.focus({ preventScroll: true });
    } else if (returnTo) {
      root
        .querySelector<HTMLElement>(`[data-wt-row='${returnTo}']`)
        ?.focus({ preventScroll: true });
    }
  }, [openId, primary]);

  const path = openId ? getPath(openId) : null;
  const showTwoPaths = twoPaths && openId === "consulting";
  // In the redesign, all three tabs wear the same skin — otherwise switching
  // tabs switches design systems mid-section. Production mode leaves every
  // screen exactly as it ships, which is what makes the A/B fair.
  const showSolo = twoPaths && path !== null && openId !== "consulting";

  return (
    <div className={`cpl-frame cpl-frame--${width}`}>
      <div
        ref={rootRef}
        className="wt cpl-stage"
        data-step={openId ? "destination" : "intro"}
        // The bars sit outside `.cpp-screen`, so the skin tokens have to be
        // readable from the stage as well as from the sheet. Nothing here
        // changes a label, an order, or the disclosure semantics — only how
        // the three choices are drawn.
        data-rows={rows}
        data-track={trackStyle}
        data-key={playKey}
        data-layout={skin.layout}
        data-palette={skin.palette}
        data-surface={skin.surface}
        data-type={skin.type ?? getLayout(skin.layout).type}
        data-button={skin.button ?? getLayout(skin.layout).button}
        // Auto means "whatever this direction's bars want", which is not always
        // what its CTA wants — see `rowButton` in consultingPathsLab.ts. An
        // explicit choice still governs both.
        data-row-button={skin.button ?? getLayout(skin.layout).rowButton}
      >
        <div className="wt__media" aria-hidden="true">
          {width === "narrow" ? (
            /* The narrow frame is a CONTAINER inside a wide viewport, so a
               viewport-based <source> would hand it the 3440px plate and the
               preview would silently be testing the wrong crop. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className="cns-stage__img"
              src={HERO_NARROW}
              alt={HERO_ALT}
              width={1440}
              height={3200}
            />
          ) : (
            <picture>
              <source media="(max-width: 900px)" srcSet={HERO_NARROW} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cns-stage__img"
                src={HERO_WIDE}
                alt={HERO_ALT}
                width={3440}
                height={1440}
              />
            </picture>
          )}
          <span className="cns-stage__vignette" />
        </div>

        <div className="wt__focus" aria-hidden="true" />
        <div className="wt__scrim" aria-hidden="true" />
        <div className="wt__grain" aria-hidden="true" />

        <div className="wt__copy">
          {openId ? (
            <p className="wt__eyebrow">{CTA_LABEL}</p>
          ) : (
            <h2 className="wt__title">{CTA_LABEL}</h2>
          )}

          <p className="wt__hint" id={`cpl-hint-${width}`}>
            {CTA_HINT}
          </p>

          {/* The three top-level choices, unchanged and in the shipped order. */}
          <nav className="wt__rows" aria-labelledby={`cpl-hint-${width}`}>
            {PATHS.map((p, i) => {
              const current = openId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  data-wt-row={p.id}
                  className={`wt__row ${p.id === "consulting" ? "is-primary" : "is-secondary"} ${
                    current ? "is-current" : ""
                  }`}
                  style={{ ["--row-index" as string]: i }}
                  aria-expanded={current}
                  tabIndex={primary ? 0 : -1}
                  onClick={() => onOpenChange(current ? null : p.id)}
                >
                  <span className="wt__rowSheen" aria-hidden="true" />
                  <span className="wt__rowMain">
                    <span className="wt__label">{p.label}</span>
                    <span className="wt__lede">{p.lede}</span>
                  </span>
                  <span className="wt__chev" aria-hidden="true">
                    {current ? "↑" : "›"}
                  </span>
                </button>
              );
            })}
          </nav>

          {path && (
            <div className="wt__unfurl">
              {showTwoPaths ? (
                <ConsultingPathsScreen
                  onBack={close}
                  skin={skin}
                  initialOpen={initialOpen}
                  // Remount when the direction changes so a gallery stage and a
                  // single stage never share stale open-state across a skin
                  // switch — and so `initialOpen` is honoured every time.
                  key={skin.layout}
                />
              ) : showSolo ? (
                <ConsultingPathsSoloScreen path={path} onBack={close} skin={skin} />
              ) : (
                <WorkTogetherScreen path={path} onBack={close} />
              )}
            </div>
          )}
        </div>
      </div>

      <p className="cpl-frame__tag">
        <span>{label ?? (width === "narrow" ? "390px — container query" : "desktop")}</span>
        {note && <span className="cpl-frame__note">{note}</span>}
      </p>
    </div>
  );
}
