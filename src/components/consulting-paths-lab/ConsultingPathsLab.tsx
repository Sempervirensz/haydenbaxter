"use client";

// Consulting paths lab — /consulting-paths-lab.
//
// One question: should "Start a Consulting Project" answer with one combined
// panel (what ships today) or with two named paths side by side?
//
// The shell owns the settings and the flow state and nothing else. Every stage
// renders the same composition and the same interaction, so what differs
// between two stages is the skin and only the skin — which is what makes them
// comparable. The A/B toggle swaps ONLY the consulting answer, leaving the
// three top-level choices and the other two screens identical in both modes.
//
// Nothing on the live homepage imports any of this.

import { useCallback, useEffect, useState } from "react";
import type { PathId } from "@/data/workTogether";
import {
  BUTTONS,
  DEFAULT_LAYOUT,
  DEFAULT_PALETTE,
  DEFAULT_SURFACE,
  DEFAULT_PLAY_KEY,
  DEFAULT_TRACK_STYLE,
  LAYOUTS,
  PALETTES,
  SURFACES,
  PLAY_KEYS,
  TRACK_STYLES,
  TYPE_SCHEMES,
  getLayout,
  type ButtonId,
  type LayoutId,
  type PlayKeyId,
  type TrackStyleId,
  type PaletteId,
  type SurfaceId,
  type TypeSchemeId,
} from "@/data/consultingPathsLab";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import ConsultingPathsStage from "./ConsultingPathsStage";
import type { ScreenSkin } from "./ConsultingPathsScreen";
import "@/components/work/work-together.css";
import "./consulting-paths-lab.css";

type ViewportMode = "desktop" | "both" | "narrow" | "gallery";

