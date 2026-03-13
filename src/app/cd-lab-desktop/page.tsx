"use client";

import { useState } from "react";

const PRESETS = {
  "tray-fit": {
    label: "Tray Fit",
    desc: "Disc fills the black tray area in the foreground image",
    discSize: 87,
    discCx: 50.25,
    discCy: 55,
    playerWidth: 640,
    playerX: 0,
    playerY: 0,
    cropTop: 0,
    rotation: 0,
  },
  "editorial-half": {
    label: "Editorial Half",
    desc: "Player pushed down so only upper half + disc visible",
    discSize: 87,
    discCx: 50.25,
    discCy: 55,
    playerWidth: 700,
    playerX: 0,
    playerY: 200,
    cropTop: 0,
    rotation: -45,
  },
  "wide-stage": {
    label: "Wide Stage",
    desc: "Larger player for wide desktop viewports",
    discSize: 87,
    discCx: 50.25,
    discCy: 55,
    playerWidth: 800,
    playerX: 0,
    playerY: 100,
    cropTop: 0,
    rotation: -135,
  },
};

type PresetKey = keyof typeof PRESETS;

export default function CdLabDesktopPage() {
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
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ccc", fontFamily: "monospace" }}>
      {/* Top bar */}
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
        <span style={{ color: "#f90", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          CD Lab Desktop
        </span>

        {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: preset === key ? "1px solid #f90" : "1px solid #444",
              background: preset === key ? "rgba(255,153,0,0.15)" : "transparent",
              color: preset === key ? "#fc0" : "#888",
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
          width: 260,
        }}
      >
        <Slider label="discSize" value={v.discSize} min={50} max={100} step={0.5} onChange={(n) => set("discSize", n)} unit="%" />
        <Slider label="discCx" value={v.discCx} min={40} max={60} step={0.25} onChange={(n) => set("discCx", n)} unit="%" />
        <Slider label="discCy" value={v.discCy} min={35} max={70} step={0.25} onChange={(n) => set("discCy", n)} unit="%" />
        <Slider label="playerWidth" value={v.playerWidth} min={400} max={1200} step={10} onChange={(n) => set("playerWidth", n)} unit="px" />
        <Slider label="playerX" value={v.playerX} min={-300} max={300} step={1} onChange={(n) => set("playerX", n)} unit="px" />
        <Slider label="playerY" value={v.playerY} min={-200} max={500} step={5} onChange={(n) => set("playerY", n)} unit="px" />
        <Slider label="cropTop" value={v.cropTop} min={0} max={60} step={1} onChange={(n) => set("cropTop", n)} unit="%" />
        <Slider label="rotation" value={v.rotation} min={-360} max={360} step={5} onChange={(n) => set("rotation", n)} unit="°" />
      </div>

      {/* Stage — simulates the landing screen viewport */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: `url("/Velvetbackground.png") center / cover no-repeat`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Simulated title + quote */}
        <h2
          style={{
            fontFamily: "serif",
            fontSize: "clamp(56px, 10vw, 130px)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "#f3f3f3",
            position: "relative",
            zIndex: 5,
          }}
        >
          Work
        </h2>
        <p
          style={{
            fontFamily: "serif",
            fontSize: "clamp(14px, 1.6vw, 18px)",
            color: "rgba(255,255,255,0.48)",
            marginTop: 14,
            position: "relative",
            zIndex: 5,
          }}
        >
          Rooted in outcome and action.
        </p>

        {/* Player composition — foreground as base, disc on top */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: `translateX(calc(-50% + ${v.playerX}px)) translateY(${v.playerY}px)`,
            width: v.playerWidth,
            lineHeight: 0,
            clipPath: v.cropTop > 0 ? `inset(${v.cropTop}% 0 0 0)` : undefined,
          }}
        >
          {/* Foreground image as the BASE layer */}
          <img
            src="/playerforeground.png"
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* Disc ON TOP */}
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
              outline: debug ? "2px dashed rgba(255,153,0,0.7)" : "none",
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

          {/* Debug crosshair */}
          {debug && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: `${v.discCy}%`,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "rgba(255,100,0,0.4)",
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
                  background: "rgba(255,100,0,0.4)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Values readout */}
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
        <div style={{ color: "#f90", fontWeight: 700, marginBottom: 2 }}>DESKTOP VALUES</div>
        <div>--disc-size: <span style={{ color: "#fc0" }}>{v.discSize}%</span></div>
        <div>--disc-cx: <span style={{ color: "#fc0" }}>{v.discCx}%</span></div>
        <div>--disc-cy: <span style={{ color: "#fc0" }}>{v.discCy}%</span></div>
        <div>playerWidth: <span style={{ color: "#fc0" }}>{v.playerWidth}px</span></div>
        <div>playerY: <span style={{ color: "#fc0" }}>{v.playerY}px</span></div>
        <div>cropTop: <span style={{ color: "#fc0" }}>{v.cropTop}%</span></div>
        <div>rotation: <span style={{ color: "#fc0" }}>{v.rotation}°</span></div>
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
    <label style={{ display: "grid", gridTemplateColumns: "90px 1fr 50px", alignItems: "center", gap: 6, color: "#999" }}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#f90" }}
      />
      <span style={{ textAlign: "right", color: "#fc0", fontSize: 10 }}>
        {value}{unit}
      </span>
    </label>
  );
}
