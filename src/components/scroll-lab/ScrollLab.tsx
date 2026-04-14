"use client";

import { useCallback, useEffect, useState } from "react";
import "./scroll-lab.css";

import EffectControls, { FX_DEFAULTS, fxToVars, type FxValues } from "./EffectControls";

const THEMES = [
  { id: "default", label: "Default", desc: "Dark card with layered shadows, vignette, backlight, sheen" },
  { id: "glass", label: "Glass", desc: "Frosted translucent card — backdrop blur, soft borders, see-through" },
  { id: "dossier", label: "Dossier", desc: "Off-white paper file — typed labels, folder tab, cream texture" },
  { id: "neon", label: "Neon Wire", desc: "Transparent card with glowing accent-colored border — blueprint grid" },
  { id: "editorial", label: "Editorial", desc: "Sharp corners, no border, magazine layout — high contrast, bleed to edge" },
  { id: "polaroid", label: "Polaroid", desc: "Thick white frame around content — photo print on a dark surface" },
  { id: "ceramic", label: "Ceramic", desc: "Warm matte surface — soft rounded edges, subtle glaze highlight, kiln-fired feel" },
  { id: "kraft", label: "Kraft", desc: "Brown craft paper — raw, fibrous texture, torn-edge energy, stamped labels" },
  { id: "linen", label: "Linen", desc: "Woven cloth texture — soft warm gray, crosshatch weave, stitched border" },
  { id: "stone", label: "Stone", desc: "Concrete slab — rough mineral surface, chiseled edges, weathered and heavy" },
  { id: "leather", label: "Leather", desc: "Aged hide — warm brown, embossed grain, gold-foil labels, notebook feel" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
import Baseline from "./Baseline";
import ScrollSnap from "./ScrollSnap";
import StickyStack from "./StickyStack";
import ContinuousProgress from "./ContinuousProgress";
import WheelStepper from "./WheelStepper";
import DepthStack from "./DepthStack";
import DragThrow from "./DragThrow";
import CarouselWheel from "./CarouselWheel";
import HorizontalSwipe from "./HorizontalSwipe";
import MorphPanel from "./MorphPanel";

const VARIANTS = [
  {
    id: "baseline",
    label: "Baseline",
    desc: "Tall section + sticky inner + RAF threshold breakpoints + 900ms CSS transitions. The current production system.",
  },
  {
    id: "snap",
    label: "Scroll Snap",
    desc: "CSS scroll-snap-type: y mandatory. Browser-native snap, zero JS. Perfect symmetry by definition.",
  },
  {
    id: "sticky",
    label: "Sticky Stack",
    desc: "Each card is position: sticky inside a tall chapter. Cards stack progressively. Pure CSS, no JS scroll logic.",
  },
  {
    id: "continuous",
    label: "Continuous",
    desc: "Transforms are a direct function of scroll position. No thresholds, no CSS transitions. Visual state exactly tracks scroll.",
  },
  {
    id: "stepper",
    label: "Stepper",
    desc: "Each wheel gesture advances one card. No continuous scroll — discrete steps with smooth animation.",
  },
  {
    id: "depth",
    label: "Depth Stack",
    desc: "Cards layered in Z-space. Front card shrinks + fades to reveal the next scaling up from behind. Like looking through a deck.",
  },
  {
    id: "drag",
    label: "Drag / Throw",
    desc: "Grab and fling cards away. Physics-based — fast flick sends it flying, slow drag lets you peek. Pull back to reverse.",
  },
  {
    id: "carousel",
    label: "Carousel",
    desc: "Cards on a 3D vertical cylinder. Scrolling rotates the wheel. Active card faces forward, others curve away in perspective.",
  },
  {
    id: "hswipe",
    label: "H-Swipe",
    desc: "Vertical scroll drives horizontal card motion. Cards peel sideways — a cross-axis directional tension between input and output.",
  },
  {
    id: "morph",
    label: "Morph",
    desc: "One card on screen that transforms into the next. Number, name, color all interpolate. No sliding — the card changes identity.",
  },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

function VariantContent({ id }: { id: VariantId }) {
  switch (id) {
    case "baseline":
      return <Baseline />;
    case "snap":
      return <ScrollSnap />;
    case "sticky":
      return <StickyStack />;
    case "continuous":
      return <ContinuousProgress />;
    case "stepper":
      return <WheelStepper />;
    case "depth":
      return <DepthStack />;
    case "drag":
      return <DragThrow />;
    case "carousel":
      return <CarouselWheel />;
    case "hswipe":
      return <HorizontalSwipe />;
    case "morph":
      return <MorphPanel />;
  }
}

export default function ScrollLab() {
  const [active, setActive] = useState<VariantId>("baseline");
  const [theme, setTheme] = useState<ThemeId>("default");
  const [showFx, setShowFx] = useState(false);
  const [fx, setFx] = useState<FxValues>({ ...FX_DEFAULTS });
  const variant = VARIANTS.find((v) => v.id === active)!;

  const onFxChange = useCallback((next: FxValues) => setFx(next), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active]);

  const themeClass = theme === "default" ? "" : `sl-theme-${theme}`;

  return (
    <div className="sl-shell">
      <header className="sl-header">
        <span className="sl-title">Scroll Lab</span>

        <div className="sl-tabs">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              className={`sl-tab ${v.id === active ? "is-active" : ""}`}
              onClick={() => setActive(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <span className="sl-info">{variant.desc}</span>

        <button
          className={`sl-fx-toggle ${showFx ? "is-active" : ""}`}
          onClick={() => setShowFx((p) => !p)}
          type="button"
        >
          FX
        </button>
      </header>

      <div className="sl-theme-bar">
        <span className="sl-theme-bar__label">Card</span>
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`sl-theme-btn ${t.id === theme ? "is-active" : ""}`}
            onClick={() => setTheme(t.id)}
            title={t.desc}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className={`sl-viewport ${showFx ? "has-fx-panel" : ""} ${themeClass}`}
        style={fxToVars(fx) as React.CSSProperties}
      >
        <VariantContent key={`${active}-${theme}`} id={active} />
      </div>

      {showFx && <EffectControls values={fx} onChange={onFxChange} />}
    </div>
  );
}
