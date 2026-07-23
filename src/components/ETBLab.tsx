"use client";

import { useEffect, useRef, useState } from "react";
import {
  ETB_LAB_PROJECTS,
  ETB_LAB_VARIANTS,
  type ETBLabVariant,
} from "@/data/etbLab";
import VariantA from "./etb-lab/VariantA";
import VariantB from "./etb-lab/VariantB";
import VariantC from "./etb-lab/VariantC";
import "./etb-lab.css";

function getBriefSummary(oneLiner: string): string {
  const text = oneLiner.trim().replace(/\s+/g, " ");
  if (!text) return "";
  const cleaned = text.replace(/[.!?]\s*$/, "");
  const parts = cleaned.split(/[:;,]/);
  const candidate = parts.find(
    (p) => p.trim().length >= 14 && p.trim().length <= 52,
  );
  if (candidate) return candidate.trim();
  if (parts[0]?.trim()) return parts[0].trim();
  return cleaned.split(" ").slice(0, 6).join(" ");
}

const VARIANT_LABELS: Record<ETBLabVariant, string> = {
  A: "A — Split Rail",
  B: "B — Overlay",
  C: "C — Full Push",
};

export default function ETBLab() {
  const [activeVariant, setActiveVariant] = useState<ETBLabVariant>("A");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const lastSelectedRef = useRef<string | null>(null);

  // Track last selected for focus restore
  useEffect(() => {
    if (selectedId) lastSelectedRef.current = selectedId;
  }, [selectedId]);

  // Escape key closes detail
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedId) {
        setSelectedId(null);
        // Restore focus to the bar that was selected
        if (lastSelectedRef.current) {
          const bar = document.querySelector(
            `[data-bar-id="${lastSelectedRef.current}"] .etb-bar__head`,
          ) as HTMLElement | null;
          bar?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const sharedProps = {
    projects: ETB_LAB_PROJECTS,
    selectedId,
    hoveredId,
    onSelect: setSelectedId,
    onHover: setHoveredId,
    getBriefSummary,
  };

  return (
    <div className="etbLab">
      <div className="etbLab-header">
        <h1 className="etbLab-title">ETB Interaction Lab</h1>
        <div className="etbLab-switcher" role="radiogroup" aria-label="Variant">
          {ETB_LAB_VARIANTS.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={activeVariant === v}
              className={`etbLab-switcher__btn ${activeVariant === v ? "is-active" : ""}`}
              onClick={() => {
                setActiveVariant(v);
                setSelectedId(null);
                setHoveredId(null);
              }}
            >
              {VARIANT_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="etbLab-stage">
        {activeVariant === "A" && <VariantA {...sharedProps} />}
        {activeVariant === "B" && <VariantB {...sharedProps} />}
        {activeVariant === "C" && <VariantC {...sharedProps} />}
      </div>

      <div className="etbLab-activeTag" aria-live="polite">
        Variant {activeVariant}
        {selectedId ? ` · ${selectedId}` : " · none selected"}
      </div>
    </div>
  );
}
