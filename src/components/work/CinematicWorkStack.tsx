"use client";

// Cinematic Work Stack — standalone presentation of the four Work projects as
// full-bleed cinematic cards with a depth handoff. This is the LAB/standalone
// view: it owns the control dock, intro/outro, and the Responsive Viewer
// postMessage bridge. The card content + parallax engine are shared with the
// merged Work section (WorkSectionCinematic) via CinematicCardBody +
// useCinematicParallax, so the two never diverge.
//
// The optional `lab` prop shows the lab chrome; without it the stack renders
// clean (used by the Responsive Viewer iframe).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCinematicParallax } from "@/hooks/useCinematicParallax";
import CinematicCardBody, { CINEMATIC_CARDS } from "@/components/work/CinematicCardBody";
import "@/components/work/cinematic-work-stack.css";

export default function CinematicWorkStack({ lab = false }: { lab?: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const intensityRef = useRef(1);
  const motionRef = useRef(true);

  const [intensity, setIntensity] = useState(1);
  const [motionOn, setMotionOn] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [peek, setPeek] = useState(false);

  intensityRef.current = intensity;
  motionRef.current = motionOn;

  // Shared parallax/handoff engine, gated by the dock's intensity + motion.
  useCinematicParallax(rootRef, () => (motionRef.current ? intensityRef.current : 0));

  // Most-visible card → drives Supply Chain / Consulting reveal (standalone has
  // no useWorkScroll, so it derives "active" from an IntersectionObserver).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ratios = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = Number((e.target as HTMLElement).dataset.cstackId);
          ratios.set(id, e.intersectionRatio);
        }
        let best: number | null = null;
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });
        if (best !== null && bestRatio > 0.2) setActiveId(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    root.querySelectorAll("[data-cstack-chapter]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // Responsive Viewer control bridge (lab only). Also hides the dock when this
  // is embedded in the viewer iframe.
  const [embedded, setEmbedded] = useState(false);
  useEffect(() => {
    setEmbedded(window.self !== window.top);
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== "cstack-ctl") return;
      if (d.action === "motion") setMotionOn(!!d.value);
      else if (d.action === "intensity") setIntensity(Number(d.value));
      else if (d.action === "peek") {
        setPeek(!!d.value);
        if (d.value) {
          document.querySelector('[data-cstack-id="1"]')?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div ref={rootRef} className="cstack">
      {lab && !embedded && (
        <aside className="cstack__dock">
          <span className="cstack__dockTitle">Cinematic Work Stack</span>
          <label className="cstack__dial">
            <span className="cstack__dialMeta">
              <span>Intensity</span>
              <span>{Math.round(intensity * 100)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            className={`cstack__toggle ${motionOn ? "is-on" : ""}`}
            onClick={() => setMotionOn((m) => !m)}
            aria-pressed={motionOn}
          >
            Motion {motionOn ? "on" : "off"}
          </button>
          <Link href="/site-parallax-lab/work-cinema/viewer" className="cstack__toggle">
            ⤢ Responsive view
          </Link>
          <Link href="/site-parallax-lab/work-handoff" className="cstack__toggle">
            ← Handoff lab
          </Link>
        </aside>
      )}

      {lab && (
        <header className="cstack__intro">
          <p className="cstack__kicker">PLX 04 · Cinematic stack</p>
          <h1 className="cstack__title">Work, in full bleed</h1>
          <p className="cstack__lede">
            All four Work chapters as borderless cinematic cards. Each pins, then
            sinks and dims as the next slides over it.
          </p>
          <span className="cstack__hint" aria-hidden="true">Scroll ↓</span>
        </header>
      )}

      {CINEMATIC_CARDS.map((card, idx) => (
        <div
          key={card.id}
          className="cstack__chapter"
          data-cstack-chapter
          data-cstack-id={card.id}
          style={{ zIndex: idx + 1 }}
        >
          <article className={`cstack__card cstack__card--${card.id} cstack__card--${card.kind}`}>
            <CinematicCardBody
              card={card}
              isActive={activeId === card.id}
              peek={peek}
              onTogglePeek={() => setPeek((p) => !p)}
            />
          </article>
        </div>
      ))}

      {lab && (
        <footer className="cstack__outro">
          <p>End of stack — four chapters, one cinematic frame.</p>
        </footer>
      )}
    </div>
  );
}
