"use client";

// ═══════════════════════════════════════════════════════════════════════════
// [EXPERIMENT] Mobile CD system — /mobile-lab
//
// The burned-disc identity carried onto a phone using the REAL production
// assets (same ones the deployed Work section uses on mobile):
//
//   <CdPlayerLanding>  The Work intro: suede-textured landing card with the
//                      gold-numbered track list and the Discman shell
//                      (/playershellpngtransparent.webp) holding the printed
//                      disc. The disc is a scroll scrubber — rotation is
//                      driven by the page's --mlab-spin var, like the
//                      production --cd-deg. Tapping the player "plays" the
//                      NEXT track in sequence. Marker-font label mirrors the
//                      production `.cd-active-label`.
//   <CdMiniDock>       Sticky mini disc; same --mlab-spin var, ring shows
//                      --mlab-progress; opens <TrackSheet>.
//   <TrackSheet>       Bottom-sheet track list (shared selector) with
//                      dialog focus management.
//
// When a winner ships, extract it into its own production component.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import { MOBILE_LAB, type MobileTrackId } from "@/data/mobileLab";

interface TrackNavProps {
  activeTrack: MobileTrackId | null;
  onSelect: (id: MobileTrackId) => void;
}

/* ── The Work intro: suede card + track list + Discman ── */
export function CdPlayerLanding({ activeTrack, onSelect }: TrackNavProps) {
  const { landing } = MOBILE_LAB;
  const active = landing.tracks.find((t) => t.id === activeTrack);

  // PLAY behaves like a CD player: advance to the next track (wrapping).
  const playNext = () => {
    const idx = active ? landing.tracks.findIndex((t) => t.id === active.id) : -1;
    const next = landing.tracks[(idx + 1) % landing.tracks.length];
    onSelect(next.id);
  };

  return (
    <section className="mlab-landing" aria-label="Selected work — track list">
      <span className="mlab-landing-kicker">{landing.kicker}</span>

      <ol className="mlab-c2">
        {landing.tracks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="mlab-c2-row"
              aria-current={activeTrack === t.id || undefined}
              onClick={() => onSelect(t.id)}
            >
              <span className="mlab-c2-num">{t.no}</span>
              <span className="mlab-c2-name">{t.name}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* Discman shell + printed disc — production mobile geometry
          (disc sits at 55% / 50.25% at 87% width inside the shell). */}
      <button
        type="button"
        className="mlab-player"
        aria-label="Play — go to the next track"
        onClick={playNext}
      >
        <img
          src={landing.shell}
          alt=""
          className="mlab-player-shell"
          width={900}
          height={1100}
          loading="lazy"
          decoding="async"
        />
        <span className="mlab-player-discwrap" aria-hidden="true">
          <span
            className="mlab-player-disc"
            style={{ backgroundImage: `url(${landing.disc})` }}
          />
        </span>
      </button>
      <span className="mlab-player-label" aria-hidden="true">
        {active ? `now playing — ${active.name}` : landing.idleLabel}
      </span>
    </section>
  );
}

/* ── Sticky mini dock (companion while reading) ── */
interface CdMiniDockProps {
  onOpen: () => void;
  sheetOpen: boolean;
  /** Fades out while the big player is on screen — one CD at a time. */
  hidden: boolean;
}

const RING_R = 27;
const RING_C = 2 * Math.PI * RING_R;

export function CdMiniDock({ onOpen, sheetOpen, hidden }: CdMiniDockProps) {
  return (
    <button
      type="button"
      className="mlab-dock"
      data-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-expanded={sheetOpen}
      aria-label="Open track list"
    >
      <span
        className="mlab-dock-disc"
        style={{ backgroundImage: `url(${MOBILE_LAB.landing.disc})` }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 58 58" aria-hidden="true">
        <circle className="ring-bg" cx="29" cy="29" r={RING_R} fill="none" strokeWidth="1.5" />
        {/* Dash offset driven by --mlab-progress in CSS — no re-renders. */}
        <circle
          className="ring-fg"
          cx="29"
          cy="29"
          r={RING_R}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={RING_C}
        />
      </svg>
    </button>
  );
}

/* ── Bottom-sheet track selector ── */
interface TrackSheetProps extends TrackNavProps {
  onClose: () => void;
}

export function TrackSheet({ activeTrack, onSelect, onClose }: TrackSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Dialog focus management: focus the first row on open, restore the
  // opener's focus on close. ESC closes (keyboard usability rule).
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    sheetRef.current?.querySelector<HTMLButtonElement>(".mlab-c2-row")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        className="mlab-sheet-backdrop"
        aria-label="Close track list"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="mlab-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={MOBILE_LAB.sheet.title}
      >
        <div className="mlab-sheet-grab" aria-hidden="true" />
        <span className="mlab-kicker">{MOBILE_LAB.sheet.title}</span>
        <ol className="mlab-c2 mlab-c2--sheet">
          {MOBILE_LAB.landing.tracks.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="mlab-c2-row"
                aria-current={activeTrack === t.id || undefined}
                onClick={() => {
                  onSelect(t.id);
                  onClose();
                }}
              >
                <span className="mlab-c2-num">{t.no}</span>
                <span className="mlab-c2-name">{t.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
