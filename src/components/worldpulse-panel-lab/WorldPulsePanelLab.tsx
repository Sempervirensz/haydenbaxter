"use client";

// The WorldPulse destination panel, at four container widths.
//
// WHY THIS EXISTS
//
// WorldPulse is the last destination screen still on `WorkTogetherSolo`'s
// generic two-block sheet. Experience moved to its own composition
// (`ExperienceScreen`) and the consulting pair has `ConsultingPathsScreen`, so
// the comment at the top of WorkTogetherSolo — "these two screens keep
// production's information architecture exactly" — now describes a set of one.
// This lab is the surface for changing that.
//
// IT FRAMES THE REAL PANELS, IT DOES NOT REBUILD THEM
//
// Both variants are imported and rendered — `WorkTogetherSolo` at the real
// WorldPulse path for the before, `WorldPulseScreen` for the after — inside
// the real `.wt` chrome carrying production's
// nine `data-` attributes. Those attributes are not decoration: consulting-
// paths.css selects on them, and dropping one drops a point of specificity out
// of every rule that matched it. A reconstruction would hide exactly the
// findings the redesign has to be decided on.
//
// WHY FOUR WIDTHS, AND WHY THESE FOUR
//
// The panel's layout rules are container queries against `.wt`, and they turn
// at 700px. So the frames straddle that boundary — 375 and 680 under it, 701
// and 1180 over — which is what makes the capability-clipping visible: at
// <=700px `.cpp-path__cap:nth-child(n + 4)` is `display: none`, and the solo
// panel's own opt-out loses to it on source order.
//
// Nothing here is imported BY the site — the dependency runs one way — and the
// route is `page.dev.tsx`, so it is not built into the deployed app.

import { useCallback, useEffect, useRef, useState } from "react";
import { CTA_LABEL, PATHS, getPath } from "@/data/workTogether";
import WorkTogetherSolo from "@/components/work/WorkTogetherSolo";
import WorldPulseScreen from "@/components/work/WorldPulseScreen";
import "@/components/work/work-together.css";
import "@/components/work/consulting-paths.css";
import "./worldpulse-panel-lab.css";

const WORLDPULSE_PATH = getPath("worldpulse");

/** The shipped scheme, copied attribute for attribute from WorkTogether.tsx. */
const SCHEME = {
  "data-rows": "skin",
  "data-layout": "tracklist",
  "data-palette": "cobalt-brass",
  "data-surface": "paper",
  "data-type": "house",
  "data-button": "cue",
  "data-row-button": "rule",
  "data-track": "player",
  "data-key": "plain",
} as const;

/**
 * The photo plane. Production passes this in from the host rather than
 * rendering it inside `.wt`, and it has to stay a CHILD of `.wt`: that element
 * is the backdrop root for `.wt__focus`, so a photo hoisted out of it still
 * takes the dim but no longer feeds the blur ladder — which reads as "too
 * dark" rather than as a bug.
 */
const IMG = "/consulting/mobile-statue.webp";

/**
 * Heights are the card heights the section actually gets at each width, not
 * round numbers: the point of the readout is whether the sheet fits the card,
 * and a generous frame would answer yes to everything.
 */
const FRAMES: { w: number; h: number; note: string }[] = [
  { w: 375, h: 812, note: "phone · under the 700px turn" },
  { w: 680, h: 900, note: "just under the turn" },
  { w: 701, h: 900, note: "just over the turn" },
  { w: 1180, h: 820, note: "laptop" },
];

interface Fit {
  content: number;
  box: number;
}

