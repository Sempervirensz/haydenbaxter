"use client";

// Responsive Viewer — frames a real route in a resizable device surface so the
// responsive breakpoints can be compared in one place. The page itself can't
// change the browser viewport, but an <iframe> has its own viewport, so its
// width genuinely drives the framed route's media queries and vw units. That
// makes this the only way to see true 4K layout without a 4K panel.
//
// Fit-to-screen scales the frame down to the lab window, so what you're
// checking here is LAYOUT — composition, emptiness, column counts, collisions.
// Physical legibility ("is 14px comfortable at arm's length on a 32-inch
// display") still needs real hardware; no amount of scaling answers that.
//
// Controls: route, device presets, width + height sliders, rotate, and
// fit-to-screen scaling so large widths still fit the lab window.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_VARIANT,
  ROUTE_VARIANTS,
  VARIANT_CHANNEL,
  type RouteVariant,
} from "@/data/entryCtaLab";
import "./responsive-viewer.css";

interface Route {
  label: string;
  src: string;
}

/** The lab this viewer was built around — it's the only route that responds to
 *  the postMessage experiment controls below. */
const WORK_CINEMA = "/site-parallax-lab/work-cinema";

/** Entry route choice — framed here so its type block can be read at every
 *  width without a second viewer. */
const ENTRY_ROUTES = "/entry-cta-lab";

const ROUTES: Route[] = [
  { label: "Home", src: "/" },
  { label: "Entry routes", src: ENTRY_ROUTES },
  { label: "Work stack", src: WORK_CINEMA },
  { label: "Tech builds", src: "/emerging-tech-builds" },
  { label: "Journal", src: "/blog" },
  // Hero type iterations. Framed rather than viewed directly because the whole
  // question is how the headline behaves at widths this machine cannot open —
  // the iframe's own viewport is what makes 3440 and 3840 real here.
  { label: "Hero type", src: "/hero-type-lab" },
];

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

/** The sizes this lab previously couldn't reach. The old preset list stopped at
 *  1512×950, which is why large-display problems stayed invisible here even
 *  though the viewer was the right tool to catch them. */
const LARGE_PRESETS: Preset[] = [
  { label: "FHD", w: 1920, h: 1080 },
  { label: "QHD", w: 2560, h: 1440 },
  { label: "Ultra-wide", w: 3440, h: 1440 },
  { label: "4K", w: 3840, h: 2160 },
  { label: "Short 4K", w: 3840, h: 1600 },
];

const MAX_W = 3840;
const MAX_H = 2160;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function ResponsiveViewer({ initialSrc }: { initialSrc?: string } = {}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [route, setRoute] = useState<Route>(
    () => ROUTES.find((r) => r.src === initialSrc) ?? ROUTES[0]
  );
  const [w, setW] = useState(1280);
  const [h, setH] = useState(800);
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(1);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [reloadKey, setReloadKey] = useState(0);

  const [variant, setVariant] = useState<RouteVariant>(DEFAULT_VARIANT);

  // Experiment controls — driven here, applied to the framed stack via postMessage.
  const [motionOn, setMotionOn] = useState(true);
  const [peek, setPeek] = useState(false);

  const post = useCallback((action: string, value: unknown) => {
    iframeRef.current?.contentWindow?.postMessage({ source: "cstack-ctl", action, value }, "*");
  }, []);

  /** The entry lab listens on its own channel — see EntryCtaLab. */
  const postVariant = useCallback((value: RouteVariant) => {
    iframeRef.current?.contentWindow?.postMessage(
      { source: VARIANT_CHANNEL, action: "variant", value },
      "*"
    );
  }, []);

  // (Re)sync the framed route whenever it (re)loads. A reload drops the iframe's
  // React state, so the iteration has to be pushed again or the frame silently
  // reverts to the default while the control still reads as selected.
  const pushAll = useCallback(() => {
    post("motion", motionOn);
    post("peek", peek);
    postVariant(variant);
  }, [post, motionOn, peek, postVariant, variant]);

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

  const activePreset =
    [...PRESETS, ...LARGE_PRESETS].find((p) => p.w === w && p.h === h)?.label ?? "Custom";

  /** The experiment controls talk to the work-cinema lab over postMessage;
   *  they mean nothing when another route is framed. */
  const showExperiments = route.src === WORK_CINEMA;
  const showVariants = route.src === ENTRY_ROUTES;

  const renderPresets = (list: Preset[]) => (
    <div className="rv__presets">
      {list.map((p) => (
        <button
          key={p.label}
          type="button"
          className={`rv__preset ${activePreset === p.label ? "is-on" : ""}`}
          onClick={() => applyPreset(p)}
        >
          <span className="rv__presetName">{p.label}</span>
          <span className="rv__presetDim">
            {p.w}×{p.h}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="rv">
      <aside className="rv__panel">
        <div className="rv__brand">
          <span className="rv__brandTitle">Responsive viewer</span>
          <span className="rv__brandSub">{route.label}</span>
        </div>

        <div className="rv__group">
          <span className="rv__groupLabel">Route</span>
          <div className="rv__presets">
            {ROUTES.map((r) => (
              <button
                key={r.src}
                type="button"
                className={`rv__preset ${route.src === r.src ? "is-on" : ""}`}
                onClick={() => setRoute(r)}
              >
                <span className="rv__presetName">{r.label}</span>
                <span className="rv__presetDim">{r.src}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rv__group">
          <span className="rv__groupLabel">Device</span>
          {renderPresets(PRESETS)}
        </div>

        <div className="rv__group">
          <span className="rv__groupLabel">Large displays</span>
          {renderPresets(LARGE_PRESETS)}
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
              max={MAX_W}
              step={1}
              value={w}
              onChange={(e) => setW(clamp(Number(e.target.value), 320, MAX_W))}
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
              max={MAX_H}
              step={1}
              value={h}
              onChange={(e) => setH(clamp(Number(e.target.value), 480, MAX_H))}
            />
          </label>
        </div>

        {showVariants && (
          <div className="rv__group">
            <span className="rv__groupLabel">Iteration · entry choice</span>
            <div className="rv__presets">
              {ROUTE_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`rv__preset ${variant === v.id ? "is-on" : ""}`}
                  onClick={() => {
                    setVariant(v.id);
                    postVariant(v.id);
                  }}
                >
                  <span className="rv__presetName">
                    {v.index} · {v.label}
                  </span>
                  <span className="rv__presetDim">{v.note}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showExperiments && (
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
        )}

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

        <Link href={route.src} className="rv__btn rv__btn--wide">
          Open {route.label} full →
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
            {/* Route is part of the key so switching routes remounts the frame
                rather than leaving the previous page's scroll state behind. */}
            <iframe
              key={`${route.src}:${reloadKey}`}
              ref={iframeRef}
              className="rv__iframe"
              src={route.src}
              title={`${route.label} at ${w}×${h}`}
              width={w}
              height={h}
              onLoad={pushAll}
            />
          </div>
        </div>
        <span className="rv__readout">
          {route.label} · {activePreset} · {w} × {h} · {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}
