"use client";

// Single owner of the Calendly inline embed.
//
// Calendly is the site's only third-party runtime dependency, and it is the
// kind that fails quietly: the script is blocked by most content blockers and
// by strict-privacy browser modes. Previously a blocked script left a styled
// 700px void where the scheduler should be, with no other way to book.
//
// This component:
//   1. Loads the widget script exactly once per page, shared across callers.
//   2. Initialises the widget explicitly (`initInlineWidget`) instead of
//      relying on Calendly's auto-scan, which only runs once at script load
//      and silently skips containers mounted after that.
//   3. Falls back to a plain link to the same booking page if the embed does
//      not come up, so "Book a Call" always leads somewhere real.
//   4. Sizes its host to the height Calendly reports, so the scheduler is
//      never cut off.
//
// Readiness is taken from Calendly's own `event_type_viewed` message, NOT from
// the presence of an iframe. `initInlineWidget` appends the iframe
// synchronously, before a single byte is fetched, so an "is there an iframe?"
// check passes instantly and can never fail — which made the fallback below
// unreachable. A widget that mounts its frame and then dies inside it (blocked
// storage, a tripped bot check) left exactly the 700px void this file exists
// to prevent.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CALENDLY_URL } from "@/data/connect";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_ORIGIN = "https://calendly.com";

// How long to wait for the script global, and then for the widget to report
// itself ready, before giving up and showing the fallback. The ready budget is
// generous because it covers the iframe's own cold start — Calendly boots a
// React app, reCAPTCHA and Stripe in there, which is several seconds on a warm
// connection and more on a cold one. Tripping early would swap a scheduler
// that was about to appear for a link.
const SCRIPT_TIMEOUT_MS = 8000;
const READY_TIMEOUT_MS = 12000;

// Calendly emits a `page_height` of "2px" while its app boots, before the real
// height (~880px). Honouring that would collapse the host to a sliver.
const MIN_REPORTED_HEIGHT = 320;

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(opts: { url: string; parentElement: HTMLElement }): void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadCalendlyScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const el = document.createElement("script");
      el.src = SCRIPT_SRC;
      el.async = true;
      el.addEventListener("error", () => reject(new Error("calendly blocked")));
      document.head.appendChild(el);
    }

    // `window.Calendly` is the source of truth, not the script's load event:
    // a tag added by another mount (or an earlier hot reload) may already have
    // fired `load`, and a listener attached afterwards would never run — which
    // would hang this promise and suppress the fallback forever. Polling also
    // survives a throttled background tab, where rAF never fires at all.
    const startedAt = Date.now();
    const poll = () => {
      if (window.Calendly) return resolve();
      if (Date.now() - startedAt > SCRIPT_TIMEOUT_MS) {
        return reject(new Error("calendly unavailable"));
      }
      window.setTimeout(poll, 100);
    };
    poll();
  });
  // Let a later mount retry if this attempt failed.
  scriptPromise.catch(() => {
    scriptPromise = null;
  });
  return scriptPromise;
}

interface CalendlyEmbedProps {
  /** Class for the sized embed container (must give it a height). */
  className?: string;
  /** Skip loading until true — used by drawers that mount hidden. */
  active?: boolean;
}

export default function CalendlyEmbed({
  className = "",
  active = true,
}: CalendlyEmbedProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let ready = false;
    let timer: number | undefined;

    // No colour parameters. `background_color` / `text_color` / `primary_color`
    // are a paid-plan feature; on this account Calendly discards them and
    // serves the stock light widget regardless. They were here for a dark
    // scheduler that never rendered, so keeping them only implied the theme
    // was wired up. Re-add them if the plan changes.
    const url = `${CALENDLY_URL}?hide_gdpr_banner=1`;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== CALENDLY_ORIGIN) return;
      const data = e.data as { event?: string; payload?: { height?: string } };
      if (!data || typeof data !== "object") return;

      if (data.event === "calendly.event_type_viewed") {
        ready = true;
        if (timer) window.clearTimeout(timer);
      }

      if (data.event === "calendly.page_height") {
        const px = Number.parseInt(String(data.payload?.height ?? ""), 10);
        // Calendly re-reports this whenever its layout grows — picking a date
        // opens the time list — so the host keeps pace instead of clipping.
        if (Number.isFinite(px) && px >= MIN_REPORTED_HEIGHT) setHeight(px);
      }
    };
    window.addEventListener("message", onMessage);

    loadCalendlyScript()
      .then(() => {
        if (cancelled || !window.Calendly) return;
        // Guard against a double init if this effect ever re-runs.
        if (host.querySelector("iframe")) return;
        window.Calendly.initInlineWidget({ url, parentElement: host });

        timer = window.setTimeout(() => {
          if (!cancelled && !ready) setFailed(true);
        }, READY_TIMEOUT_MS);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      window.removeEventListener("message", onMessage);
      if (timer) window.clearTimeout(timer);
    };
  }, [active]);

  if (failed) {
    return (
      <div className={`${className} calendly-fallback`}>
        <p className="calendly-fallback__note">
          The scheduler couldn’t load — it may be blocked by a privacy
          extension.
        </p>
        <a
          className="tag tag--connect"
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a Call
        </a>
      </div>
    );
  }

  // Deliberately NOT `calendly-inline-widget`. That class is the selector
  // Calendly's auto-scan looks for at script load; finding a match it then
  // reads `data-url` and calls .split() on it, which throws
  // "Cannot read properties of null" into the console on every homepage load.
  // This component initialises the widget itself (see above), so opting into
  // the scan bought nothing — and no stylesheet targets the class either.
  //
  // `--calendly-h` is the height Calendly asked for. The stylesheet decides
  // what to do with it; until the first message lands it is simply unset and
  // the CSS fallback height applies.
  return (
    <div
      ref={hostRef}
      className={className}
      style={
        height
          ? ({ "--calendly-h": `${height}px` } as CSSProperties)
          : undefined
      }
    />
  );
}