function Frame({
  w,
  h,
  note,
  variant,
}: {
  w: number;
  h: number;
  note: string;
  /** `before` is the shipped two-block sheet; `after` is the new screen. */
  variant: "before" | "after";
}) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  const [caps, setCaps] = useState<string>("");

  const measure = useCallback(() => {
    const el = sheetRef.current?.querySelector<HTMLElement>(".cpp-screen");
    if (!el) return;
    setFit({ content: el.scrollHeight, box: el.clientHeight });

    // How many capability chips SURVIVE the cascade, per block. This is the
    // number the clipping bug shows up in, and reading it off computed style
    // rather than off the data is the whole point — the items are all in the
    // DOM either way.
    const groups = [...el.querySelectorAll(".cpp-path__caps")].map((g) => {
      const shown = [...g.children].filter(
        (c) => getComputedStyle(c).display !== "none"
      ).length;
      return `${shown}/${g.children.length}`;
    });
    setCaps(groups.join("  "));
  }, []);

  useEffect(() => {
    measure();
    const el = sheetRef.current?.querySelector<HTMLElement>(".cpp-screen");
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const over = fit ? fit.content - fit.box : 0;

  return (
    <figure className="wplab__frame">
      <figcaption className="wplab__cap">
        <span className="wplab__w">{w}px</span>
        <span className="wplab__note">{note}</span>
        {caps && <span className="wplab__note">caps {caps}</span>}
        {fit && (
          <span
            className="wplab__fit"
            data-over={over > 8 || undefined}
            title={`${fit.content}px of content in a ${fit.box}px sheet`}
          >
            {over > 8 ? `+${over}px past the sheet` : "fits"}
          </span>
        )}
      </figcaption>

      <div className="wplab__screen" style={{ width: w, height: h }}>
        <div className="wt" data-step="destination" {...SCHEME}>
          <div className="wt__media" aria-hidden="true">
            <img
              src={IMG}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="wt__focus" aria-hidden="true" />
          <div className="wt__scrim" aria-hidden="true" />
          <div className="wt__grain" aria-hidden="true" />

          <div className="wt__copy">
            {/* Demoted to the mono eyebrow, exactly as production does once a
                screen is open — the serif headline is not on screen at this
                step, and a lab that kept it would be judging a composition
                that never happens. */}
            <p className="wt__eyebrow">{CTA_LABEL}</p>

            {/* The three choices stay. They are the section's ceiling: a real
                slice of the card is spent before the sheet starts, and a lab
                that dropped them would hand the panel room it never gets. */}
            <nav className="wt__rows" aria-label="Choices">
              {PATHS.map((p, i) => {
                const current = p.id === "worldpulse";
                return (
                  <button
                    key={p.id}
                    type="button"
                    data-wt-row={p.id}
                    className={`wt__row ${
                      p.id === "consulting" ? "is-primary" : "is-secondary"
                    } ${current ? "is-current" : ""}`}
                    style={{ ["--row-index" as string]: i }}
                    aria-expanded={current}
                    /* Inert on purpose: the lab is judging one screen, and a
                       row that swapped it would be a second variable. */
                    disabled
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
              <div className="wplab__sheet" ref={sheetRef}>
                {variant === "before" ? (
                  <WorkTogetherSolo path={WORLDPULSE_PATH} onBack={() => {}} />
                ) : (
                  <WorldPulseScreen onBack={() => {}} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export default function WorldPulsePanelLab() {
  return (
    <main className="wplab">
      <header className="wplab__head">
        <h1 className="wplab__title">WorldPulse panel — before and after</h1>
        <p className="wplab__sub">
          The real <code>WorkTogetherSolo</code> at the real WorldPulse path,
          inside production&rsquo;s <code>.wt</code> chrome. <code>caps</code>{" "}
          reads visible/total capability chips per block, off computed style.
        </p>
      </header>

      {(["before", "after"] as const).map((variant) => (
        <section key={variant} className="wplab__set">
          <h2 className="wplab__setTitle">
            {variant === "before"
              ? "Before — the generic two-block sheet"
              : "After — one claim, two spec rows"}
          </h2>
          <div className="wplab__stage">
            {FRAMES.map((f) => (
              <Frame key={f.w} variant={variant} {...f} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
