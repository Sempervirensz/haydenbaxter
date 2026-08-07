"use client";

// Personas lab: four directions for the section that sits below the
// "Let's work together" chapter. Nothing here touches that chapter.
//
// The brief for these iterations: expandable on hover, and glass rather than
// the DYMO plate the first attempt used.
//
// Hover is the FEEL, never the only way in. Every variant below expands on
// hover, on keyboard focus, and on click/tap, because a hover-only reveal is
// invisible to a phone and to anyone driving the page from the keyboard. The
// hover rules are wrapped in `@media (hover: hover)` so a touch device gets
// the tap behaviour cleanly instead of a sticky phantom hover.
//
// All copy is read from `@/data/personas`. Nothing is retyped here, so the lab
// and the live section can never drift.

import { useState } from "react";
import {
  PERSONAS,
  personaPreview,
  personaRest,
  type Persona,
  type PersonaId,
} from "@/data/personas";
import PersonaIcon from "@/components/personas-lab/PersonaIcon";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import "@/components/personas-lab/personas-lab.css";

/* ---------------------------------------------------------------------------
   Mark: the thing in the corner of each row. Numeral, icon, or both.
   ------------------------------------------------------------------------ */

type MarkId = "icon" | "numeral" | "both";

const MARKS: { id: MarkId; label: string; note: string }[] = [
  {
    id: "icon",
    label: "Icon",
    note: "Phosphor thin, inlined. Circuitry, globe, leaf.",
  },
  { id: "numeral", label: "Numeral", note: "The 01 / 02 / 03 index alone." },
  { id: "both", label: "Both", note: "Icon above the numeral." },
];

/**
 * Keeps the variant's own `__num` class on the wrapper, so the accent rules
 * that set `color` there still apply and the SVG picks it up via
 * `fill: currentColor` with no extra wiring.
 */
