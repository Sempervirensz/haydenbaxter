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

import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/data/connect";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

// How long to wait for the script global, and then for the iframe, before
// giving up and showing the fallback.
const SCRIPT_TIMEOUT_MS = 8000;
const READY_TIMEOUT_MS = 6000;

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

  useEffect(() => {
    if (!active) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let timer: number | undefined;

    const url = `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f3f3f3&primary_color=ffffff`;

    loadCalendlyScript()
      .then(() => {
        if (cancelled || !window.Calendly) return;
        // Guard against a double init if this effect ever re-runs.
        if (host.querySelector("iframe")) return;
        window.Calendly.initInlineWidget({ url, parentElement: host });

        timer = window.setTimeout(() => {
          if (!cancelled && !host.querySelector("iframe")) setFailed(true);
        }, READY_TIMEOUT_MS);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
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

  return <div ref={hostRef} className={`calendly-inline-widget ${className}`} />;
}
