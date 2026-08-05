"use client";

// Hero headline type lab — five iterations of size + measure against the real
// hero markup, with a live readout of what each one actually renders.
//
// The variant is mirrored into `?v=` so this route can be framed by the
// Responsive Viewer at a genuine 3440 or 3840 and still land on the variant you
// were looking at. An <iframe> carries its own viewport, which is the only way
// to see true ultrawide behaviour without the panel.
//
// `useSearchParams` is deliberately not used: under `output: "export"` it forces
// a Suspense boundary on the route, and reading `location.search` once on mount
// does the same job here without that.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE_CONTENT } from "@/data/siteContent";
import {
  DEFAULT_VARIANT,
  HERO_VARIANTS,
  isHeroVariant,
  type HeroVariantId,
} from "@/data/heroTypeLab";
import "./hero-type-lab.css";

interface Readout {
  vw: number;
  fontPx: number;
  boxPx: number;
  pctOfViewport: number;
  lineCount: number;
  lastLineWords: number;
}

/** Group the heading's per-character rects into lines by rounded top edge.
 *  Counting <br>-free wrapped lines has no DOM API; the rects are the only
 *  honest source, and this is the same method used to measure the live site. */
function measureHeading(el: HTMLElement): Readout | null {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;

  const text = node.textContent ?? "";
  const range = document.createRange();
  const lines = new Map<number, string>();

  for (let i = 0; i < text.length; i++) {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;
    const key = Math.round(rect.top);
    lines.set(key, (lines.get(key) ?? "") + text[i]);
  }

  const ordered = [...lines.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, line]) => line.trim())
    .filter(Boolean);

  const box = el.getBoundingClientRect();
  const last = ordered[ordered.length - 1] ?? "";

  return {
    vw: window.innerWidth,
    fontPx: Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10,
    boxPx: Math.round(box.width),
    pctOfViewport: Math.round((box.width / window.innerWidth) * 100),
    lineCount: ordered.length,
    lastLineWords: last ? last.split(/\s+/).length : 0,
  };
}

export default function HeroTypeLab() {
  const { hero } = SITE_CONTENT;
  const [variant, setVariant] = useState<HeroVariantId>(DEFAULT_VARIANT);
  const [readout, setReadout] = useState<Readout | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Adopt ?v= on mount so a framed instance opens on the right variant.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("v");
    if (isHeroVariant(fromUrl)) setVariant(fromUrl);
  }, []);

  const remeasure = useCallback(() => {
    const el = headingRef.current;
    if (el) setReadout(measureHeading(el));
  }, []);

  // Fonts decide the wrap, so a measurement taken before the display serif
  // loads describes the fallback and nothing else.
  useEffect(() => {
    let alive = true;
    const run = () => alive && remeasure();

    run();
    document.fonts?.ready.then(run);

    const ro = new ResizeObserver(run);
    if (headingRef.current) ro.observe(headingRef.current);
    window.addEventListener("resize", run);

    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [remeasure, variant]);

  const select = useCallback((id: HeroVariantId) => {
    setVariant(id);
    const url = new URL(window.location.href);
    url.searchParams.set("v", id);
    window.history.replaceState(null, "", url);
  }, []);

  const active = HERO_VARIANTS.find((v) => v.id === variant) ?? HERO_VARIANTS[0];

  return (
    <div className="hvlab" data-hv={variant}>
      <div className="hvlab__stage">
        {/* Production markup and class names verbatim, so what is being judged
            is the real element rather than a replica that can drift. */}
        <div className="hero-copy flex flex-col items-center justify-center text-center">
          <p className="hero-eyebrow" style={{ fontFamily: "var(--font-sans)" }}>
            {hero.eyebrow}
          </p>
          <h1
            ref={headingRef}
            className="hero-heading font-normal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {hero.heading}
          </h1>
        </div>
        <div className="hvlab__spacer" />
      </div>

      <div className="hvlab__panel">
        <div className="hvlab__group">
          {HERO_VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              className="hvlab__btn"
              aria-pressed={v.id === variant}
              onClick={() => select(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="hvlab__sep" aria-hidden="true" />

        <p className="hvlab__note">
          {active.note} <b>{active.ramp}</b> · {active.measure}
        </p>

        <div className="hvlab__sep" aria-hidden="true" />

        <div className="hvlab__readout" aria-live="polite">
          {readout ? (
            <>
              <span>
                viewport <b>{readout.vw}</b>
              </span>
              <span>
                size <b>{readout.fontPx}px</b>
              </span>
              <span>
                line box <b>{readout.boxPx}px</b> ({readout.pctOfViewport}%)
              </span>
              <span>
                lines <b>{readout.lineCount}</b>
              </span>
              <span>
                last line <b>{readout.lastLineWords}w</b>
              </span>
            </>
          ) : (
            <span>measuring…</span>
          )}
        </div>

        <div className="hvlab__sep" aria-hidden="true" />

        <Link href="/site-parallax-lab/work-cinema/viewer" className="hvlab__btn">
          Responsive Viewer ↗
        </Link>
      </div>
    </div>
  );
}
