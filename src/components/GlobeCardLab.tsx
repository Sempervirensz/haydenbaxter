"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import { LABEL_PRESETS } from "@/data/globeCardLabLabels";
import dynamic from "next/dynamic";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import "./globe-card-lab.css";

const RealisticGlobe = dynamic(
  () => import("@/components/ui/realistic-globe"),
  { ssr: false }
);

/* ── Types ── */
type CardPosition =
  | "right"
  | "bottom-right"
  | "bottom-center"
  | "left"
  | "overlay-bottom";

type GlobeStyle = "wireframe" | "blue-marble" | "night-lights" | "clouds" | "dark-minimal";
type DeviceView = "desktop" | "mobile";

const GLOBE_STYLES: { value: GlobeStyle; label: string }[] = [
  { value: "wireframe", label: "Wireframe" },
  { value: "blue-marble", label: "Blue Marble" },
  { value: "night-lights", label: "Night Lights" },
  { value: "clouds", label: "Clouds" },
  { value: "dark-minimal", label: "Dark Minimal" },
];

interface LabSettings {
  desktopGlobeSize: number;
  mobileGlobeSize: number;
  desktopCardPos: CardPosition;
  mobileCardPos: CardPosition;
}

const DEFAULTS: LabSettings = {
  desktopGlobeSize: 700,
  mobileGlobeSize: 340,
  desktopCardPos: "right",
  mobileCardPos: "bottom-right",
};

const CARD_POSITIONS: { value: CardPosition; label: string }[] = [
  { value: "right", label: "Right" },
  { value: "bottom-right", label: "Bottom-Right" },
  { value: "bottom-center", label: "Bottom-Center" },
  { value: "left", label: "Left" },
  { value: "overlay-bottom", label: "Overlay Bottom" },
];

