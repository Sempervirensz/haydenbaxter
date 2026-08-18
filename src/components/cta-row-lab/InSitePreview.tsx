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
import "./cta-row-lab.css";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

/**
 * `dossier` is what ships today — the honest baseline. `routed` is the
 * structural alternative: the choices become links to real offer PAGES rather
 * than panels opening inside the card.
 */
type ScreenChoice = OfferLayoutId | "dossier" | "routed";

export default function InSitePreview() {
  const [screen, setScreen] = useState<ScreenChoice>("routed");
  const [surface, setSurface] = useState<OfferSurfaceId>("dark");
  /** Which layout the routed PAGES use — independent of the in-card choice. */
  const [routedLayout, setRoutedLayout] = useState<OfferLayoutId>("editorial");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1100) setOpen(false);
  }, []);

  const routed = screen === "routed";
  const offerLayout: OfferLayoutId | null =
    screen === "dossier" || routed ? null : screen;

  // In routed mode the row navigates instead of disclosing. The layout the
  // pages render rides in the query string so a treatment stays linkable.
  const offerHref = routed
    ? (id: string) => `/offer-lab/${id}?layout=${routedLayout}&surface=${surface}`
    : null;

  return (
    <CtaVariantProvider
      value={{ variant: "row", offerLayout, offerSurface: surface, offerHref }}
    >
      <aside className={`ctarl ctarl--insite ${open ? "is-open" : ""}`} aria-label="Preview controls">
        <button type="button" className="ctarl__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="ctarl__dot" aria-hidden />
          In site
          <span className="ctarl__state">
            {screen === "routed"
              ? "Routed pages"
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

            {routed && (
              <div className="ctarl__group">
                <h2 className="ctarl__groupTitle">Routed page layout</h2>
                <div className="ctarl__seg" role="group" aria-label="Routed page layout">
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
