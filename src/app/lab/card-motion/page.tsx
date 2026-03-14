"use client";

import { useState } from "react";
import Image from "next/image";

const EASING_OPTIONS = [
  { label: "ease", value: "ease" },
  { label: "ease-in-out", value: "ease-in-out" },
  { label: "ease-out", value: "ease-out" },
  { label: "linear", value: "linear" },
  { label: "flip (production)", value: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" },
  { label: "spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit = "", onChange }: SliderProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between text-[11px] tracking-wide text-white/50">
        <span>{label}</span>
        <span className="font-mono text-white/80">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-600"
      />
    </label>
  );
}

export default function CardMotionLab() {
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(1);

  const [rotateY, setRotateY] = useState(180);
  const [unveilRotate, setUnveilRotate] = useState(-24);
  const [translateX, setTranslateX] = useState(100);
  const [translateY, setTranslateY] = useState(20);
  const [scale, setScale] = useState(0.95);
  const [duration, setDuration] = useState(600);
  const [perspective, setPerspective] = useState(1200);
  const [easing, setEasing] = useState(EASING_OPTIONS[4].value);

  const tx = translateX * (1 - progress);
  const ty = translateY * (1 - progress);
  const rot = unveilRotate * (1 - progress);
  const sc = scale + (1 - scale) * progress;
  const unveilTransform = `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${sc})`;
  const flipTransform = `rotateY(${flipped ? rotateY : 0}deg)`;

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white px-4 pt-6 pb-20 max-w-md mx-auto">
      <h1
        className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Card Motion Lab
      </h1>

      {/* Card preview */}
      <div className="flex justify-center items-center py-8">
        <div style={{ transform: unveilTransform }}>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            style={{
              perspective: `${perspective}px`,
              WebkitPerspective: `${perspective}px`,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
            className="block w-[200px] h-[282px] relative cursor-pointer"
          >
            <div
              style={{
                transform: flipTransform,
                transition: `transform ${duration}ms ${easing}`,
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
              }}
              className="w-full h-full relative"
            >
              {/* Front — card back design */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden bg-white"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src="/cards/back-red-custom.webp"
                  alt="Card back"
                  fill
                  sizes="200px"
                  className="object-cover"
                  priority
                  draggable={false}
                />
              </div>
              {/* Back — card face */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden bg-white"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg) translateZ(0)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src="/cards/hearts_queen.svg"
                  alt="Queen of Hearts"
                  fill
                  sizes="200px"
                  className="object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Tap hint */}
      <p className="text-center text-[10px] text-white/30 tracking-widest uppercase mb-6">
        Tap card to flip
      </p>

      {/* Unveil progress slider */}
      <div className="mb-6">
        <Slider
          label="Unveil progress"
          value={progress}
          min={0}
          max={1}
          step={0.01}
          onChange={setProgress}
        />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 pt-2">
          Flip
        </p>
        <Slider label="rotateY" value={rotateY} min={0} max={360} unit="°" onChange={setRotateY} />
        <Slider label="Duration" value={duration} min={100} max={1500} step={50} unit="ms" onChange={setDuration} />
        <Slider label="Perspective" value={perspective} min={100} max={2400} step={50} unit="px" onChange={setPerspective} />
        <label className="flex flex-col gap-1">
          <span className="text-[11px] tracking-wide text-white/50">Easing</span>
          <select
            value={easing}
            onChange={(e) => setEasing(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80"
          >
            {EASING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 pt-4">
          Unveil (bunched → spread)
        </p>
        <Slider label="translateX" value={translateX} min={-200} max={200} unit="px" onChange={setTranslateX} />
        <Slider label="translateY" value={translateY} min={-200} max={200} unit="px" onChange={setTranslateY} />
        <Slider label="Rotation" value={unveilRotate} min={-45} max={45} unit="°" onChange={setUnveilRotate} />
        <Slider label="Scale" value={scale} min={0.5} max={1.2} step={0.01} onChange={setScale} />
      </div>

      {/* Live values readout */}
      <details className="mt-8 text-[10px] text-white/30">
        <summary className="cursor-pointer tracking-widest uppercase">
          Raw transforms
        </summary>
        <pre className="mt-2 p-3 bg-white/5 rounded text-white/60 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
          {`unveil: ${unveilTransform}\nflip:   ${flipTransform}\nperspective: ${perspective}px\nduration: ${duration}ms\neasing: ${easing}`}
        </pre>
      </details>
    </div>
  );
}
