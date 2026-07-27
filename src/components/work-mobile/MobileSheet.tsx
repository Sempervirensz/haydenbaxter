"use client";

// The one disclosure pattern in the mobile Work system.
//
// Generalised from the WorldPulse Passport Sheet: all four chapters raise the
// same frosted sheet from the base of the card, so a visitor learns the gesture
// once. Cards own the OPEN STATE (Emerging Tech needs to know which row was
// tapped); this component owns the mechanics and the accessibility:
//
//   - handle is a real close button, so touch and keyboard share one affordance
//   - scrim dismisses, and is only live while open
//   - Escape closes
//   - focus moves into the sheet on open and back to the trigger on close
//   - `inert` while shut, so the sheet stays in layout (it has to transform)
//     without ever being tabbable or announced
//
// preventScroll on both focus calls is not optional: an `overflow: hidden`
// ancestor is still programmatically scrollable, and without it focusing the
// sheet slides the whole card out of its frame.

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Announced name for the sheet region. */
  label: string;
  /** Returned to on close. */
  triggerRef: RefObject<HTMLElement | null>;
  /** Sheet height as a container-query length, e.g. "48cqh". Cards tune this
   *  to what their own composition can spare above it. */
  height?: string;
  id: string;
  children: ReactNode;
}

export default function MobileSheet({
  open,
  onClose,
  label,
  triggerRef,
  height,
  id,
  children,
}: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const node = sheetRef.current;
    if (open) {
      wasOpen.current = true;
      node?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      };
      node?.addEventListener("keydown", onKey);
      return () => node?.removeEventListener("keydown", onKey);
    }
    // Only pull focus back if this sheet was the thing that had it — otherwise
    // mounting a closed sheet would steal focus from the page.
    if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open, onClose, triggerRef]);

  return (
    <>
      {/* Pointer-only dismiss affordance. Always hidden from AT and never
          tabbable: keyboard users close with Escape or the labelled handle, so
          exposing this would just be an unnamed button in the tab order. */}
      <button
        type="button"
        className="mws-scrim"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="mws-sheet"
        id={id}
        ref={sheetRef}
        role="group"
        aria-label={label}
        tabIndex={-1}
        inert={!open}
        // Sets the DEFAULT, not the height. An inline `--mws-sheet-h` would beat
        // the short-phone container query in the cascade, so SE-class screens
        // would silently keep the tall-phone sheet and scroll more than they
        // should. CSS resolves: card override → this default → 54cqh.
        style={height ? ({ "--mws-sheet-default": height } as React.CSSProperties) : undefined}
      >
        <span className="mws-sheet__sheen" aria-hidden="true" />
        <button
          type="button"
          className="mws-sheet__handle"
          onClick={onClose}
          aria-label={`Close ${label}`}
        />
        <div className="mws-sheet__scroll">{children}</div>
      </div>
    </>
  );
}
