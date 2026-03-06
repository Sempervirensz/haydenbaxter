/**
 * SupplyChainSection.jsx
 *
 * 6 iteration variants for the Supply Chain hero section.
 * Switch via `variant` prop (1–6) or URL param `?v=1` … `?v=6`.
 *
 * V1 — Clean Reveal      Simple fade-in cascade, no overlays
 * V2 — Layered Map        Country highlights → routes → text, legend
 * V3 — Dashboard Boot-Up  Panel frame, scan line, 5-layer sequence
 * V4 — Smoked Glass       Frosted overlay dissolves, parallax, premium
 * V5 — Contrast Ramp      Everything sharpens from near-invisible
 * V6 — Typed Interface    Static headline, DM Mono typed readout
 *
 * Stack: React 18 · Tailwind CSS · Framer Motion
 * Fonts: Montserrat (headlines/body) · DM Mono (labels/meta/chips)
 */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   CONTENT — shared across all variants
   ═══════════════════════════════════════════════════════════ */

const C = {
  label: "03 / 04",
  title: "Supply Chain",
  line1: "Fortune 100 sourcing leader.",
  line2: "8+ YEARS ACROSS ASIA.",
  line3: "Fluent in Mandarin.",
  line4: "Built supplier networks across China, Vietnam, and Indonesia.",
};

const COUNTRIES = [
  { name: "China", x: 28, y: 30, delay: 0 },
  { name: "Vietnam", x: 34, y: 50, delay: 0.06 },
  { name: "Indonesia", x: 42, y: 66, delay: 0.12 },
];

const ROUTES = [
  { from: COUNTRIES[0], to: COUNTRIES[1], curve: 8 },
  { from: COUNTRIES[1], to: COUNTRIES[2], curve: -6 },
  { from: COUNTRIES[0], to: COUNTRIES[2], curve: 14 },
];

const LEGEND = [
  { color: "bg-white/60", label: "Regions" },
  { color: "bg-sky-400/70", label: "Routes" },
  { color: "bg-amber-400/70", label: "Nodes" },
];

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */

function useTypedText(lines, { speed = 55, deleteSpeed = 30, pause = 2200, active = true } = {}) {
  const [display, setDisplay] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active || !lines.length) return;
    const line = lines[lineIdx];
    if (!deleting && charIdx < line.length) {
      const t = setTimeout(() => { setDisplay(line.slice(0, charIdx + 1)); setCharIdx(i => i + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === line.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => { setDisplay(line.slice(0, charIdx - 1)); setCharIdx(i => i - 1); }, deleteSpeed);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) { setDeleting(false); setLineIdx(i => (i + 1) % lines.length); }
  }, [charIdx, deleting, lineIdx, lines, speed, deleteSpeed, pause, active]);

  return display;
}

