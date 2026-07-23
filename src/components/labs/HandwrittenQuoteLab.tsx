"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as opentype from "opentype.js";

const SCRIPT_TEXT = "is to create it.";
const HORIZONTAL_PADDING = 12;
const VERTICAL_PADDING = 18;

type FontOption = {
  id: string;
  label: string;
  url: string;
  fallbackFamily: string;
  size: number;
  strokeWidth: number;
};

type AnimationStyleId =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "lateStart"
  | "quickStart"
  | "staccato"
  | "overshoot"
  | "inkWave"
  | "doublePass";

type AnimationStyle = {
  id: AnimationStyleId;
  label: string;
};

type SpeedOption = {
  id: string;
  label: string;
  exponent: number;
};

type IterationPreset = {
  id: string;
  label: string;
  fontId: string;
  styleId: AnimationStyleId;
  speedId: string;
};

type PathSegment = {
  d: string;
  advance: number;
};

type PathState = {
  segments: PathSegment[];
  totalAdvance: number;
  width: number;
  height: number;
};

const FONT_OPTIONS: FontOption[] = [
  {
    id: "sacramento",
    label: "Sacramento",
    url: "/fonts/Sacramento-Regular.ttf",
    fallbackFamily: '"Sacramento", "Snell Roundhand", cursive',
    size: 176,
    strokeWidth: 3.2,
  },
  {
    id: "allura",
    label: "Allura",
    url: "/fonts/Allura-Regular.ttf",
    fallbackFamily: '"Allura", "Snell Roundhand", cursive',
    size: 176,
    strokeWidth: 3.2,
  },
  {
    id: "alexbrush",
    label: "Alex Brush",
    url: "/fonts/AlexBrush-Regular.ttf",
    fallbackFamily: '"Alex Brush", "Brush Script MT", cursive',
    size: 168,
    strokeWidth: 3.1,
  },
  {
    id: "greatvibes",
    label: "Great Vibes",
    url: "/fonts/GreatVibes-Regular.ttf",
    fallbackFamily: '"Great Vibes", "Snell Roundhand", cursive',
    size: 170,
    strokeWidth: 3.1,
  },
  {
    id: "yellowtail",
    label: "Yellowtail",
    url: "/fonts/Yellowtail-Regular.ttf",
    fallbackFamily: '"Yellowtail", "Brush Script MT", cursive',
    size: 170,
    strokeWidth: 3.15,
  },
  {
    id: "satisfy",
    label: "Satisfy",
    url: "/fonts/Satisfy-Regular.ttf",
    fallbackFamily: '"Satisfy", "Brush Script MT", cursive',
    size: 170,
    strokeWidth: 3.15,
  },
  {
    id: "parisienne",
    label: "Parisienne",
    url: "/fonts/Parisienne-Regular.ttf",
    fallbackFamily: '"Parisienne", "Lucida Handwriting", cursive',
    size: 178,
    strokeWidth: 3.0,
  },
  {
    id: "tangerine",
    label: "Tangerine",
    url: "/fonts/Tangerine-Regular.ttf",
    fallbackFamily: '"Tangerine", "Lucida Handwriting", cursive',
    size: 198,
    strokeWidth: 2.9,
  },
  {
    id: "pinyon",
    label: "Pinyon Script",
    url: "/fonts/PinyonScript-Regular.ttf",
    fallbackFamily: '"Pinyon Script", "Snell Roundhand", cursive',
    size: 188,
    strokeWidth: 3.0,
  },
  {
    id: "kaushan",
    label: "Kaushan Script",
    url: "/fonts/KaushanScript-Regular.ttf",
    fallbackFamily: '"Kaushan Script", "Brush Script MT", cursive',
    size: 168,
    strokeWidth: 3.2,
  },
];

const ANIMATION_STYLES: AnimationStyle[] = [
  { id: "linear", label: "Linear" },
  { id: "easeIn", label: "Ease In" },
  { id: "easeOut", label: "Ease Out" },
  { id: "easeInOut", label: "Ease In Out" },
  { id: "lateStart", label: "Late Start" },
  { id: "quickStart", label: "Quick Start" },
  { id: "staccato", label: "Staccato" },
  { id: "overshoot", label: "Overshoot" },
  { id: "inkWave", label: "Ink Wave" },
  { id: "doublePass", label: "Double Pass" },
];

const SPEED_OPTIONS: SpeedOption[] = [
  { id: "v1", label: "Speed 01 - Glacial", exponent: 3.2 },
  { id: "v2", label: "Speed 02 - Very Slow", exponent: 2.6 },
  { id: "v3", label: "Speed 03 - Slow", exponent: 2.2 },
  { id: "v4", label: "Speed 04 - Relaxed", exponent: 1.8 },
  { id: "v5", label: "Speed 05 - Balanced", exponent: 1.45 },
  { id: "v6", label: "Speed 06 - Brisk", exponent: 1.15 },
  { id: "v7", label: "Speed 07 - Quick", exponent: 0.95 },
  { id: "v8", label: "Speed 08 - Fast", exponent: 0.8 },
  { id: "v9", label: "Speed 09 - Very Fast", exponent: 0.65 },
  { id: "v10", label: "Speed 10 - Lightning", exponent: 0.52 },
];

