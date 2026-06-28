"use client";

// Local-only responsive preview. Frame ANY route (homepage or any lab) in an
// <iframe> at chosen device sizes — the iframe's real viewport drives the page's
// own breakpoints, so this is a true responsive preview, not a CSS scale.

import { useCallback, useEffect, useRef, useState } from "react";
import { LAB_GROUPS } from "@/data/labsRegistry";
import "./admin-preview.css";

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

export default function AdminPreview() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState("/");
  const [w, setW] = useState(390);
  const [h, setH] = useState(844);
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(1);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [reloadKey, setReloadKey] = useState(0);

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
    const pad = 40;
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
    <div className="apv">
      <aside className="apv__panel">
        <div className="apv__brand">
          <span className="apv__brandTitle">Responsive preview</span>
          <span className="apv__brandSub">Admin · local only</span>
        </div>

        <div className="apv__group">
          <span className="apv__groupLabel">Route</span>
          <select
            className="apv__select"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          >
            {LAB_GROUPS.map((g) => (
              <optgroup key={g.title} label={g.title}>
                {g.items.map((i) => (
                  <option key={i.path} value={i.path}>
                    {i.label} — {i.path}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            className="apv__route"
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            spellCheck={false}
            aria-label="Route path"
          />
        </div>

        <div className="apv__group">
          <span className="apv__groupLabel">Device</span>
          <div className="apv__presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`apv__preset ${activePreset === p.label ? "is-on" : ""}`}
                onClick={() => applyPreset(p)}
              >
                <span className="apv__presetName">{p.label}</span>
                <span className="apv__presetDim">{p.w}×{p.h}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="apv__group">
          <label className="apv__slider">
            <span className="apv__sliderMeta"><span>Width</span><span>{w}px</span></span>
            <input type="range" min={320} max={1600} step={1} value={w}
              onChange={(e) => setW(clamp(Number(e.target.value), 320, 1600))} />
          </label>
          <label className="apv__slider">
            <span className="apv__sliderMeta"><span>Height</span><span>{h}px</span></span>
            <input type="range" min={480} max={1400} step={1} value={h}
              onChange={(e) => setH(clamp(Number(e.target.value), 480, 1400))} />
          </label>
        </div>

        <div className="apv__row">
          <button type="button" className="apv__btn" onClick={rotate}>⟳ Rotate</button>
          <button type="button" className={`apv__btn ${fit ? "is-on" : ""}`}
            onClick={() => setFit((f) => !f)} aria-pressed={fit}>
            Fit {fit ? "on" : "off"}
          </button>
        </div>
        <div className="apv__row">
          <button type="button" className="apv__btn" onClick={() => setReloadKey((k) => k + 1)}>
            ↻ Reload
          </button>
          <span className="apv__scale">{Math.round(scale * 100)}%</span>
        </div>

        <a href="/admin/labs" className="apv__btn apv__btn--wide">← Labs hub</a>
      </aside>

      <div className="apv__stage" ref={stageRef}>
        <div className="apv__slot" style={{ width: w * scale, height: h * scale }}>
          <div className="apv__frame" style={{ width: w, height: h, transform: `scale(${scale})` }}>
            <iframe
              key={`${route}-${reloadKey}`}
              className="apv__iframe"
              src={route}
              title={`${route} at ${w}×${h}`}
              width={w}
              height={h}
            />
          </div>
        </div>
        <span className="apv__readout">
          {route} · {activePreset} · {w} × {h} · {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}
