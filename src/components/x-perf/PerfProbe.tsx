"use client";

/* Diagnostic readout for the REAL homepage. Mounted only when ?perf=1 is set.
 *
 * Built after four rounds of remote guessing failed. Every instrument available
 * locally reports this page loading in under a second — bytes, bandwidth
 * throttling, CPU throttling and cache headers have all been measured and ruled
 * out — while the owner sees ~26s on a physical iPhone. The lab at /x-perf
 * loads in 179ms on that same phone, so whatever costs 26 seconds lives in the
 * full page and not in a simplified copy of it.
 *
 * So this stops summarising and starts naming: the slowest individual requests,
 * with their connection phases, measured where the problem actually happens.
 * Inert without the query param. */

import { useEffect, useState } from "react";

interface Row { name: string; ms: number; wait: number; dl: number; from: string }
interface Snap {
  load: number; fcp: number; dcl: number; reqs: number; pending: number;
  dns: number; tcp: number; tls: number; ttfb: number; slowest: Row[];
}

export default function PerfProbe() {
  const [s, setS] = useState<Snap | null>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!new URLSearchParams(location.search).has("perf")) return;

    const start = performance.now();
    const tick = window.setInterval(() => setT(Math.round((performance.now() - start) / 100) / 10), 200);

    const snap = () => {
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
      const rows: Row[] = res
        .map((e) => ({
          name: (e.name.split("/").pop() || e.name).split("?")[0].slice(0, 26),
          ms: Math.round(e.responseEnd - e.startTime),
          // Time spent waiting before a single byte arrived — the signature of a
          // stall, as distinct from a slow download.
          wait: Math.round((e.responseStart || e.responseEnd) - e.startTime),
          dl: Math.round(e.responseEnd - (e.responseStart || e.responseEnd)),
          from: new URL(e.name).hostname.replace("www.haydenbaxter.com", "self"),
        }))
        .sort((a, b) => b.ms - a.ms)
        .slice(0, 6);
      setS({
        load: Math.round(nav?.loadEventEnd ?? 0),
        fcp: Math.round(paint?.startTime ?? 0),
        dcl: Math.round(nav?.domContentLoadedEventEnd ?? 0),
        reqs: res.length,
        pending: performance.getEntriesByType("resource").filter((e) => (e as PerformanceResourceTiming).responseEnd === 0).length,
        dns: Math.round((nav?.domainLookupEnd ?? 0) - (nav?.domainLookupStart ?? 0)),
        tcp: Math.round((nav?.connectEnd ?? 0) - (nav?.connectStart ?? 0)),
        tls: nav?.secureConnectionStart ? Math.round(nav.connectEnd - nav.secureConnectionStart) : 0,
        ttfb: Math.round((nav?.responseStart ?? 0) - (nav?.requestStart ?? 0)),
        slowest: rows,
      });
    };

    // Sample early and late: a stall shows as the numbers still climbing.
    const a = window.setTimeout(snap, 3000);
    const b = window.setTimeout(() => { snap(); window.clearInterval(tick); }, 12000);
    return () => { window.clearTimeout(a); window.clearTimeout(b); window.clearInterval(tick); };
  }, []);

  if (typeof window !== "undefined" && !new URLSearchParams(location.search).has("perf")) return null;

  const copy = () => {
    if (!s) return;
    navigator.clipboard?.writeText(
      [
        `REAL PAGE: load ${s.load}ms | FCP ${s.fcp}ms | DCL ${s.dcl}ms | ${s.reqs} reqs | ${s.pending} pending`,
        `conn: dns ${s.dns}ms tcp ${s.tcp}ms tls ${s.tls}ms ttfb ${s.ttfb}ms`,
        ...s.slowest.map((r) => `  ${r.ms}ms (wait ${r.wait} / dl ${r.dl}) ${r.from} ${r.name}`),
      ].join("\n")
    );
  };

  return (
    <div className="perf-probe" role="status" aria-live="polite">
      {!s ? (
        <b>measuring… {t}s</b>
      ) : (
        <>
          <div className="perf-probe__top">
            <b>load {s.load}ms</b>
            <span>paint <em>{s.fcp}</em></span>
            <span>interactive <em>{s.dcl}</em></span>
            <span>reqs <em>{s.reqs}</em></span>
            {s.pending > 0 && <span className="perf-probe__bad">pending <em>{s.pending}</em></span>}
          </div>
          <div className="perf-probe__conn">
            dns {s.dns} · tcp {s.tcp} · tls {s.tls} · ttfb {s.ttfb} ms
          </div>
          <ol className="perf-probe__list">
            {s.slowest.map((r) => (
              <li key={r.name}>
                <em>{r.ms}ms</em>
                <span>wait {r.wait} / dl {r.dl}</span>
                <span className="perf-probe__name">{r.from === "self" ? "" : r.from + " "}{r.name}</span>
              </li>
            ))}
          </ol>
          <button onClick={copy}>Copy all</button>
        </>
      )}
    </div>
  );
}
