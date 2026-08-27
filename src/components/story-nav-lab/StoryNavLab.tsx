"use client";

// The lab shell. Every control lives HERE, in the parent document, and the
// simulated page runs inside an <iframe> — so no lab chrome shares a stacking
// context, a colour, or a scrollbar with the thing being judged. The iframe
// also gives the stage a genuine viewport, which is the only way the 390px and
// 360px cases exercise real media queries rather than a scaled-down desktop.
//
// State flows one way: controls → postMessage → stage. The one thing that
// flows back is the section the stage actually scrolled to, so the readout
// cannot claim a section the page is not on.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  COUNTERS,
  DEFAULT_STAGE,
  PAGE_CONTEXTS,
  SCROLLBARS,
  STORY_NAV_CHANNEL,
  STORY_SECTIONS,
  VARIANTS,
  VIEWPORTS,
  type ContextId,
  type CounterId,
  type ScrollbarId,
  type StageState,
  type VariantId,
  type ViewportPreset,
} from "@/data/storyNavLab";
import "./story-nav-lab.css";

const STAGE_SRC = "/story-nav-lab/stage";

export default function StoryNavLab() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<StageState>(DEFAULT_STAGE);
  const [viewport, setViewport] = useState<ViewportPreset>(VIEWPORTS[0]);
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(1);
  // 0 = the page is outside the story, so no section is active. The stage
  // reports this; the lab never assumes it.
  const [liveSection, setLiveSection] = useState(0);

  const push = useCallback((next: StageState) => {
    frameRef.current?.contentWindow?.postMessage(
      { source: STORY_NAV_CHANNEL, action: "state", value: next },
      "*"
    );
  }, []);

  const update = useCallback(
    (patch: Partial<StageState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        push(next);
        return next;
      });
    },
    [push]
  );

  // A reload inside the frame drops its React state, so it announces itself and
  // we re-push. Without this the frame silently reverts to defaults while the
  // controls still read as set.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== STORY_NAV_CHANNEL) return;
      if (data.action === "ready") push(state);
      if (data.action === "section") setLiveSection(data.value as number);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [push, state]);

  // Fit-to-window scaling, so 1440×900 is viewable on a laptop panel.
  useEffect(() => {
    if (!fit) {
      setScale(1);
      return;
    }
    const el = stageWrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(1, r.width / viewport.w, r.height / viewport.h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit, viewport]);

  const activeVariant = VARIANTS.find((v) => v.id === state.variant)!;
  const activeCounter = COUNTERS.find((c) => c.id === state.counter)!;
  const activeScrollbar = SCROLLBARS.find((s) => s.id === state.scrollbar)!;
  const activeContext = PAGE_CONTEXTS.find((c) => c.id === state.context)!;

  return (
    <div className="snlab">
      <header className="snlab__head">
        <div>
          <h1 className="snlab__title">Story Navigation Lab</h1>
          <p className="snlab__sub">
            Orientation and movement inside the four Work chapters — for readers who
            entered the story, not the ones who skipped ahead. Comparison only; nothing
            here is wired into production.
          </p>
        </div>
        <span className="snlab__badge">Local only · /story-nav-lab</span>
      </header>

      <div className="snlab__grid">
        {/* ── Controls ─────────────────────────────────────────────────── */}
        <aside className="snlab__panel" aria-label="Lab controls">
          <Group label="Page context">
            <div className="snlab__stack">
              {PAGE_CONTEXTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`snlab__row ${state.context === c.id ? "is-on" : ""}`}
                  aria-pressed={state.context === c.id}
                  onClick={() => update({ context: c.id as ContextId })}
                >
                  <span className="snlab__rowLabel">{c.label}</span>
                  <span className="snlab__rowNote">{c.note}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group label="Viewport">
            <div className="snlab__chips">
              {VIEWPORTS.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  className={`snlab__chip ${viewport.label === v.label ? "is-on" : ""}`}
                  aria-pressed={viewport.label === v.label}
                  onClick={() => setViewport(v)}
                >
                  {v.label}
                  <span className="snlab__chipDim">
                    {v.w}×{v.h}
                  </span>
                </button>
              ))}
            </div>
            <label className="snlab__check">
              <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
              Fit to window {fit && scale < 1 && <em>({Math.round(scale * 100)}%)</em>}
            </label>
          </Group>

          <Group label={`Navigation concept — ${VARIANTS.length} variants`}>
            <div className="snlab__stack">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`snlab__row ${state.variant === v.id ? "is-on" : ""}`}
                  aria-pressed={state.variant === v.id}
                  onClick={() => update({ variant: v.id as VariantId })}
                >
                  <span className="snlab__rowLabel">
                    <span className="snlab__idx">{v.index}</span>
                    {v.label}
                    {v.hybrid && <span className="snlab__pill">hybrid</span>}
                    <span className={`snlab__pill snlab__pill--${v.aimedAt}`}>{v.aimedAt}</span>
                  </span>
                  <span className="snlab__rowNote">{v.note}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group label="Counter treatment">
            <div className="snlab__stack">
              {COUNTERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`snlab__row ${state.counter === c.id ? "is-on" : ""}`}
                  aria-pressed={state.counter === c.id}
                  onClick={() => update({ counter: c.id as CounterId })}
                >
                  <span className="snlab__rowLabel">
                    <span className="snlab__idx">{c.index}</span>
                    {c.label}
                  </span>
                  <span className="snlab__rowNote">{c.note}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group label="Scrollbar treatment">
            <div className="snlab__stack">
              {SCROLLBARS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`snlab__row ${state.scrollbar === s.id ? "is-on" : ""}`}
                  aria-pressed={state.scrollbar === s.id}
                  onClick={() => update({ scrollbar: s.id as ScrollbarId })}
                >
                  <span className="snlab__rowLabel">
                    <span className="snlab__idx">{s.index}</span>
                    {s.label}
                  </span>
                  <span className="snlab__rowNote">{s.note}</span>
                </button>
              ))}
            </div>
            <p className="snlab__support">
              <strong>Browser support · {activeScrollbar.label}</strong>
              {activeScrollbar.support}
            </p>
          </Group>

          <Group label="State">
            <div className="snlab__chips">
              {STORY_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`snlab__chip ${liveSection === s.id ? "is-on" : ""}`}
                  aria-pressed={liveSection === s.id}
                  onClick={() => update({ context: `ch${s.id}` as ContextId })}
                >
                  {s.num}
                  <span className="snlab__chipDim">{s.name}</span>
                </button>
              ))}
            </div>
            <label className="snlab__check">
              <input
                type="checkbox"
                checked={state.expanded}
                onChange={(e) => update({ expanded: e.target.checked })}
              />
              Mobile nav expanded
            </label>
            <label className="snlab__check">
              <input
                type="checkbox"
                checked={state.reducedMotion}
                onChange={(e) => update({ reducedMotion: e.target.checked })}
              />
              Simulate reduced motion
            </label>
            <label className="snlab__check">
              <input
                type="checkbox"
                checked={state.useHash}
                onChange={(e) => update({ useHash: e.target.checked })}
              />
              Write #hash on navigate
              <span className="snlab__hint">
                Off by default. replaceState, never pushState — a spine click should not
                cost the reader four Back presses to leave the story.
              </span>
            </label>
          </Group>
        </aside>

        {/* ── Stage ────────────────────────────────────────────────────── */}
        <main className="snlab__stageCol">
          <div className="snlab__readout" role="status">
            <span>
              <b>{activeContext.label}</b> · {viewport.w}×{viewport.h}
            </span>
            <span>
              <span className="snlab__idx">{activeVariant.index}</span>
              {activeVariant.label}
            </span>
            <span>Counter: {activeCounter.label}</span>
            <span>Scrollbar: {activeScrollbar.label}</span>
            <span className="snlab__live">
              {liveSection
                ? <>On the real page: <b>{STORY_SECTIONS.find((s) => s.id === liveSection)?.name}</b></>
                : <>Navigator not shown — outside the story</>}
            </span>
          </div>

          <div className="snlab__stageWrap" ref={stageWrapRef}>
            {/* Two boxes, because a scaled element still occupies its UNSCALED
                size in layout. The outer box carries the post-scale dimensions
                so centring and overflow are correct; the inner one is the real
                viewport the iframe gets. */}
            <div
              className="snlab__frameBox"
              style={{
                width: Math.round(viewport.w * scale),
                height: Math.round(viewport.h * scale),
              }}
            >
              <div
                className="snlab__frame"
                style={{
                  width: viewport.w,
                  height: viewport.h,
                  transform: `scale(${scale})`,
                }}
              >
                <iframe
                  ref={frameRef}
                  src={STAGE_SRC}
                  title="Story navigation stage"
                  width={viewport.w}
                  height={viewport.h}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="snlab__group">
      <h2 className="snlab__groupLabel">{label}</h2>
      {children}
    </section>
  );
}
