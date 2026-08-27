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
  const [lan, setLan] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Whatever host this lab was opened on is the host a phone should use.
    setLan(`${window.location.origin}/?disc=${technique}`);
  }, [technique]);

  /* The frame's src is set once and never re-bound to `technique`.
     
     Binding it meant every technique click reloaded the page inside — which
     dropped the postMessage that was supposed to do the switching, shut the
     soft-lock gate, and scrolled Work back out of view. The whole point of the
     message channel is switching without losing the scroll position you are
     judging the technique from. */
  const [initialSrc] = useState(() => `/?disc=${technique}`);

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

  /* A manual reload of the frame comes back on whatever `?disc=` it was opened
     with — re-send so the buttons and the frame cannot disagree. */
  const onFrameLoad = useCallback(() => post(technique), [post, technique]);

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
          Six ways to turn the CD disc, driving the real homepage. The disc is
          frozen on phones today because the shipped way of turning it reads
          layout every frame — these are the alternatives.
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
