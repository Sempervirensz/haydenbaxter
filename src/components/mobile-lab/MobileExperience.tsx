"use client";

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENTAL — Mobile-native homepage flow (/mobile-lab)
//
// V2 — assembled from the site's real visual identity:
//   wordmark + glass menu → centered editorial hero → playing-card shortcuts
//   (flip as you visit — the mobile soft-lock ritual) → brands carousel
//   (production component) → CD player landing (suede + Discman, disc as a
//   scroll scrubber) → four full detail sections styled like the deployed
//   mobile Work screens → compact About beat → Connect with DYMO tags +
//   Calendly link.
//
// Scroll progress is written to CSS vars on the frame element (--mlab-spin,
// --mlab-progress) — one DOM write per frame, zero React re-renders. The
// landing disc and the mini dock both consume them, mirroring the production
// --cd-deg pattern.
//
// `cdMode` selects the CD experiment:
//   "player"      — CD player landing only (site-native)
//   "player-dock" — landing + sticky mini-disc companion w/ progress ring
//   "off"         — no CD at all (comprehension baseline)
//
// [PROMOTABLE]: section structure/styling, deferred globe, timeline rail.
// [EXPERIMENT]: CD modes, card strip, lab wiring. See NOTES.md.
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import BrandsCarousel from "@/components/BrandsCarousel";
import { CONNECT_LINKS, WECHAT_ID, CALENDLY_URL } from "@/data/connect";
import { JOURNEY_STOPS } from "@/data/scLab";
import { MOBILE_LAB, type MobileTrackId } from "@/data/mobileLab";
import { CdPlayerLanding, CdMiniDock, TrackSheet } from "./CdArtifact";
import GlobeModule from "./GlobeModule";

export type CdMode = "player" | "player-dock" | "off";

const TRACK_IDS: MobileTrackId[] = ["worldpulse", "etb", "supply", "consulting"];

