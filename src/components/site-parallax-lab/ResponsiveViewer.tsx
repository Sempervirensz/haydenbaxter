"use client";

// Responsive Viewer — frames the Cinematic Work Stack in a resizable device
// surface so the real responsive breakpoints can be compared in one place.
// The page itself can't change the browser viewport, but an <iframe> has its
// own viewport, so its width genuinely drives the stack's media queries.
//
// Controls: device presets, width + height sliders, rotate, and fit-to-screen
// scaling so large widths still fit the lab window.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./responsive-viewer.css";

const SRC = "/site-parallax-lab/work-cinema";

interface Preset {
  label: string;
  w: number;
  h: number;
}

const PRESETS: Preset[] = [
  { label: "Mobile", w: 375, h: 812 },
  { label: "Mobile L", w: 430, h: 932 },
  { label: "Tablet", w: 768, h: 1024 },
  { label: "Laptop", w: 1280, h: 800 },
  { label: "Desktop", w: 1512, h: 950 },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function ResponsiveViewer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [w, setW] = useState(1280);
  const [h, setH] = useState(800);
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(1);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [reloadKey, setReloadKey] = useState(0);

  // Experiment controls — driven here, applied to the framed stack via postMessage.
  const [motionOn, setMotionOn] = useState(true);
  const [peek, setPeek] = useState(false);

  const post = useCallback((action: string, value: unknown) => {
    iframeRef.current?.contentWindow?.postMessage({ source: "cstack-ctl", action, value }, "*");
  }, []);

  // (Re)sync the framed stack whenever it (re)loads.
  const pushAll = useCallback(() => {
    post("motion", motionOn);
    post("peek", peek);
  }, [post, motionOn, peek]);

  const toggleMotion = () =>
    setMotionOn((m) => {
      post("motion", !m);
      return !m;
    });
  const togglePeek = () =>
    setPeek((p) => {
      post("peek", !p);
      return !p;
    });

  // Measure the available stage so we can scale large frames down to fit.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      setStage({ w: r.width, h: r.height });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!fit || stage.w < 1 || stage.h < 1) {
      setScale(1);
      return;
    }
    const pad = 48;
    setScale(Math.min(1, (stage.w - pad) / w, (stage.h - pad) / h));
  }, [fit, stage, w, h]);

  const applyPreset = useCallback((p: Preset) => {
    setW(p.w);
    setH(p.h);
  }, []);

  const rotate = useCallback(() => {
    setW(h);
    setH(w);
  }, [w, h]);

  const activePreset = PRESETS.find((p) => p.w === w && p.h === h)?.label ?? "Custom";

  return (
    <div className="rv">
      <aside className="rv__panel">
        <div className="rv__brand">
          <span className="rv__brandTitle">Responsive viewer</span>
          <span className="rv__brandSub">Cinematic Work Stack</span>
        </div>

        <div className="rv__group">
          <span className="rv__groupLabel">Device</span>
          <div className="rv__presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`rv__preset ${activePreset === p.label ? "is-on" : ""}`}
                onClick={() => applyPreset(p)}
              >
                <span className="rv__presetName">{p.label}</span>
                <span className="rv__presetDim">{p.w}×{p.h}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rv__group">
          <label className="rv__slider">
            <span className="rv__sliderMeta">
              <span>Width</span>
              <span>{w}px</span>
            </span>
            <input
              type="range"
              min={320}
              max={1600}
              step={1}
              value={w}
              onChange={(e) => setW(clamp(Number(e.target.value), 320, 1600))}
            />
          </label>
          <label className="rv__slider">
            <span className="rv__sliderMeta">
              <span>Height</span>
              <span>{h}px</span>
            </span>
            <input
              type="range"
              min={480}
              max={1400}
              step={1}
              value={h}
              onChange={(e) => setH(clamp(Number(e.target.value), 480, 1400))}
            />
          </label>
        </div>

        <div className="rv__group">
          <span className="rv__groupLabel">Experiment · WorldPulse (card 01)</span>
          <div className="rv__row">
            <button
              type="button"
              className={`rv__btn rv__btn--wide ${peek ? "is-on" : ""}`}
              onClick={togglePeek}
            >
              {peek ? "Hide info panel" : "Show info panel"}
            </button>
          </div>
          <div className="rv__row">
            <button
              type="button"
              className={`rv__btn rv__btn--wide ${motionOn ? "is-on" : ""}`}
              onClick={toggleMotion}
            >
              Motion {motionOn ? "on" : "off"}
            </button>
          </div>
        </div>

        <div className="rv__row">
          <button type="button" className="rv__btn" onClick={rotate}>
            ⟳ Rotate
          </button>
          <button
            type="button"
            className={`rv__btn ${fit ? "is-on" : ""}`}
            onClick={() => setFit((f) => !f)}
            aria-pressed={fit}
          >
            Fit {fit ? "on" : "off"}
          </button>
        </div>

        <div className="rv__row">
          <button
            type="button"
            className="rv__btn"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            ↻ Reload
          </button>
          <span className="rv__scale">{Math.round(scale * 100)}%</span>
        </div>

        <Link href="/site-parallax-lab/work-cinema" className="rv__btn rv__btn--wide">
          Open full →
        </Link>
        <Link href="/site-parallax-lab/work-handoff" className="rv__btn rv__btn--wide">
          ← Handoff lab
        </Link>
      </aside>

      <div className="rv__stage" ref={stageRef}>
        <div
          className="rv__slot"
          style={{ width: w * scale, height: h * scale }}
        >
          <div
            className="rv__frame"
            style={{ width: w, height: h, transform: `scale(${scale})` }}
          >
            <iframe
              key={reloadKey}
              ref={iframeRef}
              className="rv__iframe"
              src={SRC}
              title={`Cinematic Work Stack at ${w}×${h}`}
              width={w}
              height={h}
              onLoad={pushAll}
            />
          </div>
        </div>
        <span className="rv__readout">
          {activePreset} · {w} × {h} · {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}
