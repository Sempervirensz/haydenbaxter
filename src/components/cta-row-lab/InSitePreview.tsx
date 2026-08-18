"use client";

// The real page tree, with the Consulting chapter opted in to the row — and a
// control for which screen its three choices open into.
//
// This is the whole flow in one place: press a CTA button and see the offer
// page it resolves to, in the context it will actually live in. Section order
// and components are the homepage's own (see src/app/page.tsx); the only
// differences are the provider wrapping the tree and the absent soft-lock
// gate, so the Work stack is reachable by scrolling.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import PersonasSection from "@/components/PersonasSection";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import { CtaVariantProvider } from "@/components/work/CtaVariant";
import { OFFER_LAYOUTS, OFFER_SURFACES, type OfferLayoutId, type OfferSurfaceId } from "@/data/offerLab";
import {
  DEFAULT_CHROME,
  DEFAULT_DIRECTION,
  OFFER_CHROMES,
  OFFER_DIRECTIONS,
  type OfferChromeId,
  type OfferDirectionId,
} from "@/data/offerDirections";
import "./cta-row-lab.css";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

/**
 * `dossier` is what ships today — the honest baseline. `routed` is the
 * structural alternative: the choices become links to real offer PAGES rather
 * than panels opening inside the card.
 */
type ScreenChoice = OfferLayoutId | "dossier" | "routed" | "decision" | "disc";

const DISC_PLACEMENTS = [
  { id: "right", label: "Right", note: "Enters from the right edge, below the statue." },
  { id: "corner", label: "Corner", note: "Rests in the bottom-right corner. Most restrained." },
  { id: "left", label: "Left", note: "Behind the copy, so type sits over the disc." },
  { id: "bottom", label: "Bottom", note: "Rises from the bottom edge." },
] as const;

