"use client";

import { useCallback, useEffect, useState } from "react";
import { SITE_CONTENT } from "@/data/siteContent";
import { releaseSoftLock } from "@/components/design-lab/softLockEvents";

export default function Navbar() {
  const { wordmark, navLinks } = SITE_CONTENT.header;
  const [open, setOpen] = useState(false);

  // In-page anchors can't resolve while the soft lock hides their targets, so
  // hand the destination to the gate: it opens, then scrolls once the content
  // is committed. Anything else (/blog, the Calendly CTA) is left to the browser.
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#") || href === "#") return;
      e.preventDefault();
      releaseSoftLock(href);
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* No py-* here: `.navbar` owns the vertical padding via --nav-pad-block,
          because the hero derives its nav clearance from the resulting height. */}
      <nav
        className="navbar absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
          {wordmark}
        </span>
        <div className="nav-tags flex items-center gap-2 sm:gap-3">
          {navLinks.map((link) => {
            const isExternal = /^https?:\/\//.test(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`tag ${link.cta ? "tag--cta" : "tag--nav"}`}
                onClick={(e) => handleAnchorClick(e, link.href)}
                {...(isExternal && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className={`nav-mobile__btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-mobile__lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div
        className={`nav-mobile__panel ${open ? "is-open" : ""}`}
        role="menu"
        aria-hidden={!open}
      >
        {navLinks.map((link) => {
          const isExternal = /^https?:\/\//.test(link.href);
          return (
            <a
              key={link.label}
              href={link.href}
              className="nav-mobile__link"
              onClick={(e) => {
                setOpen(false);
                handleAnchorClick(e, link.href);
              }}
              role="menuitem"
              {...(isExternal && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </>
  );
}
