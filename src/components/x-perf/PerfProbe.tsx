"use client";

/* Timing readout for the REAL homepage, mounted only when ?perf=1 is present.
 *
 * The lab renders a simplified copy of the entry screen, and on a real iPhone
 * it loaded in 179ms — far too light to reproduce the ~26s the owner sees. That
 * is the lab's documented failure case: if the cause lives in the full page
 * (hydration, the gate, anything below the fold), a stripped copy cannot show
 * it. This measures the actual page instead.
 *
 * Inert without the query param: no markup, no listeners, no cost. */

import { useEffect, useState } from "react";

export default function PerfProbe() {
  const [m, setM] = useState<null | {
    load: number; fcp: number; dcl: number; reqs: number; kb: number; slowest: string;
  }>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!new URLSearchParams(location.search).has("perf")) return;
    const t = window.setTimeout(() => {
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      let kb = 0;
      let slowest = { name: "", ms: 0 };
      for (const e of res) {
        kb += e.encodedBodySize || 0;
        const ms = Math.round(e.responseEnd - e.startTime);
        if (ms > slowest.ms) slowest = { name: e.name.split("/").pop()?.split("?")[0] || "", ms };
      }
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
      setM({
        load: Math.round(nav?.loadEventEnd ?? 0),
        fcp: Math.round(paint?.startTime ?? 0),
        dcl: Math.round(nav?.domContentLoadedEventEnd ?? 0),
        reqs: res.length,
        kb: Math.round(kb / 1024),
        slowest: slowest.name ? `${slowest.name} (${slowest.ms}ms)` : "—",
      });
    }, 2500);
    return () => window.clearTimeout(t);
  }, []);

  if (!m) return null;

  const copy = () =>
    navigator.clipboard?.writeText(
      `REAL homepage: load ${m.load}ms | FCP ${m.fcp}ms | DCL ${m.dcl}ms | ${m.reqs} reqs | ${m.kb}KB | slowest: ${m.slowest}`
    );

  return (
    <div className="perf-probe" role="status" aria-live="polite">
      <b>Real homepage</b>
      <span>fully loaded <em>{m.load} ms</em></span>
      <span>first paint <em>{m.fcp} ms</em></span>
      <span>interactive <em>{m.dcl} ms</em></span>
      <span>requests <em>{m.reqs}</em></span>
      <span>slowest <em>{m.slowest}</em></span>
      <button onClick={copy}>Copy</button>
    </div>
  );
}
