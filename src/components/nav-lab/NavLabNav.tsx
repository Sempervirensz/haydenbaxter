"use client";

// One navbar, eight skins.
//
// Every concept renders THIS markup — same wordmark, same four links, same CTA,
// same mobile bar — and differs only by the `nlab-nav--<id>` class and the CSS
// in `nav-lab.css`. That is the only honest way to compare directions: if each
// concept had its own component, a difference in the row could be a difference
// in the design or a difference in someone's markup, and you couldn't tell which.
//
// Three behaviours are shared because the brief fixes them:
//
//   sticky   `position: fixed` on the wrapper, in every concept. The production
//            navbar is `absolute` inside the hero, so it leaves after one
//            viewport and the ~1720vh Work section that follows has no way back
//            to the CTA. Two concepts (yoke, dial) change SHAPE once past the
//            hero; none of them leave.
//
//   the CTA  never routes. It opens the hub — Consulting / WorldPulse /
//            Experience — because "let's work together" is three questions, not
//            one destination, and picking for the visitor is what the current
//            Book-a-Call link does wrong.
//
//   routing  nothing navigates away. `onNavigate` hands the destination to the
//            stage, which prints a receipt and scrolls to the real anchor when
//            the destination is genuinely on the page. Production routing for
//            About and Resume isn't finalized and the lab must not invent it.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  CONCEPTS,
  CTA,
  HUB_OPTIONS,
  NAV_ITEMS,
  type ConceptId,
  type HubOption,
  type LabAnchor,
  type NavItem,
} from "@/data/navLab";
import "./nav-lab.css";

export interface NavTarget {
  label: string;
  href: string;
  anchor?: LabAnchor;
  external?: boolean;
  provisional?: boolean;
}

/** Past this many pixels the bar is over content rather than over the hero. */
const SCROLLED_AT = 72;