export default function GlobeCardLab() {
  const [settings, setSettings] = useState<LabSettings>(DEFAULTS);
  const [globeStyle, setGlobeStyle] = useState<GlobeStyle>("wireframe");
  const [view, setView] = useState<DeviceView>("desktop");
  const [lonOffset, setLonOffset] = useState(0);
  const [latOffset, setLatOffset] = useState(0);
  const [labelPresetId, setLabelPresetId] = useState<string>(LABEL_PRESETS[0].id);
  const labelPreset =
    LABEL_PRESETS.find((p) => p.id === labelPresetId) ?? LABEL_PRESETS[0];
  const [selectedStop, setSelectedStop] = useState<number | undefined>();
  const [revealedCount, setRevealedCount] = useState(0);
  const hasPlayed = useRef(false);

  /* Reveal animation on mount */
  useEffect(() => {
    if (hasPlayed.current) {
      setRevealedCount(JOURNEY_STOPS.length);
      if (selectedStop === undefined) setSelectedStop(0);
      return;
    }
    hasPlayed.current = true;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= JOURNEY_STOPS.length) {
        clearInterval(timer);
        setTimeout(() => setSelectedStop(0), 600);
      }
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = useCallback(
    (i: number) => {
      if (i >= revealedCount) return;
      setSelectedStop(i);
    },
    [revealedCount]
  );

  const update = <K extends keyof LabSettings>(key: K, val: LabSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: val }));

  /* Derived values for current view */
  const globeSize =
    view === "desktop" ? settings.desktopGlobeSize : settings.mobileGlobeSize;
  const cardPos =
    view === "desktop" ? settings.desktopCardPos : settings.mobileCardPos;

  const visibleDots = JOURNEY_STOPS.slice(0, revealedCount);
  const journeyDots = visibleDots.map((stop, i) => ({
    coords: stop.coords,
    label: stop.label,
    selected: selectedStop === i,
  }));
  const visibleArcs = JOURNEY_ARCS.filter(
    (a) => a.from < visibleDots.length && a.to < visibleDots.length
  );
  const activeStop =
    selectedStop !== undefined ? JOURNEY_STOPS[selectedStop] : null;

  const previewWidth = view === "desktop" ? "100%" : "390px";

  return (
    <div className="gcl">
      {/* ── Controls ── */}
      <header className="gcl__controls">
        <h1 className="gcl__title">Globe + Card Lab</h1>
        <p className="gcl__subtitle">
          Frozen globe — responds only to location selection. No drag or zoom.
        </p>

        {/* View toggle */}
        <div className="gcl__row">
          <span className="gcl__label">Preview</span>
          <div className="gcl__toggle">
            {(["desktop", "mobile"] as DeviceView[]).map((v) => (
              <button
                key={v}
                type="button"
                className={`gcl__toggleBtn ${view === v ? "is-active" : ""}`}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Globe style selector */}
        <label className="gcl__selectRow">
          <span className="gcl__label">Globe style</span>
          <select
            value={globeStyle}
            onChange={(e) => setGlobeStyle(e.target.value as GlobeStyle)}
          >
            {GLOBE_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        {/* Timeline label preset */}
        <label className="gcl__selectRow">
          <span className="gcl__label">Timeline labels</span>
          <select
            value={labelPresetId}
            onChange={(e) => setLabelPresetId(e.target.value)}
          >
            {LABEL_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        {/* Lon/Lat offset — 3D globe styles only */}
        {globeStyle !== "wireframe" && (
          <fieldset className="gcl__fieldset">
            <legend className="gcl__legend">Globe Orientation</legend>
            <label className="gcl__sliderRow">
              <span className="gcl__label">
                Longitude offset:{" "}
                <code className="gcl__val">{lonOffset}°</code>
              </span>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={lonOffset}
                onChange={(e) => setLonOffset(Number(e.target.value))}
              />
            </label>
            <label className="gcl__sliderRow">
              <span className="gcl__label">
                Latitude offset:{" "}
                <code className="gcl__val">{latOffset}°</code>
              </span>
              <input
                type="range"
                min={-90}
                max={90}
                step={1}
                value={latOffset}
                onChange={(e) => setLatOffset(Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              className="gcl__toggleBtn"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
              onClick={() => { setLonOffset(0); setLatOffset(0); }}
            >
              Reset
            </button>
          </fieldset>
        )}

        {/* Desktop controls */}
        <fieldset className="gcl__fieldset">
          <legend className="gcl__legend">Desktop</legend>
          <label className="gcl__sliderRow">
            <span className="gcl__label">
              Globe size:{" "}
              <code className="gcl__val">{settings.desktopGlobeSize}px</code>
            </span>
            <input
              type="range"
              min={300}
              max={900}
              step={10}
              value={settings.desktopGlobeSize}
              onChange={(e) =>
                update("desktopGlobeSize", Number(e.target.value))
              }
            />
          </label>
          <label className="gcl__selectRow">
            <span className="gcl__label">Card position</span>
            <select
              value={settings.desktopCardPos}
              onChange={(e) =>
                update("desktopCardPos", e.target.value as CardPosition)
              }
            >
              {CARD_POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        {/* Mobile controls */}
        <fieldset className="gcl__fieldset">
          <legend className="gcl__legend">Mobile</legend>
          <label className="gcl__sliderRow">
            <span className="gcl__label">
              Globe size:{" "}
              <code className="gcl__val">{settings.mobileGlobeSize}px</code>
            </span>
            <input
              type="range"
              min={200}
              max={500}
              step={10}
              value={settings.mobileGlobeSize}
              onChange={(e) =>
                update("mobileGlobeSize", Number(e.target.value))
              }
            />
          </label>
          <label className="gcl__selectRow">
            <span className="gcl__label">Card position</span>
            <select
              value={settings.mobileCardPos}
              onChange={(e) =>
                update("mobileCardPos", e.target.value as CardPosition)
              }
            >
              {CARD_POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      </header>

      {/* ── Preview ── */}
      <section
        className={`gcl__preview gcl__preview--${view}`}
        style={{ maxWidth: previewWidth }}
      >
        {/* Timeline nav */}
        <nav
          className={`gcl__topbar gcl__topbar--${labelPreset.format}`}
          aria-label="Journey stops"
        >
          {JOURNEY_STOPS.map((stop, i) => {
            const revealed = i < revealedCount;
            const presetStop = labelPreset.stops[i];
            return (
              <button
                key={stop.id}
                type="button"
                className={`gcl__topbarItem ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""} ${!revealed ? "is-hidden" : ""}`}
                onClick={() => revealed && setSelectedStop(i)}
                disabled={!revealed}
              >
                <span className="gcl__topbarDot">{i + 1}</span>
                {labelPreset.format === "stacked" ? (
                  <span className="gcl__topbarStack">
                    <span className="gcl__topbarLabel">{presetStop.primary}</span>
                    {presetStop.secondary && (
                      <span className="gcl__topbarSub">{presetStop.secondary}</span>
                    )}
                  </span>
                ) : labelPreset.format === "inline" ? (
                  <span className="gcl__topbarLabel">
                    {presetStop.primary}
                    {presetStop.secondary && (
                      <span className="gcl__topbarDivider"> · </span>
                    )}
                    {presetStop.secondary}
                  </span>
                ) : (
                  <span className="gcl__topbarLabel">{presetStop.primary}</span>
                )}
              </button>
            );
          })}
          <div className="gcl__topbarLine" />
        </nav>

        {/* Globe + card */}
        <div className="gcl__stage">
          <div className="gcl__globe">
            {globeStyle === "wireframe" ? (
              <RotatingEarth
                width={globeSize}
                height={globeSize}
                autoRotate={selectedStop === undefined}
                transparentBg
                frozen
                journeyDots={journeyDots}
                selectedDot={selectedStop}
                journeyArcs={visibleArcs}
                onDotClick={handleDotClick}
              />
            ) : (
              <RealisticGlobe
                key={globeStyle}
                width={globeSize}
                height={globeSize}
                autoRotate={selectedStop === undefined}
                frozen
                visualStyle={globeStyle}
                lonOffset={lonOffset}
                latOffset={latOffset}
                journeyDots={journeyDots}
                selectedDot={selectedStop}
                journeyArcs={visibleArcs}
                onDotClick={handleDotClick}
              />
            )}
          </div>

          <div
            className={`gcl__card gcl__card--${cardPos} ${activeStop ? "is-visible" : ""}`}
          >
            {activeStop ? (
              <>
                <div className="gcl__cardYear">{activeStop.year}</div>
                <h3 className="gcl__cardTitle">{activeStop.title}</h3>
                <p className="gcl__cardDesc">{activeStop.description}</p>
              </>
            ) : (
              <p className="gcl__cardHint">Select a stop to explore</p>
            )}
          </div>
        </div>

        {/* Readout */}
        <div className="gcl__readout">
          <code>
            {view} · {globeStyle} · {globeSize}px · card {cardPos}
            {globeStyle !== "wireframe" && ` · lon ${lonOffset}° · lat ${latOffset}°`}
          </code>
        </div>
      </section>
    </div>
  );
}
