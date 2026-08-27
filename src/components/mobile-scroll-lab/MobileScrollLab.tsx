"use client";

/* /mobile-scroll-lab — the techniques side by side, driving the REAL homepage.
 *
 * The frame below is `/` itself in an iframe, not a rebuild of it. A
 * reconstruction would be the one thing that cannot answer this question: the
 * disc's cost is a function of the document it is scrolling inside — 20,000px
 * of sticky chapters, four cinematic cards, a soft-lock gate — and a clean
 * demo page would make every technique look free.
 *
 * WHAT THIS PAGE CAN AND CANNOT TELL YOU
 *
 * It can tell you how each technique FEELS: how tightly the disc tracks a
 * flick, whether the lerp reads as weight or as lag, whether freewheel is
 * charming or seasick.
 *
 * It cannot tell you what any of them COST. An iframe on a laptop has a mouse,
 * and the phone freeze is gated on pointer type rather than width — so the
 * frame runs the desktop path no matter how narrow you make it, and its frame
 * rate is a MacBook's. For cost, open the same URL on a real phone and read the
 * HUD there. The banner says so, in the lab, where the mistake would be made.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { DISC_CHANNEL } from "./disc-scroll-probe";
import { LANDING_CHANNEL } from "./landing-bus";
import { LANDING_DEFAULTS, type LandingOptions } from "./landing-variants";
import { LANDING_VARIANTS, landingDef } from "./landing-variant-catalog";
import type { DiscTechnique } from "./disc-techniques";
import { DISC_TECHNIQUES } from "./disc-technique-catalog";
import "./mobile-scroll-lab.css";

/** Widths that correspond to real hardware, plus the one where the ≤640px half
 *  of the phone gate stops applying at all. */
const WIDTHS = [
  { w: 375, label: "375 · SE / 13 mini" },
  { w: 390, label: "390 · 14 / 15" },
  { w: 430, label: "430 · Pro Max" },
  { w: 640, label: "640 · gate edge" },
  { w: 768, label: "768 · tablet" },
];

