/**
 * App.jsx — Iteration viewer for Supply Chain hero variants.
 *
 * Switch between 6 iterations via:
 *   - Floating picker bar at top
 *   - URL param: ?v=1 … ?v=6
 *   - Keyboard: ← / → arrows
 *
 * Each iteration has a distinct animation approach.
 */

import { useState, useEffect, useCallback } from "react";
import SupplyChainSection, { VARIANT_NAMES } from "./components/SupplyChainSection";

const VARIANT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function getInitialVariant() {
  const params = new URLSearchParams(window.location.search);
  const v = parseInt(params.get("v"), 10);
  return VARIANT_IDS.includes(v) ? v : 1;
}

export default function App() {
  const [variant, setVariant] = useState(getInitialVariant);

  /* Sync variant → URL param */
  const switchTo = useCallback((v) => {
    setVariant(v);
    const url = new URL(window.location);
    url.searchParams.set("v", v);
    window.history.replaceState({}, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  /* Keyboard nav: ← / → */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") {
        switchTo(variant < 9 ? variant + 1 : 1);
      } else if (e.key === "ArrowLeft") {
        switchTo(variant > 1 ? variant - 1 : 9);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant, switchTo]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Floating variant picker ─────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-center gap-1 py-2.5 px-4
                      bg-black/70 backdrop-blur-md border-b border-white/[0.06]">

        {/* Left arrow */}
        <button
          onClick={() => switchTo(variant > 1 ? variant - 1 : 9)}
          className="p-1.5 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Previous variant"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Variant buttons */}
        <div className="flex gap-1">
          {VARIANT_IDS.map((id) => (
            <button
              key={id}
              onClick={() => switchTo(id)}
              className={`
                font-mono text-[9px] sm:text-[10px] tracking-widest uppercase px-2.5 sm:px-3 py-1.5 rounded
                border transition-all duration-150
                ${variant === id
                  ? "bg-white/12 border-white/20 text-white/90"
                  : "bg-transparent border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/12"
                }
              `}
            >
              <span className="hidden sm:inline">V{id} </span>
              <span className="sm:hidden">V{id}</span>
              <span className="hidden md:inline">— {VARIANT_NAMES[id]}</span>
            </button>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => switchTo(variant < 9 ? variant + 1 : 1)}
          className="p-1.5 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Next variant"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Keyboard hint */}
        <span className="hidden lg:flex items-center gap-1 ml-3 font-mono text-[8px] tracking-widest uppercase text-white/20">
          ← → keys
        </span>
      </div>

      {/* ── Scroll-to-start spacer ──────────────────────── */}
      <section className="h-screen flex items-center justify-center pt-12">
        <div className="text-center px-6">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
            <span className="font-mono text-[9px] tracking-widest uppercase text-white/50">
              Iteration {variant}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-white/30">
              {VARIANT_NAMES[variant]}
            </span>
          </div>
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-white/80">
            Supply Chain Hero
          </h1>
          <p className="font-montserrat text-sm text-white/40 mt-3 max-w-md mx-auto">
            Scroll down to see the animated reveal.
            Use the bar above or ← → arrow keys to switch iterations.
          </p>
          <div className="mt-10 animate-bounce">
            <svg className="w-5 h-5 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Supply Chain section (current variant) ──────── */}
      <SupplyChainSection
        key={variant}       /* Force remount on switch for clean animation state */
        variant={variant}
        sectionHeight="300vh"
        mapAsset="/mapmaster.jpeg"
      />

      {/* ── Tail spacer ────────────────────────────────── */}
      <section className="h-[50vh] flex items-center justify-center">
        <p className="font-mono text-[10px] tracking-widest uppercase text-white/20">
          End of section · Iteration {variant}: {VARIANT_NAMES[variant]}
        </p>
      </section>
    </div>
  );
}
