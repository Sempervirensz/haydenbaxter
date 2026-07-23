"use client";

import { useEffect } from "react";
import WorkSection from "@/components/WorkSection";
import { WORK_SCROLL_CONFIG } from "@/data/work";

/**
 * /work-preview
 *
 * Minimal route that renders *only* the Work section. Designed to be embedded
 * in iframes by /responsive-lab so each tile represents a real viewport.
 *
 * Because iframes (especially when the parent tab is backgrounded) get their
 * `requestAnimationFrame` throttled to near-zero, the scroll-driven
 * `useWorkScroll` RAF loop can't drive state updates reliably. So this route
 * *also* supports a lab override that:
 *   - computes the landing-zone state deterministically from progress
 *   - applies `.is-active` + `--cd-deg` directly to the DOM
 *   - on every animation frame (best-effort) AND immediately on message
 *
 * Controls (all optional, layered):
 *   ?progress=0..1            → scroll position + lab override
 *   ?label=WorldPulse|...     → force a specific landing zone active
 *   postMessage {type:"setProgress", progress}
 *   postMessage {type:"setLabel", label}
 */

// Mirror of `getCdState` from useWorkScroll — scoped to the landing window
// (0..firstBreak of the full section). Returns {deg, label} as if the hook
// had seen this progress at rest.
function landingState(progress: number) {
  const zones = WORK_SCROLL_CONFIG.zones;
  const p = Math.max(0, Math.min(1, progress));
  for (const z of zones) {
    if (p >= z.hold[0] && p <= z.hold[1]) return { deg: z.deg, label: z.label };
  }
  for (let i = 0; i < zones.length - 1; i += 1) {
    const a = zones[i];
    const b = zones[i + 1];
    if (p > a.hold[1] && p < b.hold[0]) {
      const t = (p - a.hold[1]) / (b.hold[0] - a.hold[1]);
      return { deg: a.deg + (b.deg - a.deg) * t, label: t < 0.5 ? a.label : b.label };
    }
  }
  return { deg: 0, label: "" };
}

export default function WorkPreviewPage() {
  useEffect(() => {
    const splash = document.querySelector<HTMLElement>(".splash");
    if (splash) splash.style.display = "none";

    // Iframes inside backgrounded parent tabs get `document.hidden === true`,
    // which pauses CSS transitions. Our lab changes state discretely via
    // postMessage and wants the final visual state to appear *immediately*,
    // not wait for a transition that will never run. Kill transitions on the
    // C2 items only while inside this lab route.
    const style = document.createElement("style");
    style.textContent = `
      .wl-c2__item,
      .wl-c2__item * { transition: none !important; }
    `;
    document.head.appendChild(style);

    const applyOverride = (opts: { progress?: number; label?: string }) => {
      // Figure out target label.
      let label = opts.label;
      let deg: number | undefined;
      if (label === undefined && opts.progress !== undefined) {
        // Global progress → landing-window progress (first 35%).
        const firstBreak = WORK_SCROLL_CONFIG.screenBreaks[1] || 0.35;
        const landingProgress = Math.min(1, opts.progress / firstBreak);
        const s = landingState(landingProgress);
        label = s.label;
        deg = s.deg;
      }

      // Apply label to the list.
      document.querySelectorAll<HTMLElement>(".wl-c2__item").forEach((el) => {
        const name = el.querySelector<HTMLElement>(".wl-c2__name")?.textContent?.trim() ?? "";
        if (name && name === label) el.classList.add("is-active");
        else el.classList.remove("is-active");
      });

      // Apply CD rotation + label text.
      if (deg !== undefined) {
        const disc = document.querySelector<HTMLElement>(".cd-disc");
        if (disc) disc.style.setProperty("--cd-deg", `${deg}deg`);
      }
      const labelEl = document.querySelector<HTMLElement>(".cd-active-label");
      if (labelEl && label !== undefined) labelEl.textContent = label;

      // Also do a real scroll so inside-section backgrounds/detail chapters
      // reflect the right zone.
      if (opts.progress !== undefined) {
        const section = document.querySelector<HTMLElement>("#work");
        if (section) {
          const scrollable = Math.max(section.offsetHeight - window.innerHeight, 0);
          const clamped = Math.max(0, Math.min(1, opts.progress));
          window.scrollTo({ top: section.offsetTop + scrollable * clamped, behavior: "auto" });
        }
      }
    };

    // Initial from URL.
    const params = new URLSearchParams(window.location.search);
    const initialProgress = parseFloat(params.get("progress") ?? "NaN");
    const initialLabel = params.get("label") ?? undefined;
    // Wait for hook to render, then overwrite its initial state.
    const apply = () =>
      applyOverride({
        progress: Number.isFinite(initialProgress) ? initialProgress : undefined,
        label: initialLabel,
      });
    requestAnimationFrame(() => requestAnimationFrame(apply));
    // Re-apply after 200ms in case the hook clobbers our classes once on mount.
    const reapplyId = window.setTimeout(apply, 250);

    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "setProgress" && typeof e.data.progress === "number") {
        applyOverride({ progress: e.data.progress });
      }
      if (e.data.type === "setLabel" && typeof e.data.label === "string") {
        applyOverride({ label: e.data.label });
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
      window.clearTimeout(reapplyId);
      style.remove();
    };
  }, []);

  return (
    <main>
      <WorkSection />
    </main>
  );
}
