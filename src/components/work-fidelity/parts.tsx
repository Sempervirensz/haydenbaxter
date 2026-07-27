"use client";

// Shared parts for the fidelity variations. Structural rules only — the pieces
// that must be identical across all four chapters so they read as one Work
// section. Anything expressing a card's own identity lives in its own file.

import { useEffect, type ReactNode, type RefObject } from "react";
import { WORK_SCREENS } from "@/data/work";

/** Chapter rail. The ordinal is the navigation cue, so no card spends space on
 *  a separate pager. Numbering comes from production's own WORK_SCREENS. */
export function Rail({
  id,
  tone = "onPhoto",
}: {
  id: number;
  tone?: "onPhoto" | "onPanel";
}) {
  const screen = WORK_SCREENS.find((s) => s.id === id);
  const ordinal = screen?.number ?? "";
  const name = screen?.name ?? "";
  return (
    <header className={`wf-rail wf-rail--${tone}`}>
      <span className="wf-rail__num">
        {ordinal} — {name}
      </span>
      <span className="wf-rail__line" aria-hidden="true" />
    </header>
  );
}

/** Escape closes, on every card, per the shared expanded-state rule. */
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

/** Focus restore. preventScroll is required: an `overflow: hidden` ancestor is
 *  still programmatically scrollable, and without it focusing inside an
 *  expanded state slides the whole card out of its frame. */
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
    // Only reclaim focus if it is currently inside the panel we just closed,
    // so a closed panel never steals focus on mount.
    const active = document.activeElement;
    if (panelRef.current && active && panelRef.current.contains(active)) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open, triggerRef, panelRef]);
}

/** Pointer-only dismiss layer. Always hidden from AT and never tabbable —
 *  keyboard closes via Escape or the labelled Close control. */
export function Scrim({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="wf-scrim"
      tabIndex={-1}
      aria-hidden="true"
      onClick={onClose}
    />
  );
}

export function CardShell({
  card,
  open,
  extraClass = "",
  children,
}: {
  card: string;
  open?: boolean;
  extraClass?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`wf-card wf-card--${card} ${open ? "is-open" : ""} ${extraClass}`}
    >
      {children}
    </article>
  );
}
