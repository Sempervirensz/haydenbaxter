"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DEFAULT_SECTIONS,
  DUMMY_PROJECT,
  SECTIONS,
  VARIANTS,
  type Density,
  type SectionKey,
  type SectionState,
  type ShotMode,
  type VariantId,
  type ViewportMode,
} from "@/data/detailLab";
import { VARIANT_COMPONENTS } from "./detail-lab/variants";
import "./detail-lab.css";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="dl-ctrl">
      <span className="dl-ctrl__label">{label}</span>
      <div className="dl-seg" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={value === o.value ? "dl-seg__btn is-active" : "dl-seg__btn"}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DetailLab() {
  const [variant, setVariant] = useState<VariantId>("classic");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [density, setDensity] = useState<Density>("spacious");
  const [shotMode, setShotMode] = useState<ShotMode>("carousel");
  const [sections, setSections] = useState<SectionState>({ ...DEFAULT_SECTIONS });

  const toggle = (key: SectionKey) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));
  const setAll = (val: boolean) =>
    setSections(
      Object.fromEntries(SECTIONS.map((s) => [s.key, val])) as SectionState,
    );

  const ActiveVariant = VARIANT_COMPONENTS[variant];
  const activeDef = VARIANTS.find((v) => v.id === variant)!;

  return (
    <div className="dl-root">
      <aside className="dl-controls">
        <div className="dl-controls__top">
          <Link href="/" className="dl-controls__back">
            <span aria-hidden="true">&larr;</span> Home
          </Link>
          <h1 className="dl-controls__title">Detail Layout Lab</h1>
          <p className="dl-controls__sub">
            Wireframe the &ldquo;view full detail&rdquo; page on a dummy project.
            Pick a layout, toggle blocks, compare desktop vs. mobile.
          </p>
        </div>

        <div className="dl-ctrl">
          <span className="dl-ctrl__label">Layout — {VARIANTS.length} variants</span>
          <div className="dl-variantList">
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                className={v.id === variant ? "dl-variantBtn is-active" : "dl-variantBtn"}
                onClick={() => setVariant(v.id)}
                title={v.description}
              >
                <span className="dl-variantBtn__code">{v.code}</span>
                <span className="dl-variantBtn__label">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Segmented<ViewportMode>
          label="Viewport"
          value={viewport}
          onChange={setViewport}
          options={[
            { value: "desktop", label: "Desktop" },
            { value: "mobile", label: "Mobile" },
          ]}
        />
        <Segmented<Density>
          label="Density"
          value={density}
          onChange={setDensity}
          options={[
            { value: "spacious", label: "Spacious" },
            { value: "compact", label: "Compact" },
          ]}
        />
        <Segmented<ShotMode>
          label="Screenshots"
          value={shotMode}
          onChange={setShotMode}
          options={[
            { value: "carousel", label: "Carousel" },
            { value: "grid", label: "Grid" },
            { value: "stacked", label: "Stacked" },
          ]}
        />

        <div className="dl-ctrl">
          <div className="dl-ctrl__labelRow">
            <span className="dl-ctrl__label">Sections</span>
            <div className="dl-ctrl__bulk">
              <button type="button" className="dl-linkBtn" onClick={() => setAll(true)}>All</button>
              <span aria-hidden="true">·</span>
              <button type="button" className="dl-linkBtn" onClick={() => setAll(false)}>None</button>
            </div>
          </div>
          <div className="dl-toggles">
            {SECTIONS.map((s) => (
              <label key={s.key} className="dl-toggle">
                <input
                  type="checkbox"
                  checked={sections[s.key]}
                  onChange={() => toggle(s.key)}
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <main className="dl-stage">
        <div className="dl-stage__bar">
          <span className="dl-stage__code">{activeDef.code}</span>
          <span className="dl-stage__name">{activeDef.label}</span>
          <span className="dl-stage__desc">{activeDef.description}</span>
        </div>
        <div className="dl-stage__scroll">
          <div
            className={[
              "dl-frame",
              `dl-frame--${viewport}`,
              `dl-density--${density}`,
            ].join(" ")}
          >
            <ActiveVariant project={DUMMY_PROJECT} show={sections} shotMode={shotMode} />
          </div>
        </div>
      </main>
    </div>
  );
}
