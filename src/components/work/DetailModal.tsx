"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  classPrefix: "etb-modal" | "scs-modal" | "cns-modal";
  labelledBy: string;
  describedBy: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function DetailModal({
  isOpen,
  onClose,
  eyebrow,
  classPrefix,
  labelledBy,
  describedBy,
  children,
}: DetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const bodyOverflowRef = useRef("");
  const screenOverflowRef = useRef("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const modalEl = modalRef.current;
    const dialogEl = dialogRef.current;
    if (!modalEl || !dialogEl) return;

    const screenEl = modalEl.closest(".work__screen--detail") as HTMLElement | null;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    bodyOverflowRef.current = document.body.style.overflow || "";
    screenOverflowRef.current = screenEl?.style.overflow || "";

    document.body.style.overflow = "hidden";
    if (screenEl) screenEl.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      dialogEl.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!nodes.length) {
        event.preventDefault();
        dialogEl.focus();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || active === dialogEl) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = bodyOverflowRef.current;
      if (screenEl) screenEl.style.overflow = screenOverflowRef.current;
      if (
        restoreFocusRef.current &&
        document.contains(restoreFocusRef.current) &&
        typeof restoreFocusRef.current.focus === "function"
      ) {
        restoreFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      className={`${classPrefix} ${isOpen ? "is-open" : ""}`}
      hidden={!isOpen}
    >
      <button
        className={`${classPrefix}__backdrop`}
        type="button"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Close dialog"
      />
      <div
        ref={dialogRef}
        className={`${classPrefix}__dialog`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`${classPrefix}__frame`}>
          <div className={`${classPrefix}__topbar`}>
            <div className={`${classPrefix}__eyebrow`}>{eyebrow}</div>
            <button
              className={`${classPrefix}__close`}
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
            >
              Close
            </button>
          </div>
          <div className={`${classPrefix}__body`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