export default function ConsultingPathsLab() {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [twoPaths, setTwoPaths] = useState(true);
  const [layout, setLayout] = useState<LayoutId>(DEFAULT_LAYOUT);
  const [palette, setPalette] = useState<PaletteId>(DEFAULT_PALETTE);
  const [surface, setSurface] = useState<SurfaceId>(DEFAULT_SURFACE);
  // null = whichever type scheme the direction was drawn for.
  const [typeScheme, setTypeScheme] = useState<TypeSchemeId | null>(null);
  // null = whichever CTA recipe the direction was drawn for.
  const [button, setButton] = useState<ButtonId | null>(null);
  // The three bars: production's candy plates, or the current skin.
  const [rows, setRows] = useState<"skin" | "production">("skin");
  const [trackStyle, setTrackStyle] = useState<TrackStyleId>(DEFAULT_TRACK_STYLE);
  const [playKey, setPlayKey] = useState<PlayKeyId>(DEFAULT_PLAY_KEY);
  const [forceReduced, setForceReduced] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  // Consulting opens on load: the thing under review is inside it, and making
  // every reviewer click the same bar first is friction, not fidelity.
  const [openId, setOpenId] = useState<PathId | null>("consulting");

  const osReduced = usePrefersReducedMotion();
  const reduced = osReduced || forceReduced;

  // The panel only gets a gutter of its own from 1360px up (it is 470px wide
  // now that the axes sit in two columns). Narrower than that it is a fixed
  // overlay sitting on the stage, swallowing clicks on the very thing being
  // judged — so it starts collapsed. Done in an effect so server and first
  // client render agree.
  useEffect(() => {
    if (window.innerWidth < 1360) setPanelOpen(false);
  }, []);

  const change = useCallback((id: PathId | null) => setOpenId(id), []);

  const skin: ScreenSkin = { layout, palette, surface, type: typeScheme, button };
  const stageProps = { openId, onOpenChange: change, twoPaths, rows, trackStyle, playKey };
  const gallery = viewport === "gallery";

  return (
    <main
      className="cpl-root"
      data-viewport={viewport}
      data-motion={reduced ? "reduced" : "full"}
    >
      <div className="cpl-stages">
        {gallery ? (
          // Every direction at once, in the palette and surface currently set,
          // each with a path already expanded — the interaction is the thing
          // being compared, so no direction is shown at rest.
          LAYOUTS.map((l, i) => (
            <ConsultingPathsStage
              key={l.id}
              {...stageProps}
              width="gallery"
              primary={i === 0}
              skin={{ ...skin, layout: l.id }}
              label={l.label}
              note={l.note}
              initialOpen={i % 2 === 0 ? "ai" : "supply"}
            />
          ))
        ) : (
          <>
            {viewport !== "narrow" && (
              <ConsultingPathsStage
                {...stageProps}
                width="desktop"
                primary
                skin={skin}
              />
            )}
            {viewport !== "desktop" && (
              <ConsultingPathsStage
                {...stageProps}
                width="narrow"
                primary={viewport === "narrow"}
                skin={skin}
              />
            )}
          </>
        )}
      </div>

      <aside className="cpl-panel" data-open={panelOpen ? "true" : "false"}>
        <button
          type="button"
          className="cpl-panel__toggle"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
        >
          {panelOpen ? "Hide controls" : "Controls"}
        </button>

        {panelOpen && (
          <div className="cpl-panel__body">
            <h1 className="cpl-panel__title">Consulting paths</h1>
            <p className="cpl-panel__note">
              The three top-level choices are production. Only what opens
              beneath them is being redesigned — all three tabs, one skin.
            </p>

            <Group label="Direction" hint={LAYOUTS.find((l) => l.id === layout)?.note}>
              {LAYOUTS.map((l) => (
                <Toggle
                  key={l.id}
                  on={layout === l.id}
                  onClick={() => setLayout(l.id)}
                  label={l.label}
                  hint={l.note}
                />
              ))}
            </Group>

            <Group label="Palette" hint={PALETTES.find((p) => p.id === palette)?.note}>
              {PALETTES.map((p) => (
                <Toggle
                  key={p.id}
                  on={palette === p.id}
                  onClick={() => setPalette(p.id)}
                  label={p.label}
                  hint={p.note}
                />
              ))}
            </Group>

            <Group label="Surface" hint={SURFACES.find((s) => s.id === surface)?.note}>
              {SURFACES.map((s) => (
                <Toggle
                  key={s.id}
                  on={surface === s.id}
                  onClick={() => setSurface(s.id)}
                  label={s.label}
                  hint={s.note}
                />
              ))}
            </Group>

            <Group
              label="Type"
              hint={
                TYPE_SCHEMES.find((t) => t.id === (typeScheme ?? getLayout(layout).type))?.note
              }
            >
              <Toggle
                on={typeScheme === null}
                onClick={() => setTypeScheme(null)}
                label="Auto"
                hint="The scheme this direction was drawn for."
              />
              {TYPE_SCHEMES.map((t) => (
                <Toggle
                  key={t.id}
                  on={typeScheme === t.id}
                  onClick={() => setTypeScheme(t.id)}
                  label={t.label}
                  hint={t.note}
                />
              ))}
            </Group>

            <Group
              label="Buttons"
              wide
              hint={BUTTONS.find((b) => b.id === (button ?? getLayout(layout).button))?.note}
            >
              <Toggle
                on={button === null}
                onClick={() => setButton(null)}
                label="Auto"
                hint="The CTA recipe this direction was drawn for."
              />
              {BUTTONS.map((b) => (
                <Toggle
                  key={b.id}
                  on={button === b.id}
                  onClick={() => setButton(b.id)}
                  label={b.label}
                  hint={b.note}
                />
              ))}
            </Group>

            {/* Only Tracklist draws its choices this way, so the axis only
                appears where it does something. */}
            {layout === "tracklist" && (
              <Group
                label="Track style"
                wide
                hint={TRACK_STYLES.find((t) => t.id === trackStyle)?.note}
              >
                {TRACK_STYLES.map((t) => (
                  <Toggle
                    key={t.id}
                    on={trackStyle === t.id}
                    onClick={() => setTrackStyle(t.id)}
                    label={t.label}
                    hint={t.note}
                  />
                ))}
              </Group>
            )}

            {layout === "tracklist" && (
              <Group
                label="Play key"
                hint={PLAY_KEYS.find((k) => k.id === playKey)?.note}
              >
                {PLAY_KEYS.map((k) => (
                  <Toggle
                    key={k.id}
                    on={playKey === k.id}
                    onClick={() => setPlayKey(k.id)}
                    label={k.label}
                    hint={k.note}
                  />
                ))}
              </Group>
            )}

            <Group label="Top bars">
              <Toggle
                on={rows === "skin"}
                onClick={() => setRows("skin")}
                label="Skinned"
                hint="The three choices follow the direction, palette, surface, type and button recipe."
              />
              <Toggle
                on={rows === "production"}
                onClick={() => setRows("production")}
                label="Production"
                hint="The Emerging Tech Builds candy bars exactly as they ship."
              />
            </Group>

            <Group label="Consulting answer">
              <Toggle
                on={twoPaths}
                onClick={() => setTwoPaths(true)}
                label="Two paths"
              />
              <Toggle
                on={!twoPaths}
                onClick={() => setTwoPaths(false)}
                label="Production"
                hint="One combined panel, one generic CTA — and the other two tabs unskinned."
              />
            </Group>

            <Group label="Width">
              {(["desktop", "both", "narrow", "gallery"] as ViewportMode[]).map((v) => (
                <Toggle
                  key={v}
                  on={viewport === v}
                  onClick={() => setViewport(v)}
                  label={v === "gallery" ? "All five" : v}
                />
              ))}
            </Group>

            <Group label="Open screen">
              {([
                ["consulting", "Consulting"],
                ["worldpulse", "WorldPulse"],
                ["experience", "Experience"],
              ] as [PathId, string][]).map(([id, label]) => (
                <Toggle
                  key={id}
                  on={openId === id}
                  onClick={() => setOpenId(openId === id ? null : id)}
                  label={label}
                />
              ))}
            </Group>

            <Group label="Motion">
              <Toggle
                on={forceReduced}
                onClick={() => setForceReduced((r) => !r)}
                label={osReduced ? "Force (OS already on)" : "Force reduced motion"}
              />
            </Group>
          </div>
        )}
      </aside>
    </main>
  );
}

