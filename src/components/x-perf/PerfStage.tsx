"use client";

/* A faithful copy of the entry screen, with one variable changed per variant,
 * plus a self-measuring readout.
 *
 * It measures ITSELF rather than asking you to open devtools on a phone, and it
 * runs three times because a cellular connection can vary by seconds between
 * identical loads. The median is what you read; the spread tells you whether to
 * believe it.
 */

import { useEffect, useState } from "react";
import { CARDS } from "@/data/cards";
import { PERF_VARIANTS } from "@/data/perfLab";

const RUNS = 3;
const KEY = "hb:perf";

interface Run { kb: number; reqs: number; fcp: number; load: number; cards: number }

function median(ns: number[]) {
  const s = [...ns].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2);
}

export default function PerfStage({ variant }: { variant: string }) {
  const v = PERF_VARIANTS.find((x) => x.id === variant) ?? PERF_VARIANTS[0];

  /* Cache-bust every image on every run.
   *
   * The first version of this only busted the HTML URL, so runs 2 and 3 served
   * images straight from cache: encodedBodySize reported 0 KB and the "load"
   * figure was a warm-cache number (161ms) that had nothing to do with the
   * problem being investigated. Taking a median across [cold, warm, warm]
   * produced a warm answer.
   *
   * The token is derived from the run index in the URL, so it is stable within
   * a run and different between runs. Fonts/CSS/JS still warm after run 1 —
   * they are identical across variants, so variant-to-variant COMPARISON stays
   * valid even though the absolute number flatters slightly. */
  const [cb] = useState(() => {
    if (typeof window === "undefined") return "0";
    return new URLSearchParams(location.search).get("t") || "0";
  });
  const bust = (url: string) => `${url}?cb=${cb}`;
  const [runs, setRuns] = useState<Run[]>([]);
  const [done, setDone] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const showFaces = v.id !== "defer-faces" && v.id !== "lean-cards" && v.id !== "floor";
  const smallBacks = v.id === "small-backs" || v.id === "lean-cards";
  const noImages = v.id === "floor";

  useEffect(() => {
    const t = window.setTimeout(() => {
      // Time until the last card image has actually painted.
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".pl-card img"));
      const cardsAt = imgs.length
        ? Math.max(...imgs.map((i) => {
            const e = performance.getEntriesByName(i.currentSrc)[0] as PerformanceResourceTiming | undefined;
            return e ? Math.round(e.responseEnd) : 0;
          }))
        : 0;
      let kb = 0, reqs = 0;
      for (const e of performance.getEntriesByType("resource") as PerformanceResourceTiming[]) {
        kb += e.encodedBodySize || 0; reqs++;
      }
      const paint = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const run: Run = {
        kb: Math.round(kb / 1024), reqs,
        fcp: Math.round(paint?.startTime ?? 0),
        load: Math.round(nav?.loadEventEnd ?? 0),
        cards: cardsAt,
      };
      let prev: Run[] = [];
      try { prev = JSON.parse(sessionStorage.getItem(KEY + ":" + v.id) || "[]"); } catch {}
      const all = [...prev, run];
      try { sessionStorage.setItem(KEY + ":" + v.id, JSON.stringify(all)); } catch {}
      setRuns(all);
      if (all.length < RUNS) {
        // Cache-bust so run 2 and 3 are not artificially fast.
        window.location.replace(`${location.pathname}?r=${all.length}&t=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
      } else {
        setDone(true);
      }
    }, 1200);
    return () => window.clearTimeout(t);
  }, [v.id]);

  const summary = done
    ? { kb: median(runs.map(r => r.kb)), fcp: median(runs.map(r => r.fcp)),
        load: median(runs.map(r => r.load)), cards: median(runs.map(r => r.cards)),
        reqs: median(runs.map(r => r.reqs)) }
    : null;

  const copy = () => {
    if (!summary) return;
    const spread = Math.max(...runs.map(r => r.load)) - Math.min(...runs.map(r => r.load));
    const text = `${v.id}: load ${summary.load}ms | FCP ${summary.fcp}ms | cards ${summary.cards}ms | ${summary.kb}KB | ${summary.reqs} reqs | spread ${spread}ms (${RUNS} runs)`;
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="pl">
      <div className="pl-stage">
        <p className="pl-eyebrow">View the work, the supply chain background, and where WorldPulse fits in.</p>
        <h1 className="pl-h1">
          I help orgs put AI to work, strengthen global supply chains, and innovate where
          sustainability meets next-gen tech.
        </h1>

        <div className="pl-deck">
          {CARDS.map((c) => (
            <button
              key={c.id}
              className={`pl-card ${flipped ? "is-flipped" : ""}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label={`${c.title} — flip card`}
            >
              <span className="pl-card__inner">
                <span className="pl-card__face pl-card__front">
                  {!noImages && (
                    <img
                      src={bust(
                        (c.backVariant === "red"
                          ? "/images/cards/playing-card-back-red"
                          : "/images/cards/playing-card-back-blue") +
                        (smallBacks ? "-sm.webp" : ".webp")
                      )}
                      alt=""
                      width={smallBacks ? 260 : 560}
                      height={smallBacks ? 388 : 835}
                    />
                  )}
                </span>
                <span className="pl-card__face pl-card__back">
                  {!noImages && (showFaces || flipped) && (
                    <img src={bust(c.faceImage)} alt="" loading={showFaces ? undefined : "lazy"} />
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="pl-guide">Flip the four cards to continue in Story Mode.</p>
      </div>

      <div className="pl-readout" role="status" aria-live="polite">
        <p className="pl-readout__title">{v.title}</p>
        {!done ? (
          <p className="pl-readout__wait">
            Run {runs.length + 1} of {RUNS} — the page reloads itself between runs. Don&apos;t touch anything.
          </p>
        ) : (
          <>
            <dl className="pl-nums">
              <div><dt>Fully loaded</dt><dd>{summary!.load} ms</dd></div>
              <div><dt>First paint</dt><dd>{summary!.fcp} ms</dd></div>
              <div><dt>Cards visible</dt><dd>{summary!.cards} ms</dd></div>
              <div><dt>Downloaded</dt><dd>{summary!.kb} KB</dd></div>
              <div><dt>Requests</dt><dd>{summary!.reqs}</dd></div>
              <div><dt>Spread</dt><dd>{Math.max(...runs.map(r=>r.load)) - Math.min(...runs.map(r=>r.load))} ms</dd></div>
            </dl>
            {summary!.kb < 50 ? (
              <p className="pl-readout__warn">
                Under 50 KB measured — this was served from cache, so the timings are
                meaningless. Close the tab, open a fresh private one, and run it again.
              </p>
            ) : (
              <p className="pl-readout__note">
                Median of {RUNS} runs. If the spread is large, the connection moved — run it again.
              </p>
            )}
            <div className="pl-actions">
              <button className="pl-btn" onClick={copy}>Copy result</button>
              <a className="pl-btn pl-btn--ghost" href="/x-perf">All variants</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