export default function MobileScrollLab() {
  const [technique, setTechnique] = useState<DiscTechnique>("cached");
  const [width, setWidth] = useState(390);
  const [height, setHeight] = useState(760);
  const [landing, setLanding] = useState<LandingOptions>(LANDING_DEFAULTS);
  const [lan, setLan] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    /* Whatever host this lab was opened on is the host a phone should use, and
       the URL carries the whole arm — so a run on the phone is the run that is
       selected here, not an approximation of it. */
    const q = new URLSearchParams({ disc: technique, landing: landing.variant });
    if (landing.start) q.set("start", "1");
    if (landing.play !== "off") q.set("play", landing.play);
    if (landing.cue) q.set("cue", "1");
    setLan(`${window.location.origin}/?${q}`);
  }, [technique, landing]);

  /* The frame's src is set once and never re-bound to `technique`.
     
     Binding it meant every technique click reloaded the page inside — which
     dropped the postMessage that was supposed to do the switching, shut the
     soft-lock gate, and scrolled Work back out of view. The whole point of the
     message channel is switching without losing the scroll position you are
     judging the technique from. */
  /* `lab` arms the landing enhancer even when every arm starts at its default,
     so toggling one mid-session takes effect without a reload. */
  const [initialSrc] = useState(() => `/?disc=${technique}&lab=1`);

  const post = useCallback((value: DiscTechnique) => {
    frame.current?.contentWindow?.postMessage({ source: DISC_CHANNEL, value }, "*");
  }, []);

  const send = useCallback(
    (value: DiscTechnique) => {
      setTechnique(value);
      post(value);
    },
    [post]
  );

  const postLanding = useCallback((value: LandingOptions) => {
    frame.current?.contentWindow?.postMessage(
      { source: LANDING_CHANNEL, value },
      "*"
    );
  }, []);

  const setLandingOpt = useCallback(
    (patch: Partial<LandingOptions>) => {
      setLanding((prev) => {
        const next = { ...prev, ...patch };
        postLanding(next);
        return next;
      });
    },
    [postLanding]
  );

  /* A manual reload of the frame comes back on whatever the URL said — re-send
     both channels so the controls and the frame cannot disagree. */
  const onFrameLoad = useCallback(() => {
    post(technique);
    postLanding(landing);
  }, [post, postLanding, technique, landing]);

  const reloadFrame = useCallback(() => {
    const win = frame.current?.contentWindow;
    if (win) win.location.reload();
  }, []);

  /* The framed page opens behind the soft-lock gate, and Work is the only thing
     worth looking at here. Same origin, so the release event can be dispatched
     straight into the frame rather than making you flip four cards per run. */
  const toWork = useCallback(() => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    win.dispatchEvent(
      new CustomEvent("softlock:release", { detail: { hash: "#work" } })
    );
  }, []);

  const current = DISC_TECHNIQUES.find((t) => t.id === technique);

  return (
    <main className="msl">
      <header className="msl__head">
        <h1 className="msl__title">Mobile scroll lab</h1>
        <p className="msl__sub">
          Two questions on one screen, driving the real homepage. The disc is
          frozen on phones because the shipped way of turning it reads layout
          every frame. And people tap the chapter titles expecting to go
          somewhere, which today does nothing at all.
        </p>
      </header>

      <p className="msl__warn">
        <strong>Feel only, in this frame.</strong> The freeze is gated on pointer
        type, not width, so an iframe on a laptop runs the desktop path at any
        width and reports a laptop&rsquo;s frame rate. For cost, open the URL
        below on a real phone and read the HUD there.
      </p>

      <div className="msl__controls">
        <div className="msl__group" role="group" aria-label="Technique">
          <span className="msl__legend">technique</span>
          <div className="msl__btns">
            {DISC_TECHNIQUES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={technique === t.id}
                className={`msl__btn ${technique === t.id ? "is-on" : ""}`}
                onClick={() => send(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="msl__group" role="group" aria-label="Chapter titles">
          <span className="msl__legend">chapter titles</span>
          <div className="msl__btns">
            {LANDING_VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={landing.variant === v.id}
                className={`msl__btn ${landing.variant === v.id ? "is-on" : ""}`}
                onClick={() => setLandingOpt({ variant: v.id })}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="msl__group" role="group" aria-label="Encouragement">
          <span className="msl__legend">nudges</span>
          <div className="msl__btns">
            <button
              type="button"
              aria-pressed={landing.start}
              className={`msl__btn ${landing.start ? "is-on" : ""}`}
              onClick={() => setLandingOpt({ start: !landing.start })}
            >
              01 as next step
            </button>
            <button
              type="button"
              aria-pressed={landing.play !== "off"}
              className={`msl__btn ${landing.play !== "off" ? "is-on" : ""}`}
              onClick={() =>
                setLandingOpt({
                  play:
                    landing.play === "off" ? "hub" : landing.play === "hub" ? "shell" : "off",
                })
              }
            >
              {landing.play === "off"
                ? "press play"
                : `press play · ${landing.play}`}
            </button>
            <button
              type="button"
              aria-pressed={landing.cue}
              className={`msl__btn ${landing.cue ? "is-on" : ""}`}
              onClick={() => setLandingOpt({ cue: !landing.cue })}
            >
              scroll cue
            </button>
          </div>
        </div>

        <div className="msl__group" role="group" aria-label="Frame width">
          <span className="msl__legend">width</span>
          <div className="msl__btns">
            {WIDTHS.map((d) => (
              <button
                key={d.w}
                type="button"
                aria-pressed={width === d.w}
                className={`msl__btn ${width === d.w ? "is-on" : ""}`}
                onClick={() => setWidth(d.w)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="msl__group">
          <span className="msl__legend">frame</span>
          <div className="msl__btns">
            <button type="button" className="msl__btn" onClick={toWork}>
              open gate → Work
            </button>
            <button type="button" className="msl__btn" onClick={reloadFrame}>
              reload
            </button>
            <label className="msl__range">
              height
              <input
                type="range"
                min={560}
                max={1100}
                step={10}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
              <span className="msl__num">{height}</span>
            </label>
          </div>
        </div>
      </div>

      {current && (
        <p className="msl__note">
          <span className="msl__noteId">{current.label}</span>
          {current.note}
        </p>
      )}
      <p className="msl__note">
        <span className="msl__noteId">{landingDef(landing.variant).label}</span>
        {landingDef(landing.variant).note}
      </p>

      <div className="msl__stage">
        <iframe
          ref={frame}
          className="msl__frame"
          style={{ width, height }}
          src={initialSrc}
          onLoad={onFrameLoad}
          title="Homepage, driven by the selected disc technique"
        />
      </div>

      <p className="msl__lan">
        On a phone, for the numbers: <code>{lan || "…"}</code>
      </p>
    </main>
  );
}