/* ═══════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function SectionLabel({ label, title, opacity }) {
  return (
    <motion.div className="flex items-baseline gap-4" style={opacity != null ? { opacity } : undefined}>
      <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-white/40">
        {label}
      </span>
      <h3 className="font-montserrat text-lg sm:text-xl md:text-2xl font-bold text-white/85">{title}</h3>
    </motion.div>
  );
}

function Headline({ text, opacity, y }) {
  return (
    <motion.h2
      className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem]
                 font-extrabold leading-[1.08] tracking-tight mt-6 max-w-3xl"
      style={{ opacity, y }}
    >
      {text}
    </motion.h2>
  );
}

function Subline({ text, opacity, y }) {
  return (
    <motion.p
      className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-4 max-w-2xl"
      style={{ opacity, y }}
    >
      {text}
    </motion.p>
  );
}

function ChipsRow({ chips, progress, startAt = 0.5, stagger = 0.022 }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start mt-8">
      {chips.map((chip, i) => {
        const s = startAt + i * stagger;
        return <ChipItem key={chip} label={chip} progress={progress} start={s} />;
      })}
    </div>
  );
}

function ChipItem({ label, progress, start }) {
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const y = useTransform(progress, [start, start + 0.08], [10, 0]);
  return (
    <motion.span
      className="inline-block font-mono text-[10px] sm:text-[11px] font-medium tracking-widest uppercase
                 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/65 backdrop-blur-sm"
      style={{ opacity, y }}
    >{label}</motion.span>
  );
}

function CtaButton({ text, opacity, y }) {
  return (
    <motion.div className="mt-8" style={{ opacity, y }}>
      <button className="font-mono text-[10px] sm:text-xs font-medium tracking-widest uppercase
                         px-6 py-3 rounded border border-white/15 bg-white/[0.05]
                         text-white/75 hover:bg-white/10 hover:text-white/90 hover:border-white/25
                         transition-all duration-200 backdrop-blur-sm">
        {text}
      </button>
    </motion.div>
  );
}

function TypedReadout({ lines, active }) {
  const text = useTypedText(lines, { active });
  return (
    <div className="mt-3 h-6 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
      <span className="font-mono text-[11px] sm:text-xs tracking-widest uppercase text-white/50">
        {text}
        <span className="inline-block w-[2px] h-[0.85em] bg-white/40 ml-0.5 align-baseline animate-[cursor_600ms_steps(1)_infinite]" />
      </span>
    </div>
  );
}

function CountryLabels({ progress, startAt = 0.15 }) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {COUNTRIES.map(c => {
        const s = startAt + c.delay;
        return <CountryDot key={c.name} c={c} progress={progress} start={s} />;
      })}
    </div>
  );
}

function CountryDot({ c, progress, start }) {
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  const y = useTransform(progress, [start, start + 0.12], [8, 0]);
  return (
    <motion.div className="absolute flex items-center gap-2"
      style={{ left: `${c.x}%`, top: `${c.y}%`, opacity, y }}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inset-0 rounded-full bg-amber-400/70 animate-ping opacity-40" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400/90" />
      </span>
      <span className="font-mono text-[11px] font-medium tracking-widest uppercase text-white/75">{c.name}</span>
    </motion.div>
  );
}

function RouteArcs({ progress, startAt = 0.22, endAt = 0.48 }) {
  const draw = useTransform(progress, [startAt, endAt], [0, 1]);
  return (
    <svg className="absolute inset-0 z-[25] w-full h-full pointer-events-none"
      viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
      {ROUTES.map((r, i) => {
        const mx = (r.from.x + r.to.x) / 2 + r.curve;
        const my = (r.from.y + r.to.y) / 2 - Math.abs(r.curve) * 0.5;
        return (
          <motion.path key={i}
            d={`M ${r.from.x} ${r.from.y} Q ${mx} ${my} ${r.to.x} ${r.to.y}`}
            stroke="rgba(56,189,248,0.35)" strokeWidth="0.15" strokeLinecap="round"
            style={{ pathLength: draw }} />
        );
      })}
    </svg>
  );
}

function LegendCorner({ progress, startAt = 0.6 }) {
  const opacity = useTransform(progress, [startAt, startAt + 0.18], [0, 1]);
  return (
    <motion.div className="absolute bottom-6 right-6 z-[70] flex flex-col gap-1.5 pointer-events-none" style={{ opacity }}>
      {LEGEND.map(l => (
        <div key={l.label} className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${l.color}`} />
          <span className="font-mono text-[9px] tracking-widest uppercase text-white/45">{l.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

function TextGradient() {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
    </div>
  );
}

function Vignette() {
  return (
    <div className="absolute inset-0 z-[55] pointer-events-none"
      style={{ background: "radial-gradient(110% 90% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.85) 100%)" }} />
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 1 — Clean Reveal
   Simple, premium fade-in cascade. No overlays, no routes,
   no legend. Just map + text + chips.
   ═══════════════════════════════════════════════════════════ */

