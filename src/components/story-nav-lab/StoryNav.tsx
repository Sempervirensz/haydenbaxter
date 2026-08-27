"use client";

// The thing under evaluation: a story navigator for the four Work chapters.
//
// One component renders every variant. That is deliberate — the DOM, the
// semantics and the behaviour are identical across variants, and only
// presentation moves. A variant cannot win by also changing what the control
// does, what it announces, or how big its touch target is.
//
// Fixed invariants, true in all twelve:
//   • real <button>s in a <nav aria-label>, never clickable divs
//   • the accessible name is always "<ordinal> — <name>" even when the visible
//     text is a bare dot, so screen readers never get "button, 3"
//   • hit areas are >= 44px; the painted dot stays small and quiet
//   • aria-current="step" marks the active section
//   • nothing essential is behind :hover — hover only ever ADDS a label that is
//     also reachable by focus
//   • reduced motion removes transitions, it does not remove feedback

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  SECTION_TOTAL,
  STORY_SECTIONS,
  type CounterId,
  type VariantId,
} from "@/data/storyNavLab";
import "./story-nav.css";

/** Which variants paint a continuous filled rule behind the markers. */
const CONTINUOUS = new Set<VariantId>(["spine-continuous", "label-spine"]);

/** Which variants draw the vertical spine rule at all. */
const HAS_SPINE = new Set<VariantId>([
  "spine-continuous",
  "spine-sections",
  "label-spine",
  "spine-counter",
  "spine-numbers",
]);

/** Which variants render the marker as a number rather than a dot. */
const NUMBERED = new Set<VariantId>(["numbers-edge", "spine-numbers"]);

/** Variants whose resting state on mobile is a collapsed pill. */
const COLLAPSIBLE = new Set<VariantId>(["mobile-collapsed"]);

/** How long the flash label lingers after a section change. */
const FLASH_MS = 2000;

interface Props {
  variant: VariantId;
  counter: CounterId;
  /** 1-based active section. */
  section: number;
  onNavigate: (section: number) => void;
  expanded: boolean;
  onExpandedChange: (next: boolean) => void;
  reducedMotion: boolean;
  /** Fractional read progress 0–1, for the continuous spine fill. */
  progress: number;
}