export default function MobileExperience({ cdMode }: { cdMode: CdMode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<MobileTrackId | null>(null);
  const [visited, setVisited] = useState<Set<MobileTrackId>>(new Set());
  const [landingInView, setLandingInView] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);

  // Scroll progress → CSS vars on the frame (disc scrubber + dock ring).
  // Direct DOM writes; no state, no re-renders. Reduced motion: no spin.
  useEffect(() => {
    const el = scrollRef.current;
    const frame = el?.parentElement;
    if (!el || !frame || cdMode === "off") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = el.scrollHeight - el.clientHeight;
        const p = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
        frame.style.setProperty("--mlab-progress", p.toFixed(4));
        if (!reduced) {
          // Two full revolutions across the page — readable but calm.
          frame.style.setProperty("--mlab-spin", `${(p * 720).toFixed(1)}deg`);
        }
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cdMode]);

  // Track the section currently in view. Visiting a section flips its card.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("mlab-", "") as MobileTrackId;
            setActiveTrack(id);
            setVisited((prev) => {
              if (prev.has(id)) return prev;
              const next = new Set(prev);
              next.add(id);
              return next;
            });
          }
        }
      },
      { root: el, rootMargin: "-30% 0px -55% 0px" },
    );
    TRACK_IDS.forEach((id) => {
      const section = el.querySelector(`#mlab-${id}`);
      if (section) io.observe(section);
    });
    return () => io.disconnect();
  }, []);

  // Hide the mini dock while the big player is on screen — one CD at a time.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || cdMode !== "player-dock") return;
    const landing = el.querySelector(".mlab-landing");
    if (!landing) return;
    const io = new IntersectionObserver(
      ([entry]) => setLandingInView(entry.isIntersecting),
      { root: el, threshold: 0.15 },
    );
    io.observe(landing);
    return () => io.disconnect();
  }, [cdMode]);

  const jumpTo = useCallback((id: MobileTrackId) => {
    const container = scrollRef.current;
    const target = container?.querySelector<HTMLElement>(`#mlab-${id}`);
    if (!container || !target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Offset of the section within the scroll container's content (offsetTop
    // can't be used directly — intermediate wrappers are positioned).
    const offsetOf = () =>
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;
    if (reduced) {
      container.scrollTop = Math.max(0, offsetOf());
      return;
    }
    // Native smooth scrolling gets aborted by concurrent layout work, so
    // drive the scroll manually, re-reading the target offset every frame.
    const start = performance.now();
    const from = container.scrollTop;
    const DURATION = 480;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      container.scrollTop = from + (Math.max(0, offsetOf()) - from) * ease(t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const { header, hero, cardStrip, worldpulse, etb, supply, consulting, about, connect } =
    MOBILE_LAB;
  const allVisited = visited.size === TRACK_IDS.length;

  return (
    <>
      <div className="mlab-scroll" ref={scrollRef}>
        {/* ── Top bar: wordmark + glass menu (opens the track sheet) ── */}
        <header className="mlab-topbar">
          <span className="mlab-wordmark">{header.wordmark}</span>
          <button
            type="button"
            className="mlab-menu"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-label="Open track list"
            onClick={() => setSheetOpen(true)}
          >
            <span className="mlab-menu-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </header>

        {/* ── Hero: centered editorial, production copy ── */}
        <section className="mlab-hero" id="mlab-hero">
          <p className="mlab-hero-eyebrow">{hero.eyebrow}</p>
          <h1>{hero.heading}</h1>
          <div className="mlab-hero-ctas">
            {hero.ctas.map((cta) =>
              cta.href.startsWith("#") ? (
                <button
                  key={cta.label}
                  type="button"
                  className={cta.cta ? "tag tag--cta" : "tag"}
                  onClick={() => {
                    const el = scrollRef.current?.querySelector("#mlab-connect");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {cta.label}
                </button>
              ) : (
                <a key={cta.label} href={cta.href} className={cta.cta ? "tag tag--cta" : "tag"}>
                  {cta.label}
                </a>
              ),
            )}
          </div>
          <ul className="mlab-proof" aria-label="Background">
            {hero.proof.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          {/* Playing-card shortcuts — flip face-up as sections are visited */}
          <div className="mlab-cards" role="group" aria-label="Section shortcuts">
            {cardStrip.cards.map((card, i) => {
              const flipped = visited.has(card.track);
              return (
                <button
                  key={card.track}
                  type="button"
                  className="mlab-card"
                  data-flipped={flipped}
                  style={{ "--tilt": `${card.tilt}deg` } as React.CSSProperties}
                  aria-label={`${card.title} — go to ${MOBILE_LAB.landing.tracks[i].name}`}
                  onClick={() => jumpTo(card.track)}
                >
                  <span className="mlab-card-inner">
                    <img className="mlab-card-back" src={card.back} alt="" width={200} height={282} />
                    <img
                      className="mlab-card-face"
                      src={card.face}
                      alt=""
                      width={200}
                      height={282}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <span className="mlab-cards-caption" aria-hidden="true">
            {allVisited ? cardStrip.captionDone : cardStrip.caption}
          </span>
        </section>

        {/* ── Brands: the production carousel, untouched ── */}
        <BrandsCarousel />

        {/* ── CD player landing (the Work intro) ── */}
        {cdMode !== "off" && (
          <CdPlayerLanding activeTrack={activeTrack} onSelect={jumpTo} />
        )}

        {/* ── 01 WorldPulse ── */}
        <section className="mlab-detail" id="mlab-worldpulse">
          <header className="mlab-detail-head">
            <span className="mlab-detail-num">{worldpulse.number}</span>
            {worldpulse.logo ? (
              <img
                className="mlab-detail-logo"
                src={worldpulse.logo.src}
                alt={worldpulse.logo.alt}
              />
            ) : (
              <h2 className="mlab-detail-name">WorldPulse</h2>
            )}
            <span className="mlab-detail-line" />
          </header>
          <p className="mlab-detail-kicker">{worldpulse.kicker}</p>
          <div className="mlab-wp-copy">
            {worldpulse.caption.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <figure className="mlab-wp-photo">
            <img
              src={worldpulse.photo}
              alt="WorldPulse — product storytelling on the coast"
              width={1600}
              height={679}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="mlab-pill" aria-hidden="true">
              {worldpulse.tagline.join(" ")}
            </figcaption>
          </figure>
          <a
            className="mlab-detail-link"
            href={worldpulse.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {worldpulse.link.label} <span aria-hidden="true">→</span>
          </a>
        </section>

        {/* ── 02 Emerging Tech Builds ── */}
        <section className="mlab-detail" id="mlab-etb">
          <header className="mlab-detail-head">
            <span className="mlab-detail-num">{etb.number}</span>
            <h2 className="mlab-detail-name">{etb.name}</h2>
            <span className="mlab-detail-line" />
          </header>
          <p className="mlab-detail-kicker">{etb.credibilityLine}</p>
          <p className="mlab-detail-intro">{etb.intro}</p>
          <div className="mlab-tapes">
            {etb.projects.map((p) => {
              const inner = (
                <>
                  <span className="mlab-tape-top">
                    <span className="mlab-tape-name">{p.name}</span>
                    <span className="mlab-tape-chevron" aria-hidden="true">
                      ›
                    </span>
                  </span>
                  <span className="mlab-tape-sub">
                    {p.comingSoon ? "Coming soon" : p.oneLiner}
                  </span>
                </>
              );
              return p.href ? (
                <a key={p.id} className="mlab-tape" href={p.href}>
                  {inner}
                </a>
              ) : (
                <span key={p.id} className="mlab-tape mlab-tape--soon">
                  {inner}
                </span>
              );
            })}
          </div>
          <a className="mlab-detail-link" href={etb.allLink.href}>
            {etb.allLink.label} <span aria-hidden="true">→</span>
          </a>
        </section>

        {/* ── 03 Supply Chain ── */}
        <section className="mlab-detail" id="mlab-supply">
          <header className="mlab-detail-head">
            <span className="mlab-detail-num">{supply.number}</span>
            <h2 className="mlab-detail-name">{supply.name}</h2>
            <span className="mlab-detail-line" />
          </header>
          <p className="mlab-detail-intro">{supply.intro}</p>
          <GlobeModule />
          {/* Journey timeline — the production mobile sc-journey rail */}
          <ol className="mlab-tl">
            {JOURNEY_STOPS.map((stop) => (
              <li className="mlab-tl-stop" key={stop.id}>
                <span className="mlab-tl-dot" aria-hidden="true" />
                <span className="mlab-tl-meta">
                  {stop.year} · {stop.label}
                </span>
                <h3 className="mlab-tl-headline">{stop.headline}</h3>
                <p className="mlab-tl-body">{stop.description}</p>
              </li>
            ))}
          </ol>
          <ul className="mlab-quotes" aria-label="Highlights">
            {supply.quoteLines.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>

        {/* ── 04 Consulting ── */}
        <section className="mlab-detail mlab-detail--cns" id="mlab-consulting">
          <header className="mlab-detail-head">
            <span className="mlab-detail-num">{consulting.number}</span>
            <h2 className="mlab-detail-name">{consulting.name}</h2>
            <span className="mlab-detail-line" />
          </header>
          <figure className="mlab-cns-photo">
            <img
              src={consulting.photo}
              alt=""
              aria-hidden="true"
              width={900}
              height={2000}
              loading="lazy"
              decoding="async"
            />
            {/* Production behavior: the pill reveals the offers */}
            <button
              type="button"
              className="mlab-pill mlab-pill--btn"
              aria-expanded={offersOpen}
              aria-controls="mlab-offers"
              onClick={() => setOffersOpen((v) => !v)}
            >
              {consulting.pill.join(" ")}
            </button>
          </figure>
          <p className="mlab-cns-title">{consulting.heroTitle}</p>
          <p className="mlab-detail-intro">{consulting.heroSubtitle}</p>
          <div className="mlab-reveal" id="mlab-offers" data-open={offersOpen}>
            <div>
              <div className="mlab-tapes">
                {consulting.offers.map((o) => (
                  <span key={o.title} className="mlab-tape mlab-tape--static">
                    <span className="mlab-tape-top">
                      <span className="mlab-tape-name">{o.title}</span>
                    </span>
                    <span className="mlab-tape-sub">{o.oneLiner}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mlab-detail-kicker">{consulting.identityLine}</p>
        </section>

        {/* ── About: one line + photo strip from the production gallery ── */}
        <section className="mlab-about" id="mlab-about">
          <span className="mlab-kicker">{about.heading}</span>
          <p>{about.line}</p>
          <div className="mlab-about-photos">
            {about.photos.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </section>

        {/* ── Connect ── */}
        <section className="mlab-connect" id="mlab-connect">
          <h2>{connect.heading}</h2>
          <div className="mlab-connect-grid">
            {CONNECT_LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.id}
                  href={link.href}
                  className="tag"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                </a>
              ) : (
                <span key={link.id} className="tag">
                  {link.label} <span className="mlab-connect-id">{WECHAT_ID}</span>
                </span>
              ),
            )}
          </div>
          <a
            className="tag tag--cta"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a Call
          </a>
        </section>
      </div>

      {/* Grain sits above the scroller, below the dock/sheet. */}
      <div className="mlab-grain" aria-hidden="true" />

      {/* Sheet is available in every mode via the glass menu button. */}
      {sheetOpen && (
        <TrackSheet
          activeTrack={activeTrack}
          onSelect={jumpTo}
          onClose={() => setSheetOpen(false)}
        />
      )}
      {cdMode === "player-dock" && (
        <CdMiniDock
          hidden={landingInView}
          sheetOpen={sheetOpen}
          onOpen={() => setSheetOpen(true)}
        />
      )}
    </>
  );
}