export default function NavLabNav({
  concept,
  wordmark = "Hayden Baxter",
  onNavigate,
  hubOpen,
  onHubOpenChange,
}: {
  concept: ConceptId;
  wordmark?: string;
  onNavigate: (target: NavTarget) => void;
  /** Controlled so the lab shell can open the hub for review without a click. */
  hubOpen: boolean;
  onHubOpenChange: (open: boolean) => void;
}) {
  const def = CONCEPTS.find((c) => c.id === concept) ?? CONCEPTS[0];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [foldOpen, setFoldOpen] = useState(false);
  const [dialOpen, setDialOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();
  const menuId = useId();

  /* Scroll state — the one input concepts 01, 04 and 07 change shape on.

     Deliberately NOT rAF-batched. The handler reads one number and sets one
     boolean that React discards when it hasn't changed, so a frame's worth of
     coalescing buys nothing here and only adds a dependency on rAF actually
     running — which it does not inside a transform-scaled iframe, the exact
     shape this route is framed in. Heavier scroll work in this repo (the entry
     deal in SoftLockGate) still batches, because it measures. */
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_AT);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* Switching concept can't leave a disclosure open that the new skin has no
     affordance for — the fold belongs to 04 and the dial to 07. */
  useEffect(() => {
    setFoldOpen(false);
    setDialOpen(false);
    setMenuOpen(false);
  }, [concept]);

  // ESC closes whatever is open, innermost first, and hands focus back to the
  // control that opened it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (hubOpen) {
        onHubOpenChange(false);
        ctaRef.current?.focus();
        return;
      }
      if (menuOpen) setMenuOpen(false);
      if (foldOpen) setFoldOpen(false);
      if (dialOpen) setDialOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hubOpen, menuOpen, foldOpen, dialOpen, onHubOpenChange]);

  // Move focus into the sheet when it opens, so a keyboard visitor is actually
  // taken to the three choices rather than left behind the overlay.
  useEffect(() => {
    if (!hubOpen) return;
    sheetRef.current?.querySelector<HTMLElement>(".nlab-sheet__row")?.focus();
  }, [hubOpen]);

  const go = useCallback(
    (target: NavTarget) => {
      setMenuOpen(false);
      setFoldOpen(false);
      setDialOpen(false);
      onNavigate(target);
    },
    [onNavigate]
  );

  const openHub = useCallback(() => {
    setMenuOpen(false);
    setFoldOpen(false);
    onHubOpenChange(true);
  }, [onHubOpenChange]);

  const chooseHub = useCallback(
    (option: HubOption) => {
      onHubOpenChange(false);
      go({
        label: option.label,
        href: option.destination,
        anchor: option.anchor,
        provisional: option.provisional,
      });
    },
    [go, onHubOpenChange]
  );

  const renderLink = (item: NavItem, extraClass = "") => (
    <button
      key={item.label}
      type="button"
      className={`tag tag--nav ${extraClass}`}
      onClick={() => go(item)}
    >
      {item.label}
    </button>
  );

  /* The CTA, identical everywhere: a `<button>` because it discloses a panel
     rather than navigating, with `aria-expanded` to say so. */
  const cta = (
    <button
      ref={ctaRef}
      type="button"
      className="tag tag--cta"
      aria-haspopup="dialog"
      aria-expanded={hubOpen}
      aria-controls={hubOpen ? sheetId : undefined}
      onClick={openHub}
    >
      <span>{CTA.label}</span>
      <span className="nlab-cta__glyph" aria-hidden="true">
        {CTA.glyph}
      </span>
    </button>
  );

  const links = <div className="nlab-links">{NAV_ITEMS.map((item) => renderLink(item))}</div>;

  return (
    <div className="nlab">
      {/* 05 puts the wordmark in the top-left corner while the tray sits at the
          bottom. It is rendered HERE, outside the bar, because the tray carries
          a `backdrop-filter` — which makes it the containing block for any
          `position: fixed` descendant, so a wordmark inside it resolves against
          the tray and lands on top of the links. */}
      {def.id === "dock" && (
        <span className="nlab-wordmark nlab-wordmark--float">{wordmark}</span>
      )}

      <div
        className={`nlab-nav nlab-nav--${def.id} ${scrolled ? "is-scrolled" : ""}`}
        data-concept={def.id}
      >
        <div className="nlab-nav__inner">
          <span className="nlab-wordmark">{wordmark}</span>

          {/* 07 wraps the links with the CTA so the strip can open on
              hover OR focus-within OR press — a hover-only reveal is not a
              real affordance on a trackpad-less machine. */}
          {def.id === "dial" ? (
            <div className={`nlab-dialWrap ${dialOpen ? "is-open" : ""}`}>
              {links}
              <div className="nlab-actions">
                <button
                  type="button"
                  className="tag tag--nav nlab-dial"
                  aria-expanded={dialOpen}
                  aria-label={dialOpen ? "Hide navigation" : "Show navigation"}
                  onClick={() => setDialOpen((v) => !v)}
                >
                  <span className="nlab-dial__pip" />
                  <span className="nlab-dial__pip" />
                  <span className="nlab-dial__pip" />
                </button>
                {cta}
              </div>
            </div>
          ) : (
            <>
              {links}
              <div className="nlab-actions">
                {/* 04's collapsed state: the four links fold behind one tag. */}
                {def.id === "yoke" && (
                  <button
                    type="button"
                    className="tag tag--nav nlab-fold"
                    aria-expanded={foldOpen}
                    onClick={() => setFoldOpen((v) => !v)}
                  >
                    Menu
                  </button>
                )}
                {cta}
              </div>
            </>
          )}

          {def.id === "yoke" && foldOpen && scrolled && (
            <div className="nlab-fold__panel">
              {NAV_ITEMS.map((item) => renderLink(item))}
            </div>
          )}
        </div>

        {/* ---- Mobile ------------------------------------------------------
            The closed header carries the CTA. That is the requirement: the
            production hamburger hides the one action a recruiter arrives ready
            to take behind a press, on the device most of them arrive on. */}
        <div className="nlab-mbar">
          <span className="nlab-mbar__mark">{wordmark}</span>
          <div className="nlab-mbar__actions">
            <button
              type="button"
              className="tag tag--cta"
              aria-haspopup="dialog"
              aria-expanded={hubOpen}
              onClick={openHub}
            >
              <span className="nlab-cta__long">{CTA.label}</span>
              <span className="nlab-cta__short">{CTA.short}</span>
              <span className="nlab-cta__glyph" aria-hidden="true">
                {CTA.glyph}
              </span>
            </button>
            <button
              type="button"
              className="tag tag--nav"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Mounted only when open, so its five controls are out of the tab
            order the rest of the time — an invisible link that still takes
            focus is the exact bug the production panel had to fix. */}
        {menuOpen && (
          <div className="nlab-msheet" id={menuId}>
            {NAV_ITEMS.map((item) => renderLink(item))}
            <button type="button" className="tag tag--cta" onClick={openHub}>
              <span>{CTA.label}</span>
              <span className="nlab-cta__glyph" aria-hidden="true">
                {CTA.glyph}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ---- The hub ------------------------------------------------------
          A sheet, not a dropdown. "I've seen enough — show me the relevant way
          we could work together" is three real choices with a line of reading
          each, which is more than a menu can carry. */}
      {hubOpen && (
        <div
          className="nlab-hub"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onHubOpenChange(false);
              ctaRef.current?.focus();
            }
          }}
        >
          <div
            className="nlab-sheet"
            id={sheetId}
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Ways to work together"
          >
            <div className="nlab-sheet__head">
              <span className="nlab-sheet__title">Where would you like to start?</span>
              <span className="nlab-sheet__hint">Choose one</span>
            </div>

            <div className="nlab-sheet__rows">
              {HUB_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="nlab-sheet__row"
                  onClick={() => chooseHub(option)}
                >
                  <span className="nlab-sheet__index">{option.index}</span>
                  <span className="nlab-sheet__body">
                    <span className="nlab-sheet__label">{option.label}</span>
                    <span className="nlab-sheet__lede">{option.lede}</span>
                  </span>
                  <span className="nlab-sheet__chev" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="nlab-sheet__foot">
              <span className="nlab-sheet__note">
                Lab only — nothing here navigates. Each press prints its destination.
              </span>
              <button
                type="button"
                className="tag tag--nav"
                onClick={() => {
                  onHubOpenChange(false);
                  ctaRef.current?.focus();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