export default function StoryNav({
  variant,
  counter,
  section,
  onNavigate,
  expanded,
  onExpandedChange,
  reducedMotion,
  progress,
}: Props) {
  const navId = useId();
  const rootRef = useRef<HTMLElement | null>(null);
  const [flashing, setFlashing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const isCollapsible = COLLAPSIBLE.has(variant);
  const isOpen = !isCollapsible || expanded;

  // ── Flash label: show the name briefly when the section changes ──────────
  // Under reduced motion the label simply stays put rather than animating in
  // and out — direct, not elaborate, but never less informative.
  useEffect(() => {
    if (variant !== "label-flash") return;
    setFlashing(true);
    if (reducedMotion) return;
    const t = window.setTimeout(() => setFlashing(false), FLASH_MS);
    return () => window.clearTimeout(t);
  }, [section, variant, reducedMotion]);

  // ── Esc closes the expanded mobile list, and focus returns to the toggle ──
  useEffect(() => {
    if (!isCollapsible || !expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onExpandedChange(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onExpandedChange(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [isCollapsible, expanded, onExpandedChange]);

  const go = useCallback(
    (id: number) => {
      onNavigate(id);
      if (isCollapsible) onExpandedChange(false);
    },
    [onNavigate, isCollapsible, onExpandedChange]
  );

  const active = STORY_SECTIONS.find((s) => s.id === section) ?? STORY_SECTIONS[0];

  // Where the ordinal is allowed to appear, per counter treatment.
  const ordinalOnLabel = counter === "on-label" || counter === "in-nav";
  const ordinalOnDot = counter === "on-dot";
  const ordinalAtSpineEnd = counter === "spine-end";
  const ordinalOnTap = counter === "tap-reveal" && (isOpen || focusWithin);
  // "numbered" makes the markers themselves the count, so nothing extra shows.
  const ordinalSuppressed = counter === "remove" || counter === "numbered" || counter === "keep";

  // Should the active section's NAME be visible right now?
  const labelAlwaysOn =
    variant === "label-persistent" ||
    variant === "label-dots" ||
    variant === "label-spine" ||
    variant === "mobile-minimal" ||
    variant === "desktop-hover";
  const showActiveLabel =
    (labelAlwaysOn || (variant === "label-flash" && flashing)) && isOpen;

  // desktop-hover reveals every name on hover OR focus. The active name is
  // shown regardless, which is what keeps the variant usable without a pointer.
  const revealAll = variant === "desktop-hover" && (hovering || focusWithin);

  const classes = [
    "snav",
    `snav--${variant}`,
    HAS_SPINE.has(variant) && "snav--spine",
    CONTINUOUS.has(variant) && "snav--continuous",
    NUMBERED.has(variant) && "snav--numbered",
    isCollapsible && "snav--collapsible",
    isOpen && "is-open",
    revealAll && "is-revealed",
    reducedMotion && "snav--reduced",
  ]
    .filter(Boolean)
    .join(" ");

  // mobile-minimal is a single readout, not a list of destinations. It still
  // has to be operable, so it advances to the next section (wrapping at the
  // end) and says so in its accessible name.
  if (variant === "mobile-minimal") {
    const next = section >= STORY_SECTIONS.length ? 1 : section + 1;
    const nextSection = STORY_SECTIONS.find((s) => s.id === next)!;
    return (
      <nav ref={rootRef} className={classes} aria-label="Story sections">
        <button
          type="button"
          className="snav__readout"
          onClick={() => go(next)}
          aria-label={`Section ${active.ordinal}, ${active.name}. Go to next section, ${nextSection.name}.`}
        >
          <span className="snav__readoutName">{active.name}</span>
          {counter !== "remove" && (
            <span className="snav__readoutCount" aria-hidden="true">
              {active.num} / {SECTION_TOTAL}
            </span>
          )}
        </button>
      </nav>
    );
  }

  return (
    <nav
      ref={rootRef}
      className={classes}
      aria-label="Story sections"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
      }}
    >
      {/* Collapsed mobile trigger. A real button with an expanded state, so the
          list it controls is announced rather than just appearing. */}
      {isCollapsible && (
        <button
          type="button"
          className="snav__toggle"
          aria-expanded={expanded}
          aria-controls={navId}
          onClick={() => onExpandedChange(!expanded)}
        >
          <span className="snav__toggleDots" aria-hidden="true">
            {STORY_SECTIONS.map((s) => (
              <span
                key={s.id}
                className={`snav__toggleDot ${s.id === section ? "is-active" : ""}`}
              />
            ))}
          </span>
          <span className="snav__srOnly">
            {expanded ? "Hide" : "Show"} story sections. Currently on {active.name},
            section {active.ordinal}.
          </span>
        </button>
      )}

      {ordinalAtSpineEnd && isOpen && (
        <span className="snav__spineEnd" aria-hidden="true">
          {active.num} / {SECTION_TOTAL}
        </span>
      )}

      <ol className="snav__list" id={navId} hidden={isCollapsible && !expanded}>
        {HAS_SPINE.has(variant) && (
          <span
            className="snav__rail"
            aria-hidden="true"
            style={
              CONTINUOUS.has(variant)
                ? ({ "--snav-fill": `${Math.round(progress * 100)}%` } as React.CSSProperties)
                : undefined
            }
          />
        )}

        {STORY_SECTIONS.map((s) => {
          const isActive = s.id === section;
          const isDone = s.id < section;
          // The name is visible for: the active one under a label variant, all
          // of them while revealed or expanded.
          const nameVisible =
            (isActive && showActiveLabel) || revealAll || (isCollapsible && expanded);

          return (
            <li
              key={s.id}
              className={`snav__item ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
            >
              <button
                type="button"
                className="snav__btn"
                onClick={() => go(s.id)}
                aria-current={isActive ? "step" : undefined}
                // The visible text can be a bare dot; the accessible name never is.
                aria-label={`${s.ordinal} — ${s.name}`}
              >
                {/* Name BEFORE marker, and every button right-aligned, so the
                    markers form a straight column at the edge. With the marker
                    first, the active row's dot was pushed left by the width of
                    its own label and the column visibly kinked. */}
                <span
                  className={`snav__name ${nameVisible ? "is-shown" : ""}`}
                  aria-hidden="true"
                >
                  {s.name}
                  {isActive && ordinalOnLabel && (
                    <span className="snav__nameCount"> {s.num} / {SECTION_TOTAL}</span>
                  )}
                </span>
                <span className="snav__marker" aria-hidden="true">
                  {NUMBERED.has(variant) ? s.num : null}
                </span>
                {isActive && ordinalOnDot && (
                  <span className="snav__dotCount" aria-hidden="true">
                    {s.num} / {SECTION_TOTAL}
                  </span>
                )}
                {isActive && ordinalOnTap && !ordinalSuppressed && !ordinalOnLabel && !ordinalOnDot && (
                  <span className="snav__dotCount" aria-hidden="true">
                    {s.num} / {SECTION_TOTAL}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
