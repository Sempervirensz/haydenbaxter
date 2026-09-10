"use client";

// The comparison shell.
//
// Four things have to be switchable side by side, because those are the four
// axes a navbar direction is actually chosen on:
//
//   concept      eight of them, one press apart
//   width        desktop and phone — as real viewports, not as narrow divs
//   sticky       jump the framed page to a scroll position and watch what the
//                bar does on the way
//   background   the four surfaces the page really produces, including the
//                LIGHT Work Together bars that white ink disappears against
//
// The frame is an <iframe>. A phone-sized div would report the lab window's
// width to every media query inside it and quietly lie about the 390px box;
// an iframe has its own viewport, so the presets are real.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BACKGROUNDS,
  CONCEPTS,
  DEFAULT_CONCEPT,
  NAV_LAB_CHANNEL,
  type ConceptId,
  type LabAnchor,
} from "@/data/navLab";
import "./nav-lab-shell.css";

const STAGE = "/nav-lab/stage";

interface Preset {
  id: string;
  label: string;
  w: number;
  h: number;
}

const DESKTOP_PRESETS: Preset[] = [
  { id: "laptop", label: "Laptop", w: 1280, h: 800 },
  { id: "desktop", label: "Desktop", w: 1512, h: 950 },
  { id: "fhd", label: "FHD", w: 1920, h: 1080 },
];

const MOBILE_PRESETS: Preset[] = [
  { id: "se", label: "Phone SE", w: 375, h: 812 },
  { id: "pro", label: "Phone", w: 402, h: 874 },
  { id: "max", label: "Phone L", w: 430, h: 932 },
  { id: "tablet", label: "Tablet", w: 768, h: 1024 },
];

export default function NavLabShell() {
  const [concept, setConcept] = useState<ConceptId>(DEFAULT_CONCEPT);
  const [desktop, setDesktop] = useState<Preset>(DESKTOP_PRESETS[0]);
  const [mobile, setMobile] = useState<Preset>(MOBILE_PRESETS[1]);
  const [split, setSplit] = useState(true);
  const [hub, setHub] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [stageW, setStageW] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const frames = useRef<Record<string, HTMLIFrameElement | null>>({});

  /* One message goes to every mounted frame, so the desktop and phone views
     never disagree about which concept is on screen. */
  const post = useCallback((action: string, value: unknown) => {
    Object.values(frames.current).forEach((frame) => {
      frame?.contentWindow?.postMessage({ source: NAV_LAB_CHANNEL, action, value }, "*");
    });
  }, []);

  /* A frame that (re)loads has dropped its React state, so the concept has to
     be pushed again or it silently reverts to the default while the control
     still reads as selected. */
  const pushAll = useCallback(() => {
    post("concept", concept);
    post("hub", hub);
  }, [post, concept, hub]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chooseConcept = (id: ConceptId) => {
    setConcept(id);
    post("concept", id);
  };

  const toggleHub = () => {
    setHub((open) => {
      post("hub", !open);
      return !open;
    });
  };

  const jump = (anchor: LabAnchor) => post("jump", anchor);

  const def = CONCEPTS.find((c) => c.id === concept) ?? CONCEPTS[0];

  /* Fit both frames into the stage together, so switching split on and off
     doesn't change what either one is showing. */
  const visible: Preset[] = split ? [desktop, mobile] : [desktop];
  const totalW = visible.reduce((sum, p) => sum + p.w, 0) + (visible.length - 1) * 24;
  const scale = stageW > 0 ? Math.min(1, (stageW - 48) / totalW) : 1;

  const renderFrame = (preset: Preset, role: string) => (
    <div className="nls__slot" key={role}>
      <div
        className="nls__frame"
        style={{
          width: preset.w * scale,
          height: preset.h * scale,
        }}
      >
        <iframe
          key={`${role}:${reloadKey}`}
          ref={(el) => {
            frames.current[role] = el;
          }}
          className="nls__iframe"
          src={STAGE}
          title={`${def.name} at ${preset.w}×${preset.h}`}
          width={preset.w}
          height={preset.h}
          style={{
            width: preset.w,
            height: preset.h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          onLoad={pushAll}
        />
      </div>
      <span className="nls__slotLabel">
        {preset.label} · {preset.w}×{preset.h}
      </span>
    </div>
  );

  return (
    <div className="nls">
      <aside className="nls__panel">
        <div className="nls__brand">
          <span className="nls__brandTitle">Navbar lab</span>
          <span className="nls__brandSub">8 concepts · sticky · CTA hub</span>
        </div>

        <div className="nls__group">
          <span className="nls__groupLabel">Concept</span>
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`nls__opt ${concept === c.id ? "is-on" : ""}`}
              onClick={() => chooseConcept(c.id)}
            >
              <span className="nls__optIndex">{c.index}</span>
              <span className="nls__optName">{c.name}</span>
              {c.condenses && <span className="nls__optMeta">condenses</span>}
              {c.mobile === "bottom" && <span className="nls__optMeta">bottom</span>}
            </button>
          ))}
        </div>

        <div className="nls__group">
          <span className="nls__groupLabel">Scroll to · background</span>
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              className="nls__opt"
              onClick={() => bg.anchor && jump(bg.anchor)}
            >
              <span className="nls__optName">{bg.label}</span>
              <span className="nls__optMeta">{bg.note}</span>
            </button>
          ))}
        </div>

        <div className="nls__group">
          <span className="nls__groupLabel">Desktop width</span>
          <div className="nls__row">
            {DESKTOP_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`nls__btn ${desktop.id === p.id ? "is-on" : ""}`}
                onClick={() => setDesktop(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="nls__group">
          <span className="nls__groupLabel">Mobile width</span>
          <div className="nls__row">
            {MOBILE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`nls__btn ${mobile.id === p.id ? "is-on" : ""}`}
                onClick={() => setMobile(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="nls__group">
          <span className="nls__groupLabel">View</span>
          <div className="nls__row">
            <button
              type="button"
              className={`nls__btn ${split ? "is-on" : ""}`}
              onClick={() => setSplit((s) => !s)}
              aria-pressed={split}
            >
              {split ? "Both" : "Desktop only"}
            </button>
            <button
              type="button"
              className={`nls__btn ${hub ? "is-on" : ""}`}
              onClick={toggleHub}
              aria-pressed={hub}
            >
              CTA hub
            </button>
          </div>
          <div className="nls__row">
            <button
              type="button"
              className="nls__btn"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              ↻ Reload
            </button>
            <Link href={STAGE} className="nls__btn" target="_blank">
              Open full →
            </Link>
          </div>
        </div>

        <div className="nls__group">
          <span className="nls__groupLabel">Notes</span>
          <div className="nls__note">
            <span className="nls__noteName">
              {def.index} · {def.name}
            </span>
            <span className="nls__noteTagline">{def.tagline}</span>
            <span className="nls__noteRow nls__noteRow--strength">
              <span className="nls__noteLabel">Strength</span>
              <span className="nls__noteText">{def.strength}</span>
            </span>
            <span className="nls__noteRow nls__noteRow--risk">
              <span className="nls__noteLabel">Risk</span>
              <span className="nls__noteText">{def.risk}</span>
            </span>
          </div>
        </div>
      </aside>

      <div className="nls__stage" ref={stageRef}>
        <div className="nls__frames">
          {renderFrame(desktop, "desktop")}
          {split && renderFrame(mobile, "mobile")}
        </div>
        <span className="nls__readout">
          {def.name} · {Math.round(scale * 100)}% · scroll inside a frame to test sticky
        </span>
      </div>
    </div>
  );
}
