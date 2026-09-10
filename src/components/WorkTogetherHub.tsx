"use client";

// The sheet the nav CTA opens.
//
// "Let's work together" is three questions, not one destination. The nav used
// to answer it with a Calendly link, which asked a visitor to book a call
// before the page had established which of the three conversations they were
// booking. This asks the question instead, and every answer already exists:
// the three paths, their numbering and their ledes come from `PATHS` in
// `workTogether.ts` — the same data the Work Together chapter renders.
//
// Nothing here is a new destination. Choosing a path takes the visitor to that
// chapter with that path's screen already open (see `workTogetherEvents.ts`).
// The hub's value is REACH — the Work section runs past 13,000px, and until now
// the only way to reach these three was to scroll to the end of it.

import { useEffect, useRef } from "react";
import { CTA_HINT, PATHS, type PathId } from "@/data/workTogether";

export default function WorkTogetherHub({
  open,
  onClose,
  onChoose,
  labelledBy,
  id,
}: {
  open: boolean;
  onClose: () => void;
  onChoose: (path: PathId) => void;
  labelledBy?: string;
  id?: string;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Focus lands on the first choice, so a keyboard visitor arrives AT the three
  // options rather than behind the overlay holding them.
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLElement>(".wthub__row")?.focus();
  }, [open]);

  // Escape closes. Capture phase, because the Work Together section below also
  // listens for Escape to close its own screen — without this, one press could
  // close both, or the wrong one.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="wthub"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wthub__sheet"
        id={id}
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div className="wthub__head">
          <span className="wthub__title" id={labelledBy}>
            Where would you like to start?
          </span>
          <span className="wthub__hint">{CTA_HINT}</span>
        </div>

        <div className="wthub__rows">
          {PATHS.map((path) => (
            <button
              key={path.id}
              type="button"
              className="wthub__row"
              onClick={() => onChoose(path.id)}
            >
              <span className="wthub__index">{path.index}</span>
              <span className="wthub__body">
                <span className="wthub__label">{path.label}</span>
                <span className="wthub__lede">{path.lede}</span>
              </span>
              <span className="wthub__chev" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
