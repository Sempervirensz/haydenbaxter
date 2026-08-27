"use client";

/* Mobile scroll lab HUD. Mounted only under `npm run dev`, and only when the
 * URL carries `?disc=` — see disc-scroll-probe.ts for what the three arms are
 * and why the question needs a real device to answer.
 *
 * Read on the phone, in this order:
 *
 *   1. `gate` must say ON. The freeze is gated on pointer type, not width, so a
 *      narrow desktop window reports OFF and every number below it is about a
 *      device that was never frozen in the first place.
 *   2. Take each arm through the same flick: land on Work, momentum-scroll the
 *      four chapters, stop. The frame sampler only counts frames while a scroll
 *      is actually in flight, so idle time does not pad the average.
 *   3. Compare `cached` against `off`. That difference is the entire decision.
 *      `rect` is there to show what the naive flip would have cost.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DiscMode,
  type DiscStats,
  listenForDiscMessages,
  readDiscMode,
  readDiscStats,
  recordFrameDelta,
  recordLongTask,
  resetDiscStats,
  setDiscMode,
  subscribeDiscMode,
} from "./disc-scroll-probe";
import { NATIVE_STYLE_ID, nativeDiscCss, supportsNativeTimeline } from "./disc-techniques";
import { DISC_TECHNIQUES, techniqueDef } from "./disc-technique-catalog";
import { WORK_SCROLL_CONFIG } from "@/data/work";
import "./mobile-scroll-lab.css";

const PHONE_GATE =
  "(max-width: 640px) and (hover: none), (max-width: 640px) and (pointer: coarse)";

/* A frame only counts if a scroll was in flight this recently. Long enough to
   cover iOS momentum between scroll events, short enough that parking the page
   does not backfill the histogram with free 16ms frames. */
const SCROLL_WINDOW_MS = 200;

function fmt(n: number, dp = 1) {
  return n.toFixed(dp);
}

