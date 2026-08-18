"use client";

// One stage — the Consulting card with the CTA row drawn in one variant's skin,
// wired to the real destination screens.
//
// The interaction model is the point of the prototype, and it differs from the
// live section's on purpose:
//
//   live      press the headline → the three paths appear → choosing one
//             collapses the other two and the chosen row becomes the header
//   this lab  the three choices are on screen from the first frame and STAY
//             there. Choosing one opens its screen underneath; the row is
//             persistent navigation, so switching paths is one click rather
//             than back-then-forward.
//
// The screen itself is the production `WorkTogetherScreen`, imported unchanged
// — this lab is judging the way in, not rewriting what it opens onto.
//
// `.ctar` is a size container named `ctar wt`. The second name is load-bearing:
// `.wt-screen`'s own narrow and large-display rules are `@container wt (...)`
// queries, so without it the screen would keep its two-column blocks and lose
// its sticky action bar inside the 390px frame.

import { useCallback, useEffect, useRef } from "react";
import {
  CTA_HINT,
  CTA_LABEL,
  CTA_ROW_BUTTONS,
  getPath,
  HERO_ALT,
  HERO_NARROW,
  HERO_WIDE,
  type CtaRowAccentId,
  type CtaRowVariantId,
  type PathId,
} from "@/data/ctaRowLab";
import WorkTogetherScreen from "@/components/work/WorkTogetherScreen";

interface Props {
  variant: CtaRowVariantId;
  accent: CtaRowAccentId;
  width: "desktop" | "narrow";
  reducedMotion: boolean;
  /**
   * Which screen is open. Owned by the shell rather than by the stage, for the
   * same reason the sibling lab shares one flow across its two frames: in a
   * side-by-side compare the point is to see ONE state at two widths. Local
   * state would also be lost on every viewport switch, because changing the
   * mode unmounts the stage.
   */
  openId: PathId | null;
  onOpenChange: (id: PathId | null) => void;
  /** Only the primary stage claims focus, so a side-by-side compare has one
      tab sequence rather than two interleaved ones. */
  primary: boolean;
}

export default function CtaRowStage({
  variant,
  accent,
  width,
  reducedMotion,
  openId,
  onOpenChange,
  primary,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  const titleId = `ctar-title-${width}`;
  const hintId = `ctar-hint-${width}`;

  const close = useCallback(() => onOpenChange(null), [onOpenChange]);

  // Escape closes the screen. Only the focusable stage listens, so in a
  // side-by-side compare one keypress doesn't close both.
  useEffect(() => {
    if (!openId || !primary) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, primary, close]);

  // Move focus into the screen when one opens, and back to the button that
  // opened it when it closes — otherwise closing drops focus to <body> and a
  // keyboard user loses their place in the row.
  const prevOpen = useRef<PathId | null>(null);
  useEffect(() => {
    if (!primary || prevOpen.current === openId) return;
    const opening = openId !== null;
    const returnTo = prevOpen.current;
    prevOpen.current = openId;

    const root = rootRef.current;
    if (!root) return;

    if (opening) {
      root.querySelector<HTMLElement>("[data-wt-focus='destination']")?.focus({
        preventScroll: true,
      });
    } else if (returnTo) {
      root
        .querySelector<HTMLElement>(`[data-ctar-btn='${returnTo}']`)
        ?.focus({ preventScroll: true });
    }
  }, [openId, primary]);

  const path = openId ? getPath(openId) : null;

  return (
    <div className={`ctar-frame ctar-frame--${width}`}>
      <section
        ref={rootRef}
        className="ctar"
        data-variant={variant}
        data-accent={accent}
        data-motion={reducedMotion ? "reduced" : "full"}
        data-open={openId ? "true" : "false"}
        aria-labelledby={titleId}
      >
        {/* The photo plane sits INSIDE .ctar, which is the backdrop root for
            .ctar__focus. A host-owned photo would be outside what
            backdrop-filter can sample and the whole treatment would silently
            flatten to a dim — the trap documented on WorkTogether's `media`
            prop. */}
        <div className="ctar__media" aria-hidden="true">
          {width === "narrow" ? (
            /* The 390px frame is a CONTAINER inside a wide viewport, so a
               viewport-based <source> would hand it the 3440px-wide plate and
               the narrow preview would silently be testing the wrong image.
               Pick the portrait crop directly from the frame instead. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className="cns-stage__img"
              data-crop="narrow"
              src={HERO_NARROW}
              alt={HERO_ALT}
              width={1440}
              height={3200}
            />
          ) : (
            <picture>
              {/* 900px, not 640px: at a ~720px stage the wide plate's crop
                  cuts the statue off the right edge. The portrait crop keeps
                  it centred, so tablet belongs on that plate too. */}
              <source media="(max-width: 900px)" srcSet={HERO_NARROW} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cns-stage__img"
                data-crop="wide"
                src={HERO_WIDE}
                alt={HERO_ALT}
                width={3440}
                height={1440}
              />
            </picture>
          )}
          <span className="cns-stage__vignette" />
        </div>

        <div className="ctar__focus" aria-hidden="true" />
        <div className="ctar__scrim" aria-hidden="true" />
        <div className="ctar__grain" aria-hidden="true" />

        <div className="ctar__copy">
          {/* Same id either way, so aria-labelledby always resolves. Swapping
              the element rather than restyling it avoids a serif-to-mono
              font-family change mid-transition, which cannot tween and reads
              as a glitch. Matches what the live section does. */}
          {openId ? (
            <p className="ctar__eyebrow" id={titleId}>
              {CTA_LABEL}
            </p>
          ) : (
            <h2 className="ctar__title" id={titleId}>
              {CTA_LABEL}
            </h2>
          )}

          <p className="ctar__hint" id={hintId}>
            {CTA_HINT}
          </p>

          <nav className="ctar__actions" aria-labelledby={hintId}>
            {CTA_ROW_BUTTONS.map((btn, i) => {
              const current = openId === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  data-ctar-btn={btn.id}
                  className={`ctar-btn ${btn.primary ? "is-primary" : "is-secondary"} ${
                    current ? "is-current" : ""
                  }`}
                  style={{ ["--btn-index" as string]: i }}
                  tabIndex={primary ? 0 : -1}
                  aria-expanded={current}
                  onClick={() => onOpenChange(current ? null : btn.id)}
                >
                  {/* Only ETB paints this — the diagonal wipe its bars run on
                      hover. Inert everywhere else. */}
                  <span className="ctar-btn__sheen" aria-hidden="true" />
                  <span className="ctar-btn__content">
                    <span className="ctar-btn__label">{btn.label}</span>
                    {/* One node, two jobs. ETB draws it as the bar's summary
                        line; every other iteration clips it to screen-reader
                        only, so the buttons stay small and the supporting line
                        the live section shows beside each path still reaches
                        assistive tech. */}
                    <span className="ctar-btn__lede">{btn.lede}</span>
                  </span>
                  <span className="ctar-btn__arrow" aria-hidden="true">
                    {current ? "↑" : variant === "etb" ? "›" : "→"}
                  </span>
                </button>
              );
            })}
          </nav>

          {path && (
            <div className="ctar__unfurl">
              <WorkTogetherScreen path={path} onBack={close} />
            </div>
          )}
        </div>
      </section>

      <p className="ctar-frame__tag">
        {width === "narrow" ? "390px — container query" : "desktop"}
      </p>
    </div>
  );
}
