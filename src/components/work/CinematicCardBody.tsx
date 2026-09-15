"use client";

// Shared cinematic card content — one project rendered in the cinematic frame.
// Used by both the standalone lab stack (CinematicWorkStack) and the merged Work
// section (WorkSectionCinematic) so the two never diverge.
//
//   - 01 WorldPulse   media  — full-bleed photo + hover-revealed frosted glass
//   - 02 Selected AI Work panel — the deployed candy-bar gallery (ETBDetail)
//   - 03 Supply Chain  panel — the deployed globe + journey (SupplyChainDetail)
//   - 04 Consulting    media — cityscape + its built-in reveal (ConsultingHeroStage)
//
// Renders the card BODY + the header + the dim layer; the parent supplies the
// surrounding <article className="cstack__card …"> and the chapter wrapper.

import { useCallback, useEffect, useRef, useState } from "react";
import { WORK_SCREENS, type WorkScreen } from "@/data/work";
// The same Escape contract the mobile Work cards use — a generic hook that
// happens to live beside them, not a mobile-only behaviour.
import { useEscape } from "@/components/work/mobile/shared";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingHeroStage from "@/components/work/ConsultingHeroStage";

export type CardId = 1 | 2 | 3 | 4;
export type CardKind = "media" | "panel";

export interface CardMeta {
  id: CardId;
  num: string;
  name: string;
  tagline: string;
  kind: CardKind;
}

export const CINEMATIC_CARDS: CardMeta[] = [
  { id: 1, num: "01", name: "WorldPulse", tagline: "Digital product passports, made human.", kind: "media" },
  { id: 2, num: "02", name: "Selected AI Work", tagline: "Real problems, turned into working solutions.", kind: "panel" },
  { id: 3, num: "03", name: "Supply Chain", tagline: "Eight years across Asia, systemized.", kind: "panel" },
  { id: 4, num: "04", name: "Consulting", tagline: "Strategy that ships.", kind: "media" },
];

function screenOf(type: WorkScreen["type"]): WorkScreen | undefined {
  return WORK_SCREENS.find((s) => s.type === type);
}

interface Props {
  card: CardMeta;
  /** Drives Supply Chain globe reveal + Consulting reveal. */
  isActive: boolean;
  /** WorldPulse frosted-glass open state (hover/focus also open it via CSS). */
  peek: boolean;
  onTogglePeek: () => void;
}