/**
 * One axis. The note for whatever is currently selected sits under the label
 * rather than inside every chip.
 *
 * The first version printed all five or six notes at once and the panel came to
 * 1735px of controls in a 1012px window — so Buttons, Width, Open screen and
 * Motion all sat below a fold nobody knew was there, and the buttons axis
 * appeared not to work because it could not be reached. Chips are now one line
 * each and every group fits on screen.
 */
function Group({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  /** Spans both columns of the panel — for axes with many options. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`cpl-group ${wide ? "cpl-group--wide" : ""}`.trim()}>
      <h2 className="cpl-group__label">{label}</h2>
      {hint && <p className="cpl-group__hint">{hint}</p>}
      <div className="cpl-group__items">{children}</div>
    </section>
  );
}

/**
 * The hint shows on the SELECTED chip only.
 *
 * With every option carrying two lines of explanation the panel ran past the
 * bottom of a 1050px window, and the groups below the fold — Buttons among them
 * — were unreachable without noticing that the panel itself scrolls. Nobody
 * noticed. The full note is still one hover away on every chip.
 */
function Toggle({
  on,
  onClick,
  label,
  hint,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  /** Shown on hover only — the selected one is printed under the group label. */
  hint?: string;
}) {
  return (
    <button
      type="button"
      className="cpl-toggle"
      data-on={on ? "true" : "false"}
      aria-pressed={on}
      onClick={onClick}
      title={hint}
    >
      {label}
    </button>
  );
}