export default function MobileScrollProbe() {
  const [armed, setArmed] = useState(false);
  const [mode, setMode] = useState<DiscMode>("off");
  const [gate, setGate] = useState(false);
  const [env, setEnv] = useState("");
  const [stats, setStats] = useState<DiscStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [nativeOk, setNativeOk] = useState(true);
  /* Framed by /mobile-scroll-lab, the outer page owns the technique picker and
     the explanation. Repeating them here costs a third of a 390px viewport —
     of the very thing being looked at. Embedded, the HUD is numbers only. */
  const [embedded, setEmbedded] = useState(false);
  const scrolling = useRef(false);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("disc")) return;
    setArmed(true);
    setMode(readDiscMode());
    setNativeOk(supportsNativeTimeline());
    try {
      setEmbedded(window.self !== window.top);
    } catch {
      setEmbedded(true); // Cross-origin frame: still a frame.
    }

    const mq = window.matchMedia(PHONE_GATE);
    /* Re-read on resize, not once on mount: a phone's innerHeight changes when
       the URL bar collapses mid-scroll, and the value is worth nothing in a
       bug report if it describes the viewport before that happened. */
    const onGate = () => {
      setGate(mq.matches);
      setEnv(
        `${window.innerWidth}x${window.innerHeight} dpr${window.devicePixelRatio} ` +
          `${window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine"}/` +
          `${window.matchMedia("(hover: hover)").matches ? "hover" : "no-hover"}`
      );
    };
    onGate();
    mq.addEventListener("change", onGate);
    window.addEventListener("resize", onGate);

    return () => {
      mq.removeEventListener("change", onGate);
      window.removeEventListener("resize", onGate);
    };
  }, []);

  useEffect(() => subscribeDiscMode(() => setMode(readDiscMode())), []);

  /* Driven from outside when this page is framed by /mobile-scroll-lab. */
  useEffect(() => listenForDiscMessages(), []);

  /* Frame sampler. Deliberately outside the work-scroll loop so the `off` arm
     — where that loop never starts — still produces a baseline cadence. */
  useEffect(() => {
    if (!armed) return;

    let raf = 0;
    let prev = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      if (!scrolling.current) {
        scrolling.current = true;
        // Drop the first delta of a burst: it spans idle time, not scroll time.
        prev = 0;
      }
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => {
        scrolling.current = false;
      }, SCROLL_WINDOW_MS);
    };

    const loop = () => {
      const now = performance.now();
      if (scrolling.current) {
        if (prev) recordFrameDelta(now - prev);
        prev = now;
      } else {
        prev = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("scroll", onScroll, { passive: true });

    let po: PerformanceObserver | undefined;
    try {
      po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) recordLongTask(e.duration);
      });
      po.observe({ entryTypes: ["longtask"] });
    } catch {
      // Safari has no longtask entry type. The frame histogram covers it.
    }

    const readout = window.setInterval(() => setStats(readDiscStats()), 500);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      if (idle) clearTimeout(idle);
      po?.disconnect();
      window.clearInterval(readout);
    };
  }, [armed]);

  const report = useCallback(() => {
    if (!stats) return "";
    return [
      `DISC ARM: ${mode}  gate ${gate ? "ON" : "OFF (not a phone)"}  ${env}`,
      `scroll frames ${stats.frames} over ${Math.round(stats.spanMs)}ms`,
      `  fps ${fmt(stats.fps)}  p95 ${stats.frameP95}ms  worst ${Math.round(stats.frameMax)}ms`,
      `  janky >16.7ms ${stats.over16} (${stats.frames ? Math.round((stats.over16 / stats.frames) * 100) : 0}%)  dropped >33ms ${stats.over33}`,
      stats.reads
        ? `  geometry read: net ${fmt(stats.readMean, 3)}ms/tick  worst ${fmt(stats.readMax, 2)}ms  over ${stats.reads} ticks (clock floor ${fmt(stats.readFloor, 3)}ms)`
        : `  geometry read: none — loop not running (baseline arm)`,
      `  long tasks ${stats.longTasks}  worst ${Math.round(stats.longMax)}ms`,
    ].join("\n");
  }, [stats, mode, gate, env]);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(report()).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      },
      () => setCopied(false)
    );
  }, [report]);

  if (!armed) return null;

  const jankPct = stats && stats.frames ? (stats.over16 / stats.frames) * 100 : 0;

  return (
    <div className={`disc-probe ${embedded ? "is-embedded" : ""}`} role="status" aria-live="polite">
      {!embedded && (
      <div className="disc-probe__arms" role="group" aria-label="Disc scroll arm">
        {DISC_TECHNIQUES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={mode === t.id}
            className={mode === t.id ? "is-on" : ""}
            onClick={() => setDiscMode(t.id)}
            title={t.note}
          >
            {t.label}
          </button>
        ))}
        <button type="button" onClick={() => { resetDiscStats(); setStats(readDiscStats()); }}>
          reset
        </button>
      </div>
      )}

      <div className={`disc-probe__gate ${gate ? "" : "disc-probe__bad"}`}>
        {embedded && <b className="disc-probe__armTag">{mode}</b>} gate{" "}
        {gate ? "ON" : "OFF — pointer is fine, this is not the frozen case"} · {env}
      </div>

      {!embedded && <div className="disc-probe__note">{techniqueDef(mode).note}</div>}

      {mode === "native" && !nativeOk && (
        <div className="disc-probe__bad">
          this browser has no view-timeline — the disc will not turn in this arm
        </div>
      )}

      {/* The native arm IS this stylesheet: no JS runs for it, so mounting the
          rule is the whole implementation. Unmounting with the arm is what
          keeps it from composing on top of the JS arms' transform. */}
      {mode === "native" && nativeOk && (
        <style
          id={NATIVE_STYLE_ID}
          dangerouslySetInnerHTML={{
            __html: nativeDiscCss(WORK_SCROLL_CONFIG.zones, WORK_SCROLL_CONFIG.screenBreaks[1]),
          }}
        />
      )}

      {!stats || stats.frames === 0 ? (
        <b>scroll through Work to sample…</b>
      ) : (
        <>
          <div className="disc-probe__top">
            <b>{fmt(stats.fps)} fps</b>
            <span>p95 <em>{stats.frameP95}ms</em></span>
            <span>worst <em>{Math.round(stats.frameMax)}ms</em></span>
            <span>frames <em>{stats.frames}</em></span>
          </div>
          <div className="disc-probe__row">
            <span className={jankPct > 10 ? "disc-probe__bad" : ""}>
              janky <em>{Math.round(jankPct)}%</em>
            </span>
            <span className={stats.over33 > 0 ? "disc-probe__bad" : ""}>
              dropped <em>{stats.over33}</em>
            </span>
            <span>long tasks <em>{stats.longTasks}</em></span>
          </div>
          <div className="disc-probe__row">
            {stats.reads ? (
              <>
                <span>
                  geometry read <em>{fmt(stats.readMean, 3)}ms</em>/tick
                </span>
                <span className="disc-probe__muted">
                  {stats.reads} ticks · floor {fmt(stats.readFloor, 3)}ms
                </span>
              </>
            ) : (
              <span className="disc-probe__muted">baseline arm — loop not running</span>
            )}
          </div>
          <button type="button" className="disc-probe__copy" onClick={copy}>
            {copied ? "copied" : "Copy all"}
          </button>
        </>
      )}
    </div>
  );
}