function V1({ p, map }) {
  const mapOp = useTransform(p, [0.05, 0.35], [0, 0.55]);
  const mapF = useTransform(p, [0, 0.4], [0.3, 0.5], { clamp: true });
  const mapFilter = useTransform(mapF, v => `brightness(${v}) contrast(1.2) saturate(0.18)`);
  const hOp = useTransform(p, [0.18, 0.38], [0, 1]);
  const hY = useTransform(p, [0.18, 0.38], [24, 0]);
  const sOp = useTransform(p, [0.3, 0.48], [0, 1]);
  const sY = useTransform(p, [0.3, 0.48], [14, 0]);
  const ctaOp = useTransform(p, [0.58, 0.72], [0, 1]);
  const ctaY = useTransform(p, [0.58, 0.72], [10, 0]);
  const labOp = useTransform(p, [0, 0.12], [0.3, 0.7]);

  return (
    <>
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>
      <TextGradient />
      <Vignette />
      <div className="absolute inset-0 z-50 flex items-end lg:items-center pb-24 lg:pb-0">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
          <SectionLabel label={C.label} title={C.title} opacity={labOp} />
          <Headline text={C.line1} opacity={hOp} y={hY} />
          <Subline text={C.line2} opacity={sOp} y={sY} />
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-3 max-w-2xl"
            style={{ opacity: sOp, y: sY }}
          >{C.line3}</motion.p>
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/55 mt-3 max-w-2xl"
            style={{ opacity: ctaOp, y: ctaY }}
          >{C.line4}</motion.p>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 2 — Layered Map
   Map silhouette → country highlights → route arcs → text.
   Corner legend. Geographic / data-viz feel.
   ═══════════════════════════════════════════════════════════ */

function V2({ p, map }) {
  const mapOp = useTransform(p, [0.02, 0.22], [0, 0.6]);
  const mapF = useTransform(p, [0, 0.3], [0.25, 0.52]);
  const mapFilter = useTransform(mapF, v => `brightness(${v}) contrast(1.25) saturate(0.2)`);
  const hOp = useTransform(p, [0.35, 0.52], [0, 1]);
  const hY = useTransform(p, [0.35, 0.52], [28, 0]);
  const sOp = useTransform(p, [0.42, 0.58], [0, 1]);
  const ctaOp = useTransform(p, [0.62, 0.76], [0, 1]);
  const ctaY = useTransform(p, [0.62, 0.76], [10, 0]);

  return (
    <>
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>
      <CountryLabels progress={p} startAt={0.12} />
      <RouteArcs progress={p} startAt={0.2} endAt={0.42} />
      <TextGradient />
      <Vignette />
      <div className="absolute inset-0 z-50 flex items-end lg:items-center pb-24 lg:pb-0">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
          <SectionLabel label={C.label} title={C.title} />
          <Headline text={C.line1} opacity={hOp} y={hY} />
          <Subline text={C.line2} opacity={sOp} />
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-3 max-w-2xl"
            style={{ opacity: sOp }}
          >{C.line3}</motion.p>
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/55 mt-3 max-w-2xl"
            style={{ opacity: ctaOp, y: ctaY }}
          >{C.line4}</motion.p>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 3 — Dashboard Boot-Up
   Panel frame + scan line animate first, then layers boot
   in like a cinematic operations dashboard.
   ═══════════════════════════════════════════════════════════ */

function V3({ p, map }) {
  /* Panel frame */
  const frameOp = useTransform(p, [0.02, 0.12], [0, 1]);
  /* Scan line */
  const scanY = useTransform(p, [0.04, 0.2], ["-10%", "110%"]);
  const scanOp = useTransform(p, [0.04, 0.1, 0.18, 0.2], [0, 0.5, 0.5, 0]);
  /* Map */
  const mapOp = useTransform(p, [0.08, 0.28], [0, 0.55]);
  const mapFilter = useTransform(p, [0.08, 0.35],
    ["brightness(0.2) contrast(1.4) saturate(0)", "brightness(0.5) contrast(1.2) saturate(0.18)"]
  );
  /* Grid */
  const gridOp = useTransform(p, [0.1, 0.25], [0, 0.04]);
  /* Content */
  const hOp = useTransform(p, [0.3, 0.48], [0, 1]);
  const hY = useTransform(p, [0.3, 0.48], [20, 0]);
  const sOp = useTransform(p, [0.4, 0.55], [0, 1]);
  const ctaOp = useTransform(p, [0.6, 0.74], [0, 1]);
  const ctaY = useTransform(p, [0.6, 0.74], [10, 0]);

  return (
    <>
      {/* Panel border frame */}
      <motion.div className="absolute inset-4 z-[5] border border-white/[0.06] rounded-lg pointer-events-none"
        style={{ opacity: frameOp }} />
      {/* Corner markers */}
      <motion.div className="absolute inset-4 z-[6] pointer-events-none" style={{ opacity: frameOp }}>
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(pos => (
          <span key={pos} className={`absolute ${pos} w-3 h-3 border-white/20 ${
            pos.includes("top") ? "border-t" : "border-b"
          } ${pos.includes("left") ? "border-l" : "border-r"}`} />
        ))}
      </motion.div>
      {/* Scan line */}
      <motion.div className="absolute left-0 right-0 h-px z-[7] pointer-events-none bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
        style={{ top: scanY, opacity: scanOp }} />
      {/* Map */}
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>
      {/* Grid */}
      <motion.div className="absolute inset-0 z-[15] pointer-events-none" style={{ opacity: gridOp }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 80px)",
        }} />
      </motion.div>
      <CountryLabels progress={p} startAt={0.18} />
      <RouteArcs progress={p} startAt={0.24} endAt={0.46} />
      <TextGradient />
      <Vignette />
      <div className="absolute inset-0 z-50 flex items-end lg:items-center pb-24 lg:pb-0">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
          <SectionLabel label={C.label} title={C.title} />
          <Headline text={C.line1} opacity={hOp} y={hY} />
          <Subline text={C.line2} opacity={sOp} />
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-3 max-w-2xl"
            style={{ opacity: sOp }}
          >{C.line3}</motion.p>
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/55 mt-3 max-w-2xl"
            style={{ opacity: ctaOp, y: ctaY }}
          >{C.line4}</motion.p>
        </div>
      </div>
      {/* Boot status line */}
      <motion.div className="absolute top-5 right-5 z-[70] font-mono text-[9px] tracking-widest uppercase text-white/25 pointer-events-none"
        style={{ opacity: frameOp }}>
        SYS:READY
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 4 — Smoked Glass Dissolve
   Heavy frosted glass overlay dissolves on scroll, revealing
   the map and text. Subtle parallax. Premium luxury feel.
   ═══════════════════════════════════════════════════════════ */

function V4({ p, map }) {
  /* Glass */
  const glassOp = useTransform(p, [0, 0.22], [1, 0]);
  const glassBlur = useTransform(p, [0, 0.2], [14, 0]);
  const glassF = useTransform(glassBlur, v => `blur(${v}px)`);
  /* Map — starts visible behind glass, sharpens */
  const mapOp = useTransform(p, [0, 0.12], [0.25, 0.62]);
  const mapBr = useTransform(p, [0, 0.3], [0.3, 0.52]);
  const mapFilter = useTransform(mapBr, v => `brightness(${v}) contrast(1.2) saturate(0.18)`);
  const mapY = useTransform(p, [0, 1], [0, -40]); /* parallax */
  const mapScale = useTransform(p, [0, 1], [1.06, 1.0]);
  /* Content */
  const hOp = useTransform(p, [0.2, 0.4], [0, 1]);
  const hY = useTransform(p, [0.2, 0.4], [30, 0]);
  const sOp = useTransform(p, [0.32, 0.5], [0, 1]);
  const sY = useTransform(p, [0.32, 0.5], [18, 0]);
  const ctaOp = useTransform(p, [0.56, 0.7], [0, 1]);
  const ctaY = useTransform(p, [0.56, 0.7], [10, 0]);

  return (
    <>
      {/* Map with parallax */}
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter, y: mapY, scale: mapScale }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>
      {/* Glass overlay */}
      <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: glassOp }}>
        <motion.div className="absolute inset-0 bg-black/80" style={{ backdropFilter: glassF }} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
      </motion.div>
      <TextGradient />
      <Vignette />
      <div className="absolute inset-0 z-50 flex items-end lg:items-center pb-24 lg:pb-0">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
          <SectionLabel label={C.label} title={C.title} />
          <Headline text={C.line1} opacity={hOp} y={hY} />
          <Subline text={C.line2} opacity={sOp} y={sY} />
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-3 max-w-2xl"
            style={{ opacity: sOp, y: sY }}
          >{C.line3}</motion.p>
          <motion.p
            className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/55 mt-3 max-w-2xl"
            style={{ opacity: ctaOp, y: ctaY }}
          >{C.line4}</motion.p>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 5 — Contrast Ramp
   Everything starts near-invisible (very low contrast) and
   gradually sharpens to a crisp final state. Unified
   emergence — map, text, and labels sharpen together.
   ═══════════════════════════════════════════════════════════ */

function V5({ p, map }) {
  /* Global master opacity ramp */
  const masterOp = useTransform(p, [0, 0.5], [0.06, 1]);
  /* Map */
  const mapOp = useTransform(p, [0, 0.35], [0.15, 0.6]);
  const mapBr = useTransform(p, [0, 0.5], [0.15, 0.52]);
  const mapCt = useTransform(p, [0, 0.5], [0.6, 1.3]);
  const mapSat = useTransform(p, [0, 0.5], [0, 0.2]);
  const mapFilter = useTransform([mapBr, mapCt, mapSat], ([b, c, s]) => `brightness(${b}) contrast(${c}) saturate(${s})`);
  /* Text — starts very dim, sharpens */
  const textOp = useTransform(p, [0.08, 0.45], [0.08, 1]);
  const textFilter = useTransform(p, [0.08, 0.4], ["blur(1.5px)", "blur(0px)"]);
  /* Subline slightly later */
  const subOp = useTransform(p, [0.2, 0.52], [0.05, 1]);
  /* Chips */
  const chipsOp = useTransform(p, [0.35, 0.6], [0, 1]);
  /* CTA */
  const ctaOp = useTransform(p, [0.5, 0.68], [0, 1]);

  return (
    <>
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>
      <TextGradient />
      <Vignette />
      <motion.div className="absolute inset-0 z-50 flex items-end lg:items-center pb-24 lg:pb-0" style={{ opacity: masterOp }}>
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
          <SectionLabel label={C.label} title={C.title} />
          <motion.h2
            className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem]
                       font-extrabold leading-[1.08] tracking-tight mt-6 max-w-3xl"
            style={{ opacity: textOp, filter: textFilter }}>
            {C.line1}
          </motion.h2>
          <motion.p className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-4 max-w-2xl"
            style={{ opacity: subOp }}>
            {C.line2}
          </motion.p>
          <motion.p className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-3 max-w-2xl"
            style={{ opacity: chipsOp }}>
            {C.line3}
          </motion.p>
          <motion.p className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/55 mt-3 max-w-2xl"
            style={{ opacity: ctaOp }}>
            {C.line4}
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 6 — Typed Interface
   Minimal animation on layout. Static headline, simple map
   reveal. The signature element is a DM Mono typed readout
   that cycles through metadata — restrained, not gimmicky.
   ═══════════════════════════════════════════════════════════ */

function V6({ p, map }) {
  const mapOp = useTransform(p, [0.05, 0.3], [0, 0.5]);
  const mapFilter = useTransform(p, [0, 0.3], [0.3, 0.48]);
  const mapF = useTransform(mapFilter, v => `brightness(${v}) contrast(1.15) saturate(0.12)`);
  const contentOp = useTransform(p, [0.12, 0.32], [0, 1]);
  const contentY = useTransform(p, [0.12, 0.32], [18, 0]);
  const ctaOp = useTransform(p, [0.45, 0.6], [0, 1]);

  return (
    <>
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapF }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>
      <TextGradient />
      <Vignette />
      <div className="absolute inset-0 z-50 flex items-end lg:items-center pb-24 lg:pb-0">
        <motion.div className="w-full max-w-6xl mx-auto px-6 lg:px-12" style={{ opacity: contentOp, y: contentY }}>
          <SectionLabel label={C.label} title={C.title} />
          {/* Static headline */}
          <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem]
                         font-extrabold leading-[1.08] tracking-tight mt-6 max-w-3xl">
            {C.line1}
          </h2>
          <p className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-4 max-w-2xl">
            {C.line2}
          </p>
          <p className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/65 mt-3 max-w-2xl">
            {C.line3}
          </p>
          <motion.p className="font-montserrat text-base sm:text-lg md:text-xl font-medium text-white/55 mt-3 max-w-2xl"
            style={{ opacity: ctaOp }}>
            {C.line4}
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDITORIAL SHARED SUB-COMPONENTS
   Used by V7, V8, V9 — dark, serif-led, cinematic, no SaaS.
   ═══════════════════════════════════════════════════════════ */

/** Film grain / noise texture overlay */
function FilmGrain({ intensity = 0.035 }) {
  return (
    <div
      className="absolute inset-0 z-[56] pointer-events-none mix-blend-soft-light"
      style={{
        opacity: intensity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
      }}
    />
  );
}

/** Heavy cinematic vignette — darker and wider than standard Vignette */
function EditorialVignette() {
  return (
    <div
      className="absolute inset-0 z-[54] pointer-events-none"
      style={{
        background:
          "radial-gradient(80% 72% at 50% 48%, transparent 18%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.72) 74%, rgba(0,0,0,0.92) 100%)",
      }}
    />
  );
}

/** Black veil overlay that lightens on scroll */
function BlackVeil({ progress, startAt = 0, endAt = 0.25, maxOpacity = 0.88 }) {
  const opacity = useTransform(progress, [startAt, endAt], [maxOpacity, 0]);
  return (
    <motion.div
      className="absolute inset-0 z-[18] pointer-events-none bg-black"
      style={{ opacity }}
    />
  );
}

/** Subtle white route arcs in editorial gray (not colored) */
function EditorialRoutes({ progress, startAt = 0.5, endAt = 0.72 }) {
  const draw = useTransform(progress, [startAt, endAt], [0, 1]);
  const opacity = useTransform(progress, [startAt, endAt], [0, 0.18]);
  return (
    <motion.svg
      className="absolute inset-0 z-[22] w-full h-full pointer-events-none"
      viewBox="0 0 100 100" preserveAspectRatio="none" fill="none"
      style={{ opacity }}
    >
      {ROUTES.map((r, i) => {
        const mx = (r.from.x + r.to.x) / 2 + r.curve;
        const my = (r.from.y + r.to.y) / 2 - Math.abs(r.curve) * 0.5;
        return (
          <motion.path key={i}
            d={`M ${r.from.x} ${r.from.y} Q ${mx} ${my} ${r.to.x} ${r.to.y}`}
            stroke="rgba(255,255,255,0.5)" strokeWidth="0.12" strokeLinecap="round"
            style={{ pathLength: draw }} />
        );
      })}
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 7 — Dark Editorial
   Fashion-forward, serif-led, film grain, black veil that
   lifts. Large centered serif headline over dark map.
   NOT a dashboard — pure editorial composition.
   ═══════════════════════════════════════════════════════════ */

function V7({ p, map }) {
  /* Map */
  const mapOp = useTransform(p, [0.04, 0.32], [0, 0.5]);
  const mapBr = useTransform(p, [0, 0.35], [0.22, 0.46]);
  const mapFilter = useTransform(mapBr, v => `brightness(${v}) contrast(1.25) saturate(0.08)`);
  const mapScale = useTransform(p, [0, 1], [1.04, 1.0]);
  /* Headline */
  const hOp = useTransform(p, [0.18, 0.4], [0, 1]);
  const hY = useTransform(p, [0.18, 0.4], [20, 0]);
  const hFilter = useTransform(p, [0.18, 0.38], ["blur(2px)", "blur(0px)"]);
  /* DM Mono metadata */
  const metaOp = useTransform(p, [0.34, 0.5], [0, 1]);
  /* Montserrat support line */
  const supportOp = useTransform(p, [0.42, 0.58], [0, 1]);
  const supportY = useTransform(p, [0.42, 0.58], [10, 0]);
  /* Section label top-left */
  const labOp = useTransform(p, [0.02, 0.14], [0, 0.6]);

  return (
    <>
      {/* Map */}
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter, scale: mapScale }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>

      {/* Black veil — lifts on scroll */}
      <BlackVeil progress={p} endAt={0.22} maxOpacity={0.92} />

      {/* Text readability gradient */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      </div>

      {/* Editorial vignette + grain */}
      <EditorialVignette />
      <FilmGrain intensity={0.04} />

      {/* Optional restrained routes — appear last */}
      <EditorialRoutes progress={p} startAt={0.55} endAt={0.78} />

      {/* Content — centered composition with generous space */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-6">

        {/* Section label top-left — absolute */}
        <motion.div className="absolute top-6 left-6 lg:top-8 lg:left-10 flex items-baseline gap-3" style={{ opacity: labOp }}>
          <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-white/35">{C.label}</span>
          <span className="font-serif text-base sm:text-lg font-bold italic text-white/50">{C.title}</span>
        </motion.div>

        {/* Huge serif headline — centered */}
        <motion.h2
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                     font-black leading-[1.0] tracking-tight max-w-5xl"
          style={{ opacity: hOp, y: hY, filter: hFilter }}
        >
          {C.line1}
        </motion.h2>

        {/* DM Mono metadata */}
        <motion.p
          className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/50 mt-6"
          style={{ opacity: metaOp }}
        >
          {C.line2}
        </motion.p>

        {/* Fluent in Mandarin */}
        <motion.p
          className="font-montserrat text-sm sm:text-base md:text-lg font-medium text-white/55 mt-4 max-w-xl"
          style={{ opacity: metaOp }}
        >
          {C.line3}
        </motion.p>

        {/* Montserrat support line */}
        <motion.p
          className="font-montserrat text-sm sm:text-base md:text-lg font-medium text-white/50 mt-4 max-w-xl"
          style={{ opacity: supportOp, y: supportY }}
        >
          {C.line4}
        </motion.p>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 8 — Cinematic Map Reveal
   Dark map emerges from black. Region highlights for China,
   Vietnam, Indonesia. Serif-led, centered. Elegant motion.
   ═══════════════════════════════════════════════════════════ */

function V8({ p, map }) {
  /* Map — very slow reveal */
  const mapOp = useTransform(p, [0.03, 0.35], [0, 0.52]);
  const mapBr = useTransform(p, [0, 0.4], [0.18, 0.48]);
  const mapFilter = useTransform(mapBr, v => `brightness(${v}) contrast(1.3) saturate(0.06)`);
  /* Region highlight — subtle brightness circles over countries */
  const regionOp = useTransform(p, [0.14, 0.32], [0, 1]);
  /* Headline */
  const hOp = useTransform(p, [0.28, 0.48], [0, 1]);
  const hY = useTransform(p, [0.28, 0.48], [24, 0]);
  const hFilter = useTransform(p, [0.28, 0.46], ["blur(1.5px)", "blur(0px)"]);
  /* Meta */
  const metaOp = useTransform(p, [0.4, 0.55], [0, 1]);
  /* Support */
  const supportOp = useTransform(p, [0.48, 0.62], [0, 1]);
  const supportY = useTransform(p, [0.48, 0.62], [10, 0]);
  /* Country labels (editorial style — smaller, white) */
  const countryOp = useTransform(p, [0.16, 0.3], [0, 0.7]);

  return (
    <>
      {/* Map */}
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>

      {/* Black veil */}
      <BlackVeil progress={p} endAt={0.2} maxOpacity={0.9} />

      {/* Region highlights — soft radial glows at country positions */}
      <motion.div className="absolute inset-0 z-[12] pointer-events-none" style={{ opacity: regionOp }}>
        {COUNTRIES.map(c => (
          <div key={c.name} className="absolute" style={{
            left: `${c.x}%`, top: `${c.y}%`,
            width: "14vw", height: "14vw", transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }} />
        ))}
      </motion.div>

      {/* Editorial country labels — small, italic serif */}
      <motion.div className="absolute inset-0 z-[28] pointer-events-none" style={{ opacity: countryOp }}>
        {COUNTRIES.map(c => (
          <div key={c.name} className="absolute font-serif text-[10px] sm:text-[11px] italic text-white/45 tracking-wide"
            style={{ left: `${c.x + 2}%`, top: `${c.y + 1}%` }}>
            {c.name}
          </div>
        ))}
      </motion.div>

      {/* Optional routes — last, very subtle */}
      <EditorialRoutes progress={p} startAt={0.58} endAt={0.8} />

      {/* Gradients + vignette + grain */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />
      </div>
      <EditorialVignette />
      <FilmGrain intensity={0.03} />

      {/* Content — centered cinematic */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-6">

        {/* Section label */}
        <motion.div className="absolute top-6 left-6 lg:top-8 lg:left-10 flex items-baseline gap-3"
          style={{ opacity: useTransform(p, [0.02, 0.12], [0, 0.55]) }}>
          <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-white/30">{C.label}</span>
          <span className="font-serif text-base font-bold italic text-white/45">{C.title}</span>
        </motion.div>

        {/* Serif headline */}
        <motion.h2
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.4rem]
                     font-black leading-[1.02] tracking-tight max-w-4xl"
          style={{ opacity: hOp, y: hY, filter: hFilter }}
        >
          {C.line1}
        </motion.h2>

        {/* DM Mono metadata */}
        <motion.p
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/45 mt-6"
          style={{ opacity: metaOp }}
        >
          {C.line2}
        </motion.p>

        {/* Fluent in Mandarin */}
        <motion.p
          className="font-montserrat text-sm sm:text-base font-medium text-white/50 mt-4 max-w-lg"
          style={{ opacity: metaOp }}
        >
          {C.line3}
        </motion.p>

        {/* Montserrat support */}
        <motion.p
          className="font-montserrat text-sm sm:text-base font-normal text-white/45 mt-4 max-w-lg"
          style={{ opacity: supportOp, y: supportY }}
        >
          {C.line4}
        </motion.p>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT 9 — Technical Luxury
   Editorial serif + subtle interface accents: thin rules,
   panel lines, micro DM Mono labels in corners. Premium,
   dark, custom. NOT a dashboard — restrained interface cues.
   ═══════════════════════════════════════════════════════════ */

function V9({ p, map }) {
  /* Map */
  const mapOp = useTransform(p, [0.04, 0.3], [0, 0.48]);
  const mapBr = useTransform(p, [0, 0.35], [0.2, 0.44]);
  const mapFilter = useTransform(mapBr, v => `brightness(${v}) contrast(1.3) saturate(0.06)`);
  /* Interface lines */
  const linesOp = useTransform(p, [0.08, 0.25], [0, 0.08]);
  /* Micro labels */
  const microOp = useTransform(p, [0.15, 0.32], [0, 1]);
  /* Headline */
  const hOp = useTransform(p, [0.22, 0.42], [0, 1]);
  const hY = useTransform(p, [0.22, 0.42], [18, 0]);
  const hFilter = useTransform(p, [0.22, 0.4], ["blur(1.5px)", "blur(0px)"]);
  /* Meta */
  const metaOp = useTransform(p, [0.36, 0.5], [0, 1]);
  /* Support */
  const supportOp = useTransform(p, [0.44, 0.58], [0, 1]);
  return (
    <>
      {/* Map */}
      <motion.div className="absolute inset-0 z-10" style={{ opacity: mapOp, filter: mapFilter }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url("${map}")` }} />
      </motion.div>

      {/* Black veil */}
      <BlackVeil progress={p} endAt={0.2} maxOpacity={0.88} />

      {/* Subtle guide lines — thin horizontal + vertical rules */}
      <motion.div className="absolute inset-0 z-[14] pointer-events-none" style={{ opacity: linesOp }}>
        {/* Horizontal */}
        <div className="absolute top-[30%] left-0 right-0 h-px bg-white/30" />
        <div className="absolute top-[70%] left-0 right-0 h-px bg-white/30" />
        {/* Vertical */}
        <div className="absolute top-0 bottom-0 left-[8%] w-px bg-white/20" />
        <div className="absolute top-0 bottom-0 right-[8%] w-px bg-white/20" />
        {/* Cross marker center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-px h-4 bg-white/15 mx-auto" />
          <div className="h-px w-4 bg-white/15 -mt-2 ml-[-7px]" />
        </div>
      </motion.div>

      {/* Restrained route arcs */}
      <EditorialRoutes progress={p} startAt={0.52} endAt={0.74} />

      {/* Country dots — small, no ping, editorial */}
      <motion.div className="absolute inset-0 z-[26] pointer-events-none" style={{ opacity: microOp }}>
        {COUNTRIES.map(c => (
          <div key={c.name} className="absolute flex items-center gap-1.5"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/35">{c.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Gradients + vignette + grain */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
      </div>
      <EditorialVignette />
      <FilmGrain intensity={0.038} />

      {/* Content — left-weighted with generous negative space */}
      <div className="absolute inset-0 z-50 flex items-center px-6 lg:px-[10%]">
        <div className="max-w-3xl">

          {/* Section label */}
          <motion.div className="flex items-baseline gap-3 mb-8"
            style={{ opacity: useTransform(p, [0.02, 0.14], [0, 0.5]) }}>
            <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-white/30">{C.label}</span>
            <span className="w-6 h-px bg-white/15 translate-y-[-1px]" />
            <span className="font-serif text-sm font-bold italic text-white/40">{C.title}</span>
          </motion.div>

          {/* Serif headline — large, not centered */}
          <motion.h2
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                       font-black leading-[1.02] tracking-tight"
            style={{ opacity: hOp, y: hY, filter: hFilter }}
          >
            {C.line1}
          </motion.h2>

          {/* DM Mono metadata */}
          <motion.p
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/40 mt-6"
            style={{ opacity: metaOp }}
          >
            {C.line2}
          </motion.p>

          {/* Fluent in Mandarin */}
          <motion.p
            className="font-montserrat text-sm sm:text-base md:text-lg font-medium text-white/50 mt-4 max-w-xl"
            style={{ opacity: metaOp }}
          >
            {C.line3}
          </motion.p>

          {/* Montserrat support */}
          <motion.p
            className="font-montserrat text-sm sm:text-base md:text-lg font-normal text-white/45 mt-4 max-w-xl leading-relaxed"
            style={{ opacity: supportOp }}
          >
            {C.line4}
          </motion.p>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT — picks the variant to render
   ═══════════════════════════════════════════════════════════ */

const VARIANTS = { 1: V1, 2: V2, 3: V3, 4: V4, 5: V5, 6: V6, 7: V7, 8: V8, 9: V9 };

export const VARIANT_NAMES = {
  1: "Clean Reveal",
  2: "Layered Map",
  3: "Dashboard Boot-Up",
  4: "Smoked Glass",
  5: "Contrast Ramp",
  6: "Typed Interface",
  7: "Dark Editorial",
  8: "Cinematic Map",
  9: "Technical Luxury",
};

export default function SupplyChainSection({ variant = 1, mapAsset = "/mapmaster.jpeg", sectionHeight = "300vh" }) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const Variant = VARIANTS[variant] || V1;

  /* Reduced motion fallback */
  if (prefersReducedMotion) {
    return (
      <section className="relative min-h-screen bg-black">
        <div className="relative h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-10">
            <div className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-50"
              style={{ backgroundImage: `url("${mapAsset}")`, filter: "saturate(0.15) contrast(1.2) brightness(0.45)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          <div className="relative z-50 w-full max-w-5xl mx-auto px-6 lg:px-12">
            <SectionLabel label={C.label} title={C.title} />
            <h2 className="font-montserrat text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mt-6">{C.line1}</h2>
            <p className="font-montserrat text-lg text-white/70 mt-4">{C.line2}</p>
            <p className="font-montserrat text-lg text-white/65 mt-3">{C.line3}</p>
            <p className="font-montserrat text-lg text-white/60 mt-3">{C.line4}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <Variant p={scrollYProgress} map={mapAsset} />
      </div>
    </section>
  );
}
