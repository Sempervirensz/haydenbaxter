"use client";

// Reads the OS reduced-motion preference and keeps it live. The lab ORs this
// with its own toggle so reduced motion can be reviewed on a machine that
// doesn't have the system setting on.

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  // Starts false so server and first client render agree; the effect corrects
  // it before any animation the user would notice.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