const ITERATION_PRESETS: IterationPreset[] = [
  { id: "01", label: "Iteration 01", fontId: "sacramento", styleId: "linear", speedId: "v5" },
  { id: "02", label: "Iteration 02", fontId: "allura", styleId: "easeIn", speedId: "v4" },
  { id: "03", label: "Iteration 03", fontId: "alexbrush", styleId: "easeOut", speedId: "v6" },
  { id: "04", label: "Iteration 04", fontId: "greatvibes", styleId: "easeInOut", speedId: "v5" },
  { id: "05", label: "Iteration 05", fontId: "yellowtail", styleId: "quickStart", speedId: "v7" },
  { id: "06", label: "Iteration 06", fontId: "satisfy", styleId: "lateStart", speedId: "v3" },
  { id: "07", label: "Iteration 07", fontId: "parisienne", styleId: "staccato", speedId: "v6" },
  { id: "08", label: "Iteration 08", fontId: "tangerine", styleId: "inkWave", speedId: "v4" },
  { id: "09", label: "Iteration 09", fontId: "pinyon", styleId: "doublePass", speedId: "v2" },
  { id: "10", label: "Iteration 10", fontId: "kaushan", styleId: "overshoot", speedId: "v8" },
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function applySpeedCurve(progress: number, exponent: number) {
  return Math.pow(clamp01(progress), exponent);
}

function styleLocalProgress(local: number, styleId: AnimationStyleId, index: number) {
  const t = clamp01(local);

  switch (styleId) {
    case "linear":
      return t;
    case "easeIn":
      return Math.pow(t, 2.2);
    case "easeOut":
      return 1 - Math.pow(1 - t, 2.2);
    case "easeInOut":
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    case "lateStart":
      return clamp01((t - 0.22) / 0.78);
    case "quickStart":
      return clamp01(t / 0.78);
    case "staccato": {
      const steps = 7;
      const snapped = Math.floor(t * steps) / steps;
      return clamp01(snapped + (t - snapped) * 0.22);
    }
    case "overshoot":
      return clamp01(t + Math.sin(t * Math.PI) * 0.14 * (1 - t));
    case "inkWave":
      return clamp01(t + Math.sin(t * Math.PI * 2 + index * 0.6) * 0.08 * (1 - t));
    case "doublePass":
      return t < 0.74 ? (t / 0.74) * 0.86 : 0.86 + ((t - 0.74) / 0.26) * 0.14;
    default:
      return t;
  }
}

function styleOpacity(local: number, styleId: AnimationStyleId) {
  const t = clamp01(local);

  switch (styleId) {
    case "staccato":
      return 0.3 + t * 0.7;
    case "inkWave":
      return 0.5 + t * 0.5;
    case "lateStart":
      return 0.2 + t * 0.8;
    default:
      return 0.35 + t * 0.65;
  }
}

function styleStrokeWidth(local: number, styleId: AnimationStyleId, baseWidth: number) {
  const t = clamp01(local);

  switch (styleId) {
    case "inkWave":
      return baseWidth * (0.9 + 0.2 * Math.sin(t * Math.PI));
    case "doublePass":
      return baseWidth * (t < 0.8 ? 0.95 : 1.08);
    case "overshoot":
      return baseWidth * (0.98 + 0.06 * t);
    default:
      return baseWidth;
  }
}

export default function HandwrittenQuoteLab() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);

  const [selectedFontId, setSelectedFontId] = useState(FONT_OPTIONS[0].id);
  const [selectedStyleId, setSelectedStyleId] = useState<AnimationStyleId>(ANIMATION_STYLES[0].id);
  const [selectedSpeedId, setSelectedSpeedId] = useState(SPEED_OPTIONS[4].id);
  const [pathState, setPathState] = useState<PathState | null>(null);
  const [pathError, setPathError] = useState(false);

  const selectedFont = useMemo(
    () => FONT_OPTIONS.find((font) => font.id === selectedFontId) ?? FONT_OPTIONS[0],
    [selectedFontId]
  );

  const selectedSpeed = useMemo(
    () => SPEED_OPTIONS.find((speed) => speed.id === selectedSpeedId) ?? SPEED_OPTIONS[4],
    [selectedSpeedId]
  );

  const activeIteration = useMemo(
    () =>
      ITERATION_PRESETS.find(
        (preset) =>
          preset.fontId === selectedFontId &&
          preset.styleId === selectedStyleId &&
          preset.speedId === selectedSpeedId
      )?.id ?? null,
    [selectedFontId, selectedStyleId, selectedSpeedId]
  );

  const svgViewBox = useMemo(() => {
    if (!pathState) return "0 0 1000 260";
    return `0 0 ${pathState.width} ${pathState.height}`;
  }, [pathState]);

  const segmentRanges = useMemo(() => {
    if (!pathState || pathState.segments.length === 0) return [] as Array<{ start: number; end: number }>;

    const total = pathState.totalAdvance > 0 ? pathState.totalAdvance : pathState.segments.length;
    let cursor = 0;

    return pathState.segments.map((segment, index) => {
      const start = cursor / total;
      const advance = segment.advance > 0 ? segment.advance : total / pathState.segments.length;
      cursor += advance;
      const end = index === pathState.segments.length - 1 ? 1 : cursor / total;
      return { start, end };
    });
  }, [pathState]);

  useEffect(() => {
    let isMounted = true;
    pathRefs.current = [];
    setPathState(null);
    setPathError(false);

    async function buildPath() {
      try {
        const response = await fetch(selectedFont.url, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error(`Font fetch failed with ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const font = opentype.parse(buffer);
        const fontSize = selectedFont.size;
        const baselineY = Math.round(fontSize * 1.11);

        const renderOptions = {
          kerning: true,
          hinting: false,
          features: {
            liga: true,
            rlig: true,
          },
        } as const;

        const tokens = SCRIPT_TEXT.match(/\S+\s*/g) ?? [SCRIPT_TEXT];
        let cursorX = 0;

        const tokenPaths = tokens.map((token) => {
          const tokenPath = font.getPath(token, cursorX, baselineY, fontSize, renderOptions);
          const advance = font.getAdvanceWidth(token, fontSize, renderOptions);
          cursorX += advance;
          return { tokenPath, advance };
        });

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (const { tokenPath } of tokenPaths) {
          const box = tokenPath.getBoundingBox();
          minX = Math.min(minX, box.x1);
          minY = Math.min(minY, box.y1);
          maxX = Math.max(maxX, box.x2);
          maxY = Math.max(maxY, box.y2);
        }

        if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
          throw new Error("Invalid glyph bounds while constructing script path");
        }

        const shiftX = HORIZONTAL_PADDING - minX;
        const shiftY = VERTICAL_PADDING - minY;

        const segments = tokenPaths.map(({ tokenPath, advance }) => {
          const shifted = tokenPath.commands.map((command: any) => ({
            ...command,
            ...(typeof command.x === "number" ? { x: command.x + shiftX } : {}),
            ...(typeof command.y === "number" ? { y: command.y + shiftY } : {}),
            ...(typeof command.x1 === "number" ? { x1: command.x1 + shiftX } : {}),
            ...(typeof command.y1 === "number" ? { y1: command.y1 + shiftY } : {}),
            ...(typeof command.x2 === "number" ? { x2: command.x2 + shiftX } : {}),
            ...(typeof command.y2 === "number" ? { y2: command.y2 + shiftY } : {}),
          }));

          tokenPath.commands = shifted;

          return {
            d: tokenPath.toPathData(2),
            advance,
          };
        });

        const totalAdvance = tokenPaths.reduce((sum, item) => sum + item.advance, 0);
        const width = Math.ceil(maxX - minX + HORIZONTAL_PADDING * 2);
        const height = Math.ceil(maxY - minY + VERTICAL_PADDING * 2);

        if (!isMounted) return;

        setPathState({
          segments,
          totalAdvance,
          width,
          height,
        });
      } catch (error) {
        console.error("Failed to build handwritten quote lab", error);
        if (!isMounted) return;
        setPathError(true);
      }
    }

    buildPath();

    return () => {
      isMounted = false;
    };
  }, [selectedFont]);

  useEffect(() => {
    if (!pathState || !sectionRef.current) return;

    const pathEls = pathRefs.current.filter(Boolean) as SVGPathElement[];
    if (pathEls.length === 0) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function initScrollDraw() {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      try {
        const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }] = await Promise.all([
          import("gsap"),
          import("gsap/dist/ScrollTrigger"),
          import("gsap/dist/DrawSVGPlugin"),
        ]);

        if (disposed || !sectionRef.current) return;

        gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

        const sectionEl = sectionRef.current;
        const lengths = pathEls.map((el) => el.getTotalLength());

        const setSegmentProgress = (progress: number) => {
          const speedProgress = applySpeedCurve(clamp01(progress), selectedSpeed.exponent);

          pathEls.forEach((el, index) => {
            const range = segmentRanges[index] ?? { start: 0, end: 1 };
            const span = Math.max(range.end - range.start, 0.0001);
            const localRaw = clamp01((speedProgress - range.start) / span);
            const local = styleLocalProgress(localRaw, selectedStyleId, index);
            const drawEnd = Math.max(local * 100, 0.01);
            const opacity = reduceMotion ? 1 : styleOpacity(local, selectedStyleId);
            const width = styleStrokeWidth(local, selectedStyleId, selectedFont.strokeWidth);

            gsap.set(el, { drawSVG: `0% ${drawEnd}%`, opacity });
            el.style.strokeDasharray = `${lengths[index]}`;
            el.style.strokeDashoffset = `${lengths[index] * (1 - local)}`;
            el.style.strokeWidth = `${width.toFixed(3)}`;
          });
        };

        if (reduceMotion) {
          pathEls.forEach((el, index) => {
            gsap.set(el, { drawSVG: "0% 100%", opacity: 1 });
            el.style.strokeDasharray = `${lengths[index]}`;
            el.style.strokeDashoffset = "0";
            el.style.strokeWidth = `${selectedFont.strokeWidth}`;
          });
          return;
        }

        const trigger = ScrollTrigger.create({
          trigger: sectionEl,
          start: "top 78%",
          end: "bottom 40%",
          onUpdate: (self) => setSegmentProgress(self.progress),
        });

        const applyManualProgress = () => {
          const rect = sectionEl.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const startPx = viewportHeight * 0.78;
          const endPx = viewportHeight * 0.4;
          const distance = rect.height + (startPx - endPx);
          const traveled = startPx - rect.top;
          const progress = distance <= 0 ? 0 : traveled / distance;
          setSegmentProgress(progress);
        };

        const onScroll = () => applyManualProgress();
        const onResize = () => {
          trigger.refresh();
          applyManualProgress();
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        applyManualProgress();

        cleanup = () => {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onResize);
          trigger.kill();
        };
      } catch (error) {
        console.error("Failed to initialize handwriting animation", error);
        pathEls.forEach((el) => {
          el.style.opacity = "1";
          el.style.strokeDashoffset = "0";
        });
      }
    }

    initScrollDraw();

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, [pathState, segmentRanges, selectedStyleId, selectedSpeed, selectedFont.strokeWidth]);

  return (
    <main className="hb-handwriting-lab">
      <div className="hb-handwriting-lab__spacer" />

      <section ref={sectionRef} className="hb-handwriting-lab__stage">
        <div className="hb-handwriting-lab__inner">
          <p className="hb-handwriting-lab__eyebrow">Handwriting Lab</p>

          <h1 className="hb-handwriting-lab__heading">
            The best way to predict the future
          </h1>

          <div className="hb-handwriting-lab__controls" aria-label="Handwriting lab controls">
            <label className="hb-handwriting-lab__field">
              Font
              <select
                className="hb-handwriting-lab__select"
                value={selectedFontId}
                onChange={(event) => setSelectedFontId(event.target.value)}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="hb-handwriting-lab__field">
              Animation
              <select
                className="hb-handwriting-lab__select"
                value={selectedStyleId}
                onChange={(event) => setSelectedStyleId(event.target.value as AnimationStyleId)}
              >
                {ANIMATION_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="hb-handwriting-lab__field">
              Speed
              <select
                className="hb-handwriting-lab__select"
                value={selectedSpeedId}
                onChange={(event) => setSelectedSpeedId(event.target.value)}
              >
                {SPEED_OPTIONS.map((speed) => (
                  <option key={speed.id} value={speed.id}>
                    {speed.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="hb-handwriting-lab__preset-grid" role="group" aria-label="Iteration presets">
            {ITERATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`hb-handwriting-lab__preset ${activeIteration === preset.id ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedFontId(preset.fontId);
                  setSelectedStyleId(preset.styleId);
                  setSelectedSpeedId(preset.speedId);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {pathState ? (
            <svg
              className="hb-handwriting-lab__script"
              viewBox={svgViewBox}
              role="img"
              aria-label={SCRIPT_TEXT}
              preserveAspectRatio="xMinYMid meet"
            >
              {pathState.segments.map((segment, index) => (
                <path
                  key={`segment-${index}`}
                  ref={(el) => {
                    pathRefs.current[index] = el;
                  }}
                  d={segment.d}
                  className="hb-handwriting-lab__path"
                />
              ))}
            </svg>
          ) : (
            <p
              className="hb-handwriting-lab__fallback"
              style={{ fontFamily: selectedFont.fallbackFamily }}
              aria-live="polite"
            >
              {pathError ? SCRIPT_TEXT : "Loading signature..."}
            </p>
          )}

          <p className="hb-handwriting-lab__note">
            10 fonts - 10 animation styles - 10 speed curves - 10 iteration presets
          </p>
        </div>
      </section>

      <div className="hb-handwriting-lab__spacer hb-handwriting-lab__spacer--bottom" />
    </main>
  );
}
