"use client";

// Shared structural parts for the production mobile Work cards. These are the
// pieces that must be identical across all four chapters so they read as one
// Work section: the chapter rail, the escape/focus contract, and the dismiss
// scrim. Card-specific identity lives in each card file.
//
// Extracted from the Batch 6 lab (work-fidelity/parts.tsx); `wm-` classes and
// no lab-only props.

import { useEffect, useState, type RefObject } from "react";
import { WORK_SCREENS } from "@/data/work";

/** Chapter rail. Number + name come from production's own WORK_SCREENS, so the
 *  card can never disagree with the CD track list or the desktop stack. */
export function Rail({
  id,
  tone = "onPhoto",
}: {
  id: number;
  tone?: "onPhoto" | "onPanel";
}) {
  const screen = WORK_SCREENS.find((s) => s.id === id);
  return (
    <header className={`wm-rail wm-rail--${tone}`}>
      <span className="wm-rail__num">
        {screen?.number ?? ""} — {screen?.name ?? ""}
      </span>
      <span className="wm-rail__line" aria-hidden="true" />
    </header>
  );
}

/** Escape closes the card's expanded state, on every card. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onEscape();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}

/** Focus restore. preventScroll is required: the card lives inside an
 *  `overflow: clip` sticky container that is still programmatically scrollable,
 *  and without the guard, focusing an expanded panel yanks the card out of
 *  frame. */
export function useFocusReturn(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (open) {
      panelRef.current?.focus({ preventScroll: true });
      return;
    }
    const active = document.activeElement;
    if (panelRef.current && active && panelRef.current.contains(active)) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open, triggerRef, panelRef]);
}

/** Pointer-only dismiss layer — always hidden from AT and never tabbable;
 *  keyboard closes via Escape or the labelled Close control. */
export function Scrim({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="wm-scrim"
      tabIndex={-1}
      aria-hidden="true"
      onClick={onClose}
    />
  );
}

/** Live `prefers-reduced-motion` state, so a card can skip motion entirely
 *  (belt-and-braces with the CSS media query). Starts false so SSR and the
 *  first client paint agree; corrects on mount. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