function Mark({ mark, p, cls }: { mark: MarkId; p: Persona; cls: string }) {
  return (
    <span className={`${cls} plab-mark`} data-mark={mark}>
      {mark !== "icon" && <span className="plab-mark__num">{p.index}</span>}
      {mark !== "numeral" && (
        <PersonaIcon id={p.id} className="plab-mark__icon" />
      )}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Colour schemes

   Every value is already in the repo. Nothing here is a new brand colour:

     gold       #d8b15a, which work-details.css calls "the one accent" and
                which the privacy links, the footer focus ring and the Work
                detail highlights all already use.
     chapter    the per-section accents from scroll-lab's CardContent
                (#6882d8 ETB periwinkle, #2a5a8f steel, #2a6b4f green),
                lifted in lightness so they clear the readability floor as
                TEXT on #0a0a0a. The source values were authored as card
                borders and glows, where contrast was never the job.
     parchment  the cream family (#f3e6c4) the Work details use for warm ink.

   The accent is deliberately restricted to the numeral, the mono label, the
   chevron and the open-state edge. It never touches body copy, so the section
   stays a dark gallery with one point of colour rather than a coloured panel.
   ------------------------------------------------------------------------ */

type SchemeId = "mono" | "gold" | "chapter" | "parchment";

const SCHEMES: { id: SchemeId; label: string; note: string }[] = [
  { id: "mono", label: "Mono", note: "No accent. White at varying opacity." },
  { id: "gold", label: "Gold", note: "#d8b15a, the site's single accent." },
  {
    id: "chapter",
    label: "Chapter",
    note: "One hue per persona, from the Work chapter accents.",
  },
  { id: "parchment", label: "Parchment", note: "Warm cream ink, no hue shift." },
];

const ACCENTS: Record<SchemeId, Record<PersonaId, string>> = {
  mono: {
    ai: "rgba(255, 255, 255, 0.72)",
    supply: "rgba(255, 255, 255, 0.72)",
    worldpulse: "rgba(255, 255, 255, 0.72)",
  },
  gold: { ai: "#d8b15a", supply: "#d8b15a", worldpulse: "#d8b15a" },
  chapter: { ai: "#8fa4e8", supply: "#6fa3d8", worldpulse: "#5fae86" },
  parchment: { ai: "#f3e6c4", supply: "#f3e6c4", worldpulse: "#f3e6c4" },
};

/* ---------------------------------------------------------------------------
   Surface

   The site is documented dark-only, so this is a lab experiment rather than a
   theme. It is NOT an invented palette: #f5f4f1 on #111116 is the paper the
   repo already uses for every light surface it has (--wt-paper / --wt-ink in
   work-together.css, --ctal-paper / --ctal-ink in cta-lab.css, the ETB
   dossier in work-details.css). Light mode here means "the paper panel grew to
   fill the section", not "a new theme".

   The accents need their own values on paper, and the nice part is that the
   chapter hues go back to the ORIGINAL scroll-lab values. I had to lighten
   those for text on #0a0a0a; on paper they are correct exactly as authored.
   Gold has to darken, because #d8b15a on #f5f4f1 is around 1.9:1 and fails
   any contrast bar you care to set.
   ------------------------------------------------------------------------ */

/**
 * The plate behind the glass.
 *
 * A Higgsfield clip (Seedance 2.0), deliberately near-still: a sparse drifting
 * field of defocused light points with faint filaments between them. Abstract
 * on purpose. It reads as network and flow, which touches all three personas
 * without depicting any one of them, and it stays subject-less so `cover` can
 * reframe it at any width and --plate-position can move it freely.
 *
 * The plate sits at opacity 0.34 under a radial mask and behind body copy, so
 * any camera move here would fight the text: this one is locked off, measured
 * at 29.9/255 mean luma with a frame-to-frame delta under 0.24/255. Its last
 * second is cross-dissolved over its first, so the loop restarts without a
 * visible tick (seam SSIM 0.973).
 *
 * Both files must stay committed to public/ and served same-origin:
 * vercel.json's CSP has no `media-src`, so it falls back to `default-src
 * 'self'` and any external video URL is blocked.
 *
 * The still is frame 0 of the clip itself, so it doubles as the poster (no
 * flash of an empty plate while the video loads) and as the reduced-motion
 * fallback, where it renders instead of the video rather than alongside it.
 */
type PlateId = "network" | "city" | "still" | "none";

const PLATES: {
  id: PlateId;
  label: string;
  kind: "video" | "image" | "none";
  src: string | null;
  poster: string | null;
  note: string;
}[] = [
  {
    id: "network",
    label: "Network",
    kind: "video",
    src: "/personas-plate.mp4",
    poster: "/personas-plate.jpg",
    note: "Higgsfield, Seedance 2.0. A drifting field of defocused light points with faint filaments between them. Abstract on purpose: it reads as network and flow, which touches all three personas without depicting any one, and it has no subject to crop away.",
  },
  {
    id: "city",
    label: "City",
    kind: "video",
    src: "/personas-plate-city.mp4",
    poster: "/personas-plate-city.jpg",
    note: "Higgsfield, first pass. A night coastline with warm windows. Handsome, and it means nothing here: it is a place, and none of the three personas is about a place. Kept as the counter-example.",
  },
  {
    id: "still",
    label: "Still",
    kind: "image",
    src: "/consulting/hero-2.png",
    poster: null,
    note: "The original stand-in: the consulting hero, the same winged-victory statue the CD emblem was cut from. No motion, no video decode, and it keeps the angel-mark rhyme the cards already set up.",
  },
  {
    id: "none",
    label: "None",
    kind: "none",
    src: null,
    poster: null,
    note: "No plate at all. The control: `backdrop-filter` has nothing to sample, so the glass collapses to plain dark rectangles. This is the failure mode the plate exists to prevent.",
  },
];

type SurfaceId = "dark" | "paper";

const SURFACES: { id: SurfaceId; label: string; note: string }[] = [
  { id: "dark", label: "Dark", note: "The site as shipped. Dark-only is the documented rule." },
  {
    id: "paper",
    label: "Paper",
    note: "#f5f4f1 on #111116, the repo's existing paper surface. Off-spec for this site: here to look at, not to ship without a decision.",
  },
];

const ACCENTS_PAPER: Record<SchemeId, Record<PersonaId, string>> = {
  mono: {
    ai: "rgba(17, 17, 22, 0.72)",
    supply: "rgba(17, 17, 22, 0.72)",
    worldpulse: "rgba(17, 17, 22, 0.72)",
  },
  // #d8b15a darkened until it carries on paper.
  gold: { ai: "#8a6a1f", supply: "#8a6a1f", worldpulse: "#8a6a1f" },
  // The scroll-lab CardContent values, unmodified.
  chapter: { ai: "#4a3d8f", supply: "#2a5a8f", worldpulse: "#2a6b4f" },
  // Parchment is a warm ink here; a cream accent on cream is nothing.
  parchment: { ai: "#6b5836", supply: "#6b5836", worldpulse: "#6b5836" },
};

/** Inline custom property, so one map drives all four variants. */
function accentStyle(scheme: SchemeId, id: PersonaId, surface: SurfaceId) {
  const table = surface === "paper" ? ACCENTS_PAPER : ACCENTS;
  return { ["--p-accent" as string]: table[scheme][id] };
}

/* ---------------------------------------------------------------------------
   Type schemes

   `worldpulse` is the default, because matching that page is the brief. It is
   not an approximation: the values are lifted from the mobile WorldPulse card
   in work-mobile-cards.css.

     title  .wm-dos__title  mono, 500, 0.14em, uppercase
     label  .wm-label       mono, 0.24em, uppercase, white @ 0.62
     body   .wm-para        sans, line-height 1.5

   The thing worth noticing: that card has NO editorial serif in it. The serif
   is the homepage's voice (Connect, About, Journal); the WorldPulse card's
   voice is mono and sans. So "feel like WorldPulse" mostly means dropping the
   serif from the titles, which is exactly what `editorial` still uses.
   ------------------------------------------------------------------------ */

type TypeId = "worldpulse" | "editorial" | "mono" | "sans";

const TYPES: { id: TypeId; label: string; note: string }[] = [
  {
    id: "worldpulse",
    label: "WorldPulse",
    note: "Mono 500 uppercase titles at 0.14em, sans body at 1.5, mono labels at 0.24em. Lifted from the mobile WorldPulse card.",
  },
  {
    id: "editorial",
    label: "Editorial",
    note: "DM Serif Display titles. The homepage voice, shared with Connect, About and Journal.",
  },
  {
    id: "mono",
    label: "Mono stack",
    note: "Mono throughout, body copy included. The most technical reading, closest to a data sheet.",
  },
  {
    id: "sans",
    label: "Sans",
    note: "DM Sans 500 titles, tightened tracking. Quietest of the four.",
  },
];

/* ===========================================================================
   A. Glass rail. Three full-width rows that expand in place.
   ======================================================================== */

function VariantRail({ scheme, mark, surface }: { scheme: SchemeId; mark: MarkId; surface: SurfaceId }) {
  const [locked, setLocked] = useState<PersonaId | null>(null);

  return (
    <div className="pa">
      {PERSONAS.map((p) => {
        const isLocked = locked === p.id;
        return (
          <div
            key={p.id}
            className={`pa-row ${isLocked ? "is-locked" : ""}`}
            style={accentStyle(scheme, p.id, surface)}
          >
            <button
              type="button"
              className="pa-row__btn"
              aria-expanded={isLocked}
              onClick={() => setLocked(isLocked ? null : p.id)}
            >
              <Mark mark={mark} p={p} cls="pa-row__num" />
              <span className="pa-row__title">{p.title}</span>
              <span className="pa-row__area">{p.area}</span>
              <span className="pa-row__chev" aria-hidden="true">
                +
              </span>
            </button>
            {/* The headline bullet stays put; the rest expand under it. */}
            <p className="pa-row__preview">{personaPreview(p)}</p>
            <div className="pa-row__body">
              <ul className="pa-row__list">
                {personaRest(p).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===========================================================================
   B. Glass three-up. All three visible, bullets reveal on hover/focus.
   ======================================================================== */

function VariantThreeUp({ scheme, mark, surface }: { scheme: SchemeId; mark: MarkId; surface: SurfaceId }) {
  const [locked, setLocked] = useState<PersonaId | null>(null);

  return (
    <div className="pb">
      {PERSONAS.map((p) => {
        const isLocked = locked === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`pb-card ${isLocked ? "is-locked" : ""}`}
            style={accentStyle(scheme, p.id, surface)}
            aria-expanded={isLocked}
            onClick={() => setLocked(isLocked ? null : p.id)}
          >
            <Mark mark={mark} p={p} cls="pb-card__num" />
            <span className="pb-card__area">{p.area}</span>
            <span className="pb-card__title">{p.title}</span>
            <span className="pb-card__preview">{personaPreview(p)}</span>
            <span className="pb-card__body">
              <span className="pb-card__list">
                {personaRest(p).map((b) => (
                  <span key={b} className="pb-card__item">
                    {b}
                  </span>
                ))}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ===========================================================================
   C. Glass buttons. Hover previews the panel, click locks it.
   ======================================================================== */

function VariantButtons({ scheme, mark, surface }: { scheme: SchemeId; mark: MarkId; surface: SurfaceId }) {
  const [locked, setLocked] = useState<PersonaId>(PERSONAS[0].id);
  const [preview, setPreview] = useState<PersonaId | null>(null);

  const shownId = preview ?? locked;
  const shown = PERSONAS.find((p) => p.id === shownId) ?? PERSONAS[0];

  return (
    <div className="pc">
      <div className="pc-bar">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pc-btn ${p.id === shownId ? "is-active" : ""}`}
            style={accentStyle(scheme, p.id, surface)}
            aria-pressed={p.id === locked}
            onClick={() => setLocked(p.id)}
            onMouseEnter={() => setPreview(p.id)}
            onMouseLeave={() => setPreview(null)}
            onFocus={() => setPreview(p.id)}
            onBlur={() => setPreview(null)}
          >
            <Mark mark={mark} p={p} cls="pc-btn__num" />
            {p.area}
          </button>
        ))}
      </div>

      {/* Keyed on the persona so the panel re-runs its entrance each swap. */}
      <div
        key={shown.id}
        className="pc-panel"
        style={accentStyle(scheme, shown.id, surface)}
      >
        <p className="pc-panel__title">{shown.title}</p>
        <ul className="pc-panel__list">
          {shown.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ===========================================================================
   D. Glass filmstrip. Columns that widen on hover, stack on narrow.
   ======================================================================== */

function VariantFilmstrip({ scheme, mark, surface }: { scheme: SchemeId; mark: MarkId; surface: SurfaceId }) {
  const [locked, setLocked] = useState<PersonaId | null>(null);

  return (
    <div className="pd">
      {PERSONAS.map((p) => {
        const isLocked = locked === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`pd-col ${isLocked ? "is-locked" : ""}`}
            style={accentStyle(scheme, p.id, surface)}
            aria-expanded={isLocked}
            onClick={() => setLocked(isLocked ? null : p.id)}
          >
            <span className="pd-col__head">
              <Mark mark={mark} p={p} cls="pd-col__num" />
              <span className="pd-col__area">{p.area}</span>
            </span>
            <span className="pd-col__title">{p.title}</span>
            <span className="pd-col__preview">{personaPreview(p)}</span>
            <span className="pd-col__body">
              {personaRest(p).map((b) => (
                <span key={b} className="pd-col__item">
                  {b}
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ===========================================================================
   Lab shell
   ======================================================================== */

const VARIANTS: {
  id: string;
  label: string;
  note: string;
  render: (scheme: SchemeId, mark: MarkId, surface: SurfaceId) => React.ReactNode;
}[] = [
  {
    id: "a",
    label: "A. Glass rail",
    note: "Full-width rows. Hover or focus expands in place, the others stay put.",
    render: (s, m, f) => <VariantRail scheme={s} mark={m} surface={f} />,
  },
  {
    id: "b",
    label: "B. Glass three-up",
    note: "All three always visible. Hover lifts the card and fades its detail in.",
    render: (s, m, f) => <VariantThreeUp scheme={s} mark={m} surface={f} />,
  },
  {
    id: "c",
    label: "C. Glass buttons",
    note: "Hover previews the panel, click locks it. One panel at a time.",
    render: (s, m, f) => <VariantButtons scheme={s} mark={m} surface={f} />,
  },
  {
    id: "d",
    label: "D. Glass filmstrip",
    note: "Columns widen on hover. Stacks to full-width rows on narrow.",
    render: (s, m, f) => <VariantFilmstrip scheme={s} mark={m} surface={f} />,
  },
];

export default function PersonasLab() {
  // Defaults answer the brief directly: the WorldPulse type voice, and gold,
  // which is both the site's one accent and the WorldPulse mark's own colour.
  const [scheme, setScheme] = useState<SchemeId>("gold");
  const [type, setType] = useState<TypeId>("worldpulse");
  const [mark, setMark] = useState<MarkId>("icon");
  const [surface, setSurface] = useState<SurfaceId>("dark");
  const [plate, setPlate] = useState<PlateId>("network");
  const active = SCHEMES.find((s) => s.id === scheme) ?? SCHEMES[0];
  const activeType = TYPES.find((t) => t.id === type) ?? TYPES[0];
  const activeMark = MARKS.find((m) => m.id === mark) ?? MARKS[0];
  const activeSurface = SURFACES.find((f) => f.id === surface) ?? SURFACES[0];
  const activePlate = PLATES.find((p) => p.id === plate) ?? PLATES[0];
  // The plate autoplays and loops, which is motion like any other. Reduced
  // motion gets the poster still instead, so the glass still has something to
  // sample and the section does not collapse to flat rectangles.
  const reducedMotion = usePrefersReducedMotion();

  return (
    <main className="plab" data-scheme={scheme} data-type={type} data-surface={surface}>
      <header className="plab__head">
        <p className="plab__eyebrow">Personas lab</p>
        <h1 className="plab__title">Four directions</h1>
        <p className="plab__lede">
          Each one expands on hover, on keyboard focus, and on tap. The
          &ldquo;Let&rsquo;s work together&rdquo; chapter is untouched: this
          section sits below it.
        </p>

        <p className="plab__switchLabel">Surface</p>
        <div className="plab__switch" role="group" aria-label="Surface">
          {SURFACES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`plab__swatch ${f.id === surface ? "is-on" : ""}`}
              aria-pressed={f.id === surface}
              onClick={() => setSurface(f.id)}
            >
              <span
                className={`plab__dots plab__dots--surface-${f.id}`}
                aria-hidden="true"
              >
                <i />
              </span>
              {f.label}
            </button>
          ))}
        </div>
        <p className="plab__note plab__note--scheme">{activeSurface.note}</p>

        <p className="plab__switchLabel">Colour</p>
        <div className="plab__switch" role="group" aria-label="Colour scheme">
          {SCHEMES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`plab__swatch ${s.id === scheme ? "is-on" : ""}`}
              aria-pressed={s.id === scheme}
              onClick={() => setScheme(s.id)}
            >
              <span className={`plab__dots plab__dots--${s.id}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {s.label}
            </button>
          ))}
        </div>
        <p className="plab__note plab__note--scheme">{active.note}</p>

        <p className="plab__switchLabel">Type</p>
        <div className="plab__switch" role="group" aria-label="Type scheme">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`plab__swatch plab__swatch--type ${
                t.id === type ? "is-on" : ""
              }`}
              aria-pressed={t.id === type}
              onClick={() => setType(t.id)}
            >
              <span className={`plab__aa plab__aa--${t.id}`} aria-hidden="true">
                Aa
              </span>
              {t.label}
            </button>
          ))}
        </div>
        <p className="plab__note plab__note--scheme">{activeType.note}</p>

        <p className="plab__switchLabel">Mark</p>
        <div className="plab__switch" role="group" aria-label="Mark">
          {MARKS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`plab__swatch ${m.id === mark ? "is-on" : ""}`}
              aria-pressed={m.id === mark}
              onClick={() => setMark(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="plab__note plab__note--scheme">
          {activeMark.note} Phosphor Icons, MIT, inlined as paths.
        </p>

        <p className="plab__switchLabel">Plate</p>
        <div className="plab__switch" role="group" aria-label="Plate behind the cards">
          {PLATES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`plab__swatch ${p.id === plate ? "is-on" : ""}`}
              aria-pressed={p.id === plate}
              onClick={() => setPlate(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="plab__note plab__note--scheme">{activePlate.note}</p>
      </header>

      {VARIANTS.map((v) => (
        <section key={v.id} className="plab__section">
          <div className="plab__meta">
            <h2 className="plab__label">{v.label}</h2>
            <p className="plab__note">{v.note}</p>
          </div>
          {/* The plate is what makes the glass glass. `backdrop-filter` samples
              whatever is painted behind it INSIDE the same backdrop root, so
              this has to be a sibling under .plab__stage, not a background on
              some ancestor. On flat #0a0a0a the blur has nothing to sample and
              the cards read as plain dark rectangles.

              The clip now lives here (see PLATE_SRC). Worth knowing before this
              ports to the live section: the lab paints one plate per variant, so
              four videos decode at once here. The shipped section renders a
              single plate, so it pays a quarter of this. */}
          <div className="plab__stage">
            {activePlate.kind !== "none" && (
              <div className="plab__plate" aria-hidden="true">
                {activePlate.kind === "video" && !reducedMotion ? (
                  // Keyed on the source: swapping `src` on a live <video> does not
                  // reliably reload it without an explicit .load(), so remount instead.
                  <video
                    key={activePlate.src}
                    src={activePlate.src ?? undefined}
                    poster={activePlate.poster ?? undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={
                      (activePlate.kind === "video"
                        ? activePlate.poster
                        : activePlate.src) ?? undefined
                    }
                    alt=""
                  />
                )}
              </div>
            )}
            {v.render(scheme, mark, surface)}
          </div>
        </section>
      ))}
    </main>
  );
}
