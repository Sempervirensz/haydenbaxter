"use client";

import { useEffect, useState } from "react";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

const GLOBE_BASE = "/experiments/particle-globe-lab/dist/index";
const GLOBE_PARAMS = "?embed=1&v=20260224-pointer-flow";

function globeSrc(): string {
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  return GLOBE_BASE + (isLocal ? ".html" : "") + GLOBE_PARAMS;
}

export default function GlobeSandbox() {
  const [src, setSrc] = useState("");
  useEffect(() => {
    setSrc(globeSrc());
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
    >
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 py-4">
        <h1
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          Globe Sandbox
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Comparing the existing Three.js particle globe vs. the d3 wireframe
          dotted globe
        </p>
      </header>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Existing Particle Globe */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-500 bg-neutral-900 px-3 py-1 rounded-sm border border-neutral-800">
              Current &mdash; Three.js Particle Globe
            </span>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800 bg-black">
            {src && (
              <iframe
                src={src}
                title="Existing particle globe"
                className="w-full h-full"
                style={{ border: "none" }}
                loading="lazy"
                scrolling="no"
              />
            )}
          </div>
          <ul className="text-xs text-neutral-600 space-y-1 pl-3">
            <li>&bull; ~12k particles, spring-based shell retention</li>
            <li>&bull; Pointer-reactive turbulence</li>
            <li>&bull; Three.js + React Three Fiber</li>
            <li>&bull; Embedded via iframe</li>
          </ul>
        </div>

        {/* Wireframe Dotted Globe */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-500 bg-neutral-900 px-3 py-1 rounded-sm border border-neutral-800">
              New &mdash; d3 Wireframe Dotted Globe
            </span>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800 bg-black flex items-center justify-center">
            <RotatingEarth width={700} height={700} />
          </div>
          <ul className="text-xs text-neutral-600 space-y-1 pl-3">
            <li>&bull; Halftone dot fill on land masses</li>
            <li>&bull; Graticule grid lines</li>
            <li>&bull; d3-geo orthographic projection</li>
            <li>&bull; Drag to rotate, scroll to zoom</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