export default function InSitePreview() {
  const [screen, setScreen] = useState<ScreenChoice>("routed");
  const [surface, setSurface] = useState<OfferSurfaceId>("dark");
  /** Which layout the routed PAGES use — independent of the in-card choice. */
  const [routedLayout, setRoutedLayout] = useState<OfferLayoutId>("editorial");
  /** The art direction and the arrival the routed pages use. */
  const [direction, setDirection] = useState<OfferDirectionId>(DEFAULT_DIRECTION);
  const [chrome, setChrome] = useState<OfferChromeId>(DEFAULT_CHROME);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1100) setOpen(false);
  }, []);

  const decision = screen === "decision";
  const disc = screen === "disc";
  const [discPlacement, setDiscPlacement] =
    useState<(typeof DISC_PLACEMENTS)[number]["id"]>("right");
  const [discRest, setDiscRest] = useState(false);
  // The decision chooser navigates for the same reason the routed row does:
  // the offer content is a page, not a panel inside this card.
  // The disc variant renders the SHIPPED row, which discloses in place; it is
  // not a routed mode.
  const routed = screen === "routed" || decision;
  // `disc` renders the shipped row untouched, so like `dossier` and the routed
  // modes it has no offer-lab layout to hand down.
  const offerLayout: OfferLayoutId | null =
    screen === "dossier" || screen === "disc" || routed ? null : screen;

  // In routed mode the row navigates instead of disclosing. Every axis rides
  // in the query string, so what you press here is exactly what you land on —
  // and the URL you land on stays linkable afterwards.
  //
  // `direction` and `chrome` were missing from this href, which meant the whole
  // in-site flow silently fell back to the route defaults and the panel's
  // controls could not steer the thing they were sitting next to.
  const offerHref = routed
    ? (id: string) =>
        `/offer-lab/${id}?direction=${direction}&chrome=${chrome}` +
        `&layout=${routedLayout}&surface=${surface}`
    : null;

  return (
    <CtaVariantProvider
      value={{
        variant: disc ? "disc" : decision ? "decision" : "row",
        offerLayout,
        offerSurface: surface,
        offerHref,
        discPlacement,
        discRest,
      }}
    >
      <aside className={`ctarl ctarl--insite ${open ? "is-open" : ""}`} aria-label="Preview controls">
        <button type="button" className="ctarl__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="ctarl__dot" aria-hidden />
          In site
          <span className="ctarl__state">
            {screen === "disc"
              ? `Disc reveal · ${discPlacement}`
              : screen === "decision"
              ? "Decision chooser"
              : screen === "routed"
              ? OFFER_DIRECTIONS.find((d) => d.id === direction)?.name ?? "Routed pages"
              : screen === "dossier"
                ? "Dossier (live)"
                : OFFER_LAYOUTS.find((l) => l.id === screen)?.name}
          </span>
        </button>

        {open && (
          <div className="ctarl__body">
            <div className="ctarl__group">
              <h2 className="ctarl__groupTitle">Choices open into</h2>
              <div className="ctarl__col">
                <button
                  type="button"
                  className={`ctarl__row ${screen === "disc" ? "is-active" : ""}`}
                  aria-pressed={screen === "disc"}
                  onClick={() => setScreen("disc")}
                >
                  <span className="ctarl__rowName">Disc reveal</span>
                  <span className="ctarl__rowNote">
                    The shipped row exactly as it is. Point at a bar and a
                    quarter of the CD turns in behind it, showing that bar&rsquo;s
                    own mark on the printed rim.
                  </span>
                </button>
                <button
                  type="button"
                  className={`ctarl__row ${screen === "decision" ? "is-active" : ""}`}
                  aria-pressed={screen === "decision"}
                  onClick={() => setScreen("decision")}
                >
                  <span className="ctarl__rowName">Decision chooser</span>
                  <span className="ctarl__rowNote">
                    The CD and a tracklist instead of the candy-bar row. Chapter
                    04 becomes the chooser; the offer pages carry the content.
                  </span>
                </button>
                <button
                  type="button"
                  className={`ctarl__row ${screen === "routed" ? "is-active" : ""}`}
                  aria-pressed={screen === "routed"}
                  onClick={() => setScreen("routed")}
                >
                  <span className="ctarl__rowName">Routed pages</span>
                  <span className="ctarl__rowNote">
                    Each offer is its own URL. One scroll, real back button,
                    shareable. The choices become links.
                  </span>
                </button>
                <button
                  type="button"
                  className={`ctarl__row ${screen === "dossier" ? "is-active" : ""}`}
                  aria-pressed={screen === "dossier"}
                  onClick={() => setScreen("dossier")}
                >
                  <span className="ctarl__rowName">Dossier (live)</span>
                  <span className="ctarl__rowNote">The paper panel that ships today.</span>
                </button>
                {OFFER_LAYOUTS.filter((l) => l.id !== "dossier").map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`ctarl__row ${screen === l.id ? "is-active" : ""}`}
                    aria-pressed={screen === l.id}
                    onClick={() => setScreen(l.id)}
                  >
                    <span className="ctarl__rowName">{l.name}</span>
                    <span className="ctarl__rowNote">{l.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {disc && (
              <div className="ctarl__group">
                <h2 className="ctarl__groupTitle">Disc placement</h2>
                <div className="ctarl__col">
                  {DISC_PLACEMENTS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`ctarl__row ${discPlacement === o.id ? "is-active" : ""}`}
                      aria-pressed={discPlacement === o.id}
                      onClick={() => setDiscPlacement(o.id)}
                    >
                      <span className="ctarl__rowName">{o.label}</span>
                      <span className="ctarl__rowNote">{o.note}</span>
                    </button>
                  ))}
                </div>
                <div className="ctarl__seg" role="group" aria-label="Rest state">
                  <button
                    type="button"
                    className={`ctarl__segBtn ${!discRest ? "is-active" : ""}`}
                    aria-pressed={!discRest}
                    onClick={() => setDiscRest(false)}
                  >
                    Hidden at rest
                  </button>
                  <button
                    type="button"
                    className={`ctarl__segBtn ${discRest ? "is-active" : ""}`}
                    aria-pressed={discRest}
                    onClick={() => setDiscRest(true)}
                  >
                    Peeking at rest
                  </button>
                </div>
                <p className="ctarl__readout">
                  Consulting turns to the word CONSULTING, WorldPulse to
                  WORLDPULSE, Experience to the winged victory mark. Those
                  angles are measured off the disc artwork.
                </p>
              </div>
            )}

            {routed && (
              <div className="ctarl__group">
                <h2 className="ctarl__groupTitle">Routed page direction</h2>
                <div className="ctarl__col">
                  {OFFER_DIRECTIONS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`ctarl__row ${direction === d.id ? "is-active" : ""}`}
                      aria-pressed={direction === d.id}
                      onClick={() => setDirection(d.id)}
                    >
                      <span className="ctarl__rowName">{d.name}</span>
                      <span className="ctarl__rowNote">{d.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {routed && (
              <div className="ctarl__group">
                <h2 className="ctarl__groupTitle">Arrival</h2>
                <div className="ctarl__seg" role="group" aria-label="Arrival">
                  {OFFER_CHROMES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`ctarl__segBtn ${chrome === c.id ? "is-active" : ""}`}
                      aria-pressed={chrome === c.id}
                      onClick={() => setChrome(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="ctarl__readout">
                  {OFFER_CHROMES.find((c) => c.id === chrome)?.note}
                </p>
              </div>
            )}

            {/* The structural layouts only steer the BASELINE direction now —
                every other direction takes its structure from the offer's own
                template. Shown only when it can actually do something. */}
            {routed && direction === "baseline" && (
              <div className="ctarl__group">
                <h2 className="ctarl__groupTitle">Baseline structure</h2>
                <div className="ctarl__seg" role="group" aria-label="Baseline structure">
                  {OFFER_LAYOUTS.filter((l) => l.id !== "dossier").map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className={`ctarl__segBtn ${routedLayout === l.id ? "is-active" : ""}`}
                      aria-pressed={routedLayout === l.id}
                      onClick={() => setRoutedLayout(l.id)}
                    >
                      {l.name.split("·")[1]?.trim() ?? l.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ctarl__group">
              <h2 className="ctarl__groupTitle">Offer surface</h2>
              <div className="ctarl__seg" role="group" aria-label="Offer surface">
                {OFFER_SURFACES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`ctarl__segBtn ${surface === s.id ? "is-active" : ""}`}
                    aria-pressed={surface === s.id}
                    onClick={() => setSurface(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="ctarl__readout">
                Scroll to chapter 04 — Consulting, then press a choice.
                {routed ? " Each opens its own page." : " Each opens in place."}
              </p>
            </div>
          </div>
        )}
      </aside>

      <main>
        <HeroSection />
        <BrandsCarousel />
        <WorkSection />
        <PersonasSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
        <SiteFooter />
      </main>
    </CtaVariantProvider>
  );
}
