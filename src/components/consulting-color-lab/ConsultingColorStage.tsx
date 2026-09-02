"use client";

// One framed stage: the real "Let's work together" composition with the
// Consulting screen open on it.
//
// Everything outside the paper sheet is production — the same photograph and
// grain, the same three candy bars in the same order, the same `.wt` depth
// ladder. That is deliberate. The sheet is judged sitting on the dark ground
// it actually sits on, and because the surround never varies, any difference
// between two stages is a difference in the treatment.
//
// `.wt` is a size container named `wt`, so mounting it in a 390px frame yields
// the real narrow layout with no viewport media query — the same trick the
// paths lab and the CTA row lab use.

import { useCallback, useEffect, useRef } from "react";
import { CTA_HINT, CTA_LABEL, PATHS } from "@/data/workTogether";
import { HERO_ALT, HERO_NARROW, HERO_WIDE } from "@/data/ctaRowLab";
import type { ActionsId, MastheadId, TreatmentId } from "@/data/consultingColorLab";
import ConsultingColorScreen from "./ConsultingColorScreen";

interface Props {
  width: "desktop" | "narrow" | "gallery";
  treatment: TreatmentId;
  masthead: MastheadId;
  actions?: ActionsId;
  /** Only one stage claims the tab order, so a compare has one tab sequence
      rather than four interleaved ones. */
  primary: boolean;
  /** Caption under the frame. */
  label: string;
  note?: string;
}

export default function ConsultingColorStage({
  width,
  treatment,
  masthead,
  actions,
  primary,
  label,
  note,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  /* The sheet is the subject of the lab, so it is open on mount and Back does
     not close it — there is nothing to compare underneath. Escape is still
     wired on the primary stage only, because a keyboard user who presses it
     expects something to happen; here it returns focus to the Consulting bar,
     which is where production would send it. */
  const refocus = useCallback(() => {
    rootRef.current
      ?.querySelector<HTMLElement>("[data-wt-row='consulting']")
      ?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!primary) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") refocus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [primary, refocus]);

  return (
    <div className={`ccl-frame ccl-frame--${width}`}>
      <div
        ref={rootRef}
        className="wt ccl-stage"
        data-step="destination"
      >
        <div className="wt__media" aria-hidden="true">
          {width === "narrow" ? (
            /* The narrow frame is a CONTAINER inside a wide viewport, so a
               viewport-based <source> would hand it the 3440px plate and the
               preview would be testing the wrong crop. */
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
          <p className="wt__eyebrow">{CTA_LABEL}</p>
          <p className="wt__hint" id={`ccl-hint-${width}-${treatment}`}>
            {CTA_HINT}
          </p>

          {/* Production styling, in every treatment. The bars are not what is
              being explored, and skinning them would mean two variables. */}
          <nav className="wt__rows" aria-labelledby={`ccl-hint-${width}-${treatment}`}>
            {PATHS.map((p, i) => {
              const current = p.id === "consulting";
              return (
                <button
                  key={p.id}
                  type="button"
                  data-wt-row={p.id}
                  className={`wt__row ${current ? "is-primary is-current" : "is-secondary"}`}
                  style={{ ["--row-index" as string]: i }}
                  aria-expanded={current}
                  tabIndex={primary ? 0 : -1}
                  onClick={refocus}
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

          <div className="wt__unfurl">
            <ConsultingColorScreen
              onBack={refocus}
              treatment={treatment}
              masthead={masthead}
              actions={actions}
            />
          </div>
        </div>
      </div>

      <p className="ccl-frame__tag">
        <span>{label}</span>
        {note && <span className="ccl-frame__note">{note}</span>}
      </p>
    </div>
  );
}
