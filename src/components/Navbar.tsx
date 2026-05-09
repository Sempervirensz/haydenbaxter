"use client";

import { useEffect, useState } from "react";
import { SITE_CONTENT } from "@/data/siteContent";

export default function Navbar() {
  const { wordmark, navLinks } = SITE_CONTENT.header;
  const [open, setOpen] = useState(false);

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
      <nav
        className="navbar absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 sm:py-6"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
          {wordmark}
        </span>
        <div className="nav-tags flex items-center gap-2 sm:gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`tag ${link.cta ? "tag--cta" : "tag--nav"}`}
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {link.label}
            </a>
          ))}
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
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="nav-mobile__link"
            onClick={() => setOpen(false)}
            role="menuitem"
            {...(link.external && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