export default function CinematicCardBody({ card, isActive, peek, onTogglePeek }: Props) {
  const infoWrapRef = useRef<HTMLDivElement | null>(null);
  const infoBtnRef = useRef<HTMLButtonElement | null>(null);

  // Hover and keyboard focus open the WorldPulse panel in CSS alone, so `peek`
  // is not on its own a reliable "is it showing?" — these mirror the two other
  // CSS conditions so Escape and outside-click only arm while something is
  // actually on screen.
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  // Closing a HOVER-opened panel needs a latch. Without it the pointer is still
  // inside the wrap when the X is pressed, `:hover` re-opens the panel on the
  // same frame, and the close button reads as broken.
  const [dismissed, setDismissed] = useState(false);

  const panelOpen = !dismissed && (peek || pointerInside || focusInside);

  // The latch lifts only once BOTH ways in are gone. Clearing it on
  // pointerleave alone was not enough: closing returns focus to the trigger,
  // which lives inside the wrap, so `:focus-within` held the panel open and
  // the X appeared to do nothing the moment the pointer left the panel it had
  // just hidden.
  useEffect(() => {
    if (!pointerInside && !focusInside) setDismissed(false);
  }, [pointerInside, focusInside]);

  const closePanel = useCallback(() => {
    if (peek) onTogglePeek();
    setDismissed(true);
    // preventScroll for the reason useFocusReturn documents: these cards sit in
    // a sticky, still-programmatically-scrollable container, and a plain
    // focus() yanks the Work stack out of frame — which would drop the reader
    // somewhere else in the section on close.
    infoBtnRef.current?.focus({ preventScroll: true });
  }, [peek, onTogglePeek]);

  useEscape(panelOpen, closePanel);

  // Click-outside. Pointer-driven opens have already closed themselves by the
  // time a click lands elsewhere, so in practice this is what dismisses a
  // tapped-open panel on a touch laptop.
  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!infoWrapRef.current?.contains(e.target as Node)) closePanel();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [panelOpen, closePanel]);

  const body = (() => {
    switch (card.id) {
      case 1: {
        const wp = screenOf("full");
        const full = wp && wp.type === "full" ? wp.full : null;
        return (
          <>
            <div className="cstack__hero">
              <div
                className="cstack__heroImg"
                style={{ backgroundImage: 'url("/WorldPulseCostal3.0.webp")' }}
              />
            </div>
            <div className="cstack__scrim" aria-hidden="true" />
            {/* Option C — balanced safe zones: headline sits in the clean upper-left
                sky band; the trigger + panel live bottom-right, each clear of the
                subject and of each other. */}
            <p className="cstack__caption">{card.tagline}</p>
            <div className="cstack__foot">
              <div
                ref={infoWrapRef}
                className={`cstack__infoWrap ${peek ? "is-peek" : ""} ${
                  dismissed ? "is-dismissed" : ""
                }`}
                onPointerEnter={() => setPointerInside(true)}
                onPointerLeave={() => setPointerInside(false)}
                onFocus={() => setFocusInside(true)}
                onBlur={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setFocusInside(false);
                }}
              >
                {/* Invisible hover bridge — spans the gap between the trigger and the
                    panel so pointer travel never leaves the group and the panel can't
                    vanish mid-reach (kept a real element so overflow:auto can't clip it). */}
                <span className="cstack__bridge" aria-hidden="true" />
                <div className="cstack__glass" role="group" aria-label="WorldPulse details">
                  <span className="cstack__glassSheen" aria-hidden="true" />
                  {/* Sticky, so it stays reachable while the dossier scrolls. */}
                  <button
                    type="button"
                    className="cstack__glassClose"
                    onClick={closePanel}
                    aria-label="Close the full story"
                    tabIndex={panelOpen ? 0 : -1}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <span className="cstack__glassLabel">WorldPulse · Founder</span>
                  {full?.caption.map((para, i) => (
                    <p key={i} className="cstack__glassText">{para}</p>
                  ))}
                  {full && (
                    <a
                      className="cstack__glassLink"
                      href={full.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {full.link.label}
                      <span className="cstack__glassArrow" aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  ref={infoBtnRef}
                  className="cstack__infoBtn"
                  onClick={() => {
                    // Clearing the latch first, or re-opening after a close
                    // would set `peek` while `is-dismissed` still hid the panel.
                    setDismissed(false);
                    onTogglePeek();
                  }}
                  aria-expanded={peek}
                >
                  The full story <span aria-hidden="true">▸</span>
                </button>
              </div>
            </div>
          </>
        );
      }
      case 2: {
        const etb = screenOf("emerging-tech-builds");
        return (
          <div className="cstack__panelBody">
            <div className="etb-gallery__shell cstack__etbShell">
              {etb && etb.type === "emerging-tech-builds" && <ETBDetail data={etb.etb} />}
            </div>
          </div>
        );
      }
      case 3: {
        const sc = screenOf("supply-chain");
        return (
          <div className="cstack__panelBody cstack__panelBody--sc">
            {sc && sc.type === "supply-chain" && (
              <SupplyChainDetail data={sc.supplyChain} isActive={isActive} />
            )}
          </div>
        );
      }
      case 4:
        return (
          <>
            <div className="cstack__scrim cstack__scrim--head" aria-hidden="true" />
            <div className="cstack__consulting">
              <ConsultingHeroStage isActive={isActive} />
            </div>
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <>
      {body}
      <header className="cstack__head">
        <span className="cstack__num">
          {card.num} — {card.name}
        </span>
        <span className="cstack__line" />
      </header>
      <div className="cstack__dim" aria-hidden="true" />
    </>
  );
}
