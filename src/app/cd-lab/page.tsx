"use client";

import { useState } from "react";

const PRESETS = {
  "tray-fit": {
    label: "Tray Fit",
    desc: "Disc nearly fills the black circular tray area",
    discSize: 79,
    discCx: 50,
    discCy: 47.5,
    playerWidth: 520,
    playerX: 0,
    playerY: 0,
    showFg: false,
    rotation: 0,
  },
  "tray-fit-tight": {
    label: "Tray Fit Tight",
    desc: "Disc slightly larger — tighter against the tray boundary",
    discSize: 83,
    discCx: 50,
    discCy: 47.5,
    playerWidth: 520,
    playerX: 0,
    playerY: 0,
    showFg: false,
    rotation: 0,
  },
  "editorial-crop": {
    label: "Editorial Crop",
    desc: "Dramatic desktop crop — player pushed down, only top half visible",
    discSize: 79,
    discCx: 50,
    discCy: 47.5,
    playerWidth: 700,
    playerX: 0,
    playerY: 120,
    showFg: false,
    rotation: -45,
  },
};

type PresetKey = keyof typeof PRESETS;

export default function CdLabPage() {
  const [preset, setPreset] = useState<PresetKey>("tray-fit");
  const [v, setV] = useState({ ...PRESETS["tray-fit"] });
  const [debug, setDebug] = useState(true);

  function applyPreset(key: PresetKey) {
    setPreset(key);
    setV({ ...PRESETS[key] });
  }

  function set<K extends keyof typeof v>(key: K, val: (typeof v)[K]) {
    setV((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#ccc", fontFamily: "monospace" }}>
      {/* Controls bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.92)",
          borderBottom: "1px solid #333",
          padding: "10px 16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          fontSize: 11,
        }}
      >
        <span style={{ color: "#666", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          CD Lab
        </span>

        {/* Presets */}
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: preset === key ? "1px solid #7af" : "1px solid #444",
              background: preset === key ? "rgba(100,160,255,0.15)" : "transparent",
              color: preset === key ? "#adf" : "#888",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            {PRESETS[key].label}
          </button>
        ))}

        <label style={{ display: "flex", alignItems: "center", gap: 4, color: "#888" }}>
          <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
          debug
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 4, color: "#888" }}>
          <input type="checkbox" checked={v.showFg} onChange={(e) => set("showFg", e.target.checked)} />
          foreground
        </label>
      </div>

      {/* Sliders */}
      <div
        style={{
          position: "fixed",
          top: 44,
          left: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.88)",
          borderRight: "1px solid #333",
          borderBottom: "1px solid #333",
          borderRadius: "0 0 8px 0",
          padding: "10px 14px",
          display: "grid",
          gap: 6,
          fontSize: 11,
          width: 240,
        }}
      >
        <Slider label="discSize" value={v.discSize} min={50} max={100} step={0.5} onChange={(n) => set("discSize", n)} unit="%" />
        <Slider label="discCx" value={v.discCx} min={40} max={60} step={0.25} onChange={(n) => set("discCx", n)} unit="%" />
        <Slider label="discCy" value={v.discCy} min={35} max={100} step={0.25} onChange={(n) => set("discCy", n)} unit="%" />
        <Slider label="playerWidth" value={v.playerWidth} min={280} max={900} step={5} onChange={(n) => set("playerWidth", n)} unit="px" />
        <Slider label="playerX" value={v.playerX} min={-200} max={200} step={1} onChange={(n) => set("playerX", n)} unit="px" />
        <Slider label="playerY" value={v.playerY} min={-200} max={300} step={1} onChange={(n) => set("playerY", n)} unit="px" />
        <Slider label="rotation" value={v.rotation} min={-360} max={360} step={5} onChange={(n) => set("rotation", n)} unit="°" />
      </div>

      {/* Stage */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: 60,
          background: `url("/Velvetbackground.png") center / cover no-repeat`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Player composition */}
        <div
          style={{
            position: "relative",
            width: v.playerWidth,
            lineHeight: 0,
            transform: `translate(${v.playerX}px, ${v.playerY}px)`,
          }}
        >
          {/* Shell (back) */}
          <img
            src="/playershellpngtransparent.png"
            alt=""
            style={{ display: "block", width: "100%", height: "auto", position: "relative", zIndex: 1 }}
          />

          {/* Disc */}
          <div
            style={{
              position: "absolute",
              top: `${v.discCy}%`,
              left: `${v.discCx}%`,
              transform: "translate(-50%, -50%)",
              width: `${v.discSize}%`,
              aspectRatio: "1",
              borderRadius: "50%",
              overflow: "hidden",
              zIndex: 2,
              outline: debug ? "2px dashed lime" : "none",
              outlineOffset: -1,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `url("/cd-disc-final.png") center / cover no-repeat`,
                transform: `rotate(${v.rotation}deg)`,
              }}
            />
          </div>

          {/* Foreground (top) */}
          {v.showFg && (
            <img
              src="/playerforeground.png"
              alt=""
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "auto",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Debug: center crosshair */}
          {debug && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: `${v.discCy}%`,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "rgba(255,0,0,0.35)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${v.discCx}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: "rgba(255,0,0,0.35)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Current values readout */}
      <div
        style={{
          position: "fixed",
          bottom: 12,
          right: 16,
          zIndex: 100,
          background: "rgba(0,0,0,0.85)",
          border: "1px solid #333",
          borderRadius: 6,
          padding: "8px 12px",
          fontSize: 10,
          lineHeight: 1.6,
          color: "#999",
        }}
      >
        <div style={{ color: "#666", fontWeight: 700, marginBottom: 2 }}>CURRENT VALUES</div>
        <div>--disc-size: <span style={{ color: "#adf" }}>{v.discSize}%</span></div>
        <div>--disc-cx: <span style={{ color: "#adf" }}>{v.discCx}%</span></div>
        <div>--disc-cy: <span style={{ color: "#adf" }}>{v.discCy}%</span></div>
        <div>playerWidth: <span style={{ color: "#adf" }}>{v.playerWidth}px</span></div>
        <div>rotation: <span style={{ color: "#adf" }}>{v.rotation}°</span></div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  unit: string;
}) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "80px 1fr 48px", alignItems: "center", gap: 6, color: "#999" }}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#7af" }}
      />
      <span style={{ textAlign: "right", color: "#adf", fontSize: 10 }}>
        {value}{unit}
      </span>
    </label>
  );
}
