"use client";

// One offer, drawn in one ART DIRECTION, through its own TEMPLATE.
//
// Two axes meet here and they are deliberately independent:
//
//   `direction`  how it looks   — cinematic | chaptered | alternating |
//                                 furniture | broadsheet
//   `template`   what shape it is — service | venture | credential, which
//                                 decides which movements exist and in what
//                                 order (see src/data/offerDirections.ts)
//
// The MOVEMENTS are markup; the SKIN is CSS. A section renders the same DOM
// whichever direction is active, and `data-direction` on the root does the
// rest — so adding a sixth direction is a stylesheet, not a component.
//
// The two exceptions are the two directions that genuinely need extra DOM: the
// cinematic photo plane, and the chaptered rail. Both are additive; neither
// changes how a section itself is built.

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { OfferSurfaceId, PathDef } from "@/data/offerLab";
import { getOfferCopy, type OfferBlock } from "@/data/offerCopy";
import {
  type OfferDirectionId,
  type OfferTemplateModeId,
  type SectionDef,
  getDirection,
  getKind,
  resolveTemplate,
} from "@/data/offerDirections";
// Imported HERE, on the component that needs it — not only on the lab shell.
// A missing stylesheet does not error; it renders the markup naked while every
// structural test still passes.
import "./offer-directions.css";

interface Props {
  path: PathDef;
  direction: OfferDirectionId;
  surface: OfferSurfaceId;
  templateMode: OfferTemplateModeId;
  /** The lab renders several of these at once; ids must not collide. */
  idPrefix?: string;
  /**
   * Rendered at the TOP of the hero movement, on the plate.
   *
   * This is how the choice row travels onto the page: the shell hands it in,
   * the hero pins it to the top of the photograph and keeps its own copy at
   * the bottom. Passing it here rather than wrapping the screen means the row
   * shares the hero's plate instead of needing a second one.
   */
  masthead?: ReactNode;
}

const HERO_WIDE = "/consulting/hero-2.png";
const HERO_NARROW = "/consulting/mobile-statue.png";
const HERO_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

/* ---------------------------------------------------------------------------
   Band assignment — the Alternating direction only.

   Dark hero, paper proof, dark close. Assigned by POSITION rather than by
   section id, so it stays correct for all three templates without a table of
   special cases: the first movement and the last movement are dark, and the
   middle of the page is the paper slab.
   ------------------------------------------------------------------------ */
function bandFor(index: number, total: number): "dark" | "paper" {
  if (index === 0) return "dark";
  if (index >= total - 1) return "dark";
  return "paper";
}

export default function OfferDirectionScreen({
  path,
  direction,
  surface,
  templateMode,
  idPrefix = "ofd",
  masthead,
}: Props) {
  // The lab's copy layer, which carries the Consulting rewrite. Production
  // copy is adapted into the same shape, so one renderer serves all three.
  const d = getOfferCopy(path.id);
  const kind = getKind(path.id);
  const template = resolveTemplate(path.id, templateMode);
  const meta = getDirection(direction);
  const sections = template.sections;

  // The method statement and the ask's note are the same sentence on the
  // production shape, so it must appear exactly once: when the template
  // promotes it to a Method movement, the ask must not repeat it. The rewritten
  // Consulting copy has a distinct note, so this never fires there.
  const noteIsPromoted =
    sections.some((s) => s.id === "method") && d.method === d.ask.note;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Chapter tracking for the rail. Only the chaptered direction mounts a rail,
  // so the observer is not worth running for anything else.
  const trackChapters = direction === "chaptered";

  useEffect(() => {
    if (!trackChapters) return;
    const root = rootRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-sec-index]"));
    if (nodes.length === 0) return;

    // Reduced motion still gets an accurate rail — the rail is information,
    // not decoration. What it loses is the smooth scroll on press.
    const io = new IntersectionObserver(
      (entries) => {
        // The topmost intersecting section wins, so scrolling up and down
        // resolves to the same chapter at the same offset.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const i = Number((visible[0].target as HTMLElement).dataset.secIndex);
        if (!Number.isNaN(i)) setActiveIndex(i);
      },
      // A band across the upper-middle of the viewport: a section is "current"
      // once its top has passed the top third and before it leaves the bottom.
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [trackChapters, sections.length, path.id, templateMode]);

  const railId = `${idPrefix}-rail`;

  const renderSection = (s: SectionDef, i: number) => {
    const band = direction === "alternating" ? bandFor(i, sections.length) : undefined;
    const num = String(i + 1).padStart(2, "0");

    return (
      <section
        key={s.id}
        id={`${idPrefix}-sec-${s.id}`}
        className="ofd-sec"
        data-sec={s.id}
        data-sec-index={i}
        data-band={band}
        aria-labelledby={`${idPrefix}-sech-${s.id}`}
      >
        <header className="ofd-sec__head">
          <span className="ofd-sec__num" aria-hidden="true">
            {num}
          </span>
          <h2 className="ofd-sec__label" id={`${idPrefix}-sech-${s.id}`}>
            {s.label}
          </h2>
        </header>
        <div className="ofd-sec__body">{sectionBody(s)}</div>
      </section>
    );
  };

  function sectionBody(s: SectionDef) {
    switch (s.id) {
      case "hero":
        // The masthead is a SIBLING of the copy, not a child: the hero body is
        // a column that fills the plate and pushes these two apart, so the row
        // pins to the top of the photograph and the title stays at the bottom
        // where the scrim is strongest.
        return (
          <>
            {masthead}
            <div className="ofd-hero">
              <p className="ofd-hero__eyebrow">{d.eyebrow}</p>
              <h1 className="ofd-hero__title">{d.title}</h1>
              {/* The drop cap is a CSS ::first-letter on this element in the
                  broadsheet direction; no extra span, so the text stays one
                  selectable, screen-reader-correct run. */}
              <p className="ofd-hero__lede">{d.lede}</p>
            </div>
          </>
        );

      case "scope":
        return (
          <div className="ofd-blocks">
            {d.blocks.map((b, bi) => (
              <Block key={b.label} block={b} index={bi} />
            ))}
          </div>
        );

      // A single-block movement is ALREADY named by its chapter header — the
      // credential template's "Leadership" section rendered a "Leadership"
      // heading directly under a "Leadership" chapter label. The block's own
      // label is dropped rather than the section's, because the section
      // heading is what `aria-labelledby` points at and what the rail lists.
      case "lead":
        return (
          <div className="ofd-blocks ofd-blocks--single">
            <Block block={d.blocks[0]} index={0} showLabel={false} />
          </div>
        );

      case "audience":
        return (
          <div className="ofd-blocks ofd-blocks--single">
            <Block block={d.blocks[1]} index={1} showLabel={false} />
          </div>
        );

      case "method":
        // The note IS a method statement for a service, so it is set as one
        // rather than shrunk into a footnote above the buttons.
        return (
          <blockquote className="ofd-method">
            <p className="ofd-method__text">{d.method}</p>
          </blockquote>
        );

      case "engagements":
        // Signals as things you can actually buy — the service template's
        // reading of the same strip the credential template treats as proof.
        return (
          <ul className="ofd-engagements" aria-label="Engagements">
            {(d.signals ?? []).map((sig, si) => (
              <li key={sig} className="ofd-engagement">
                <span className="ofd-engagement__num" aria-hidden="true">
                  {String(si + 1).padStart(2, "0")}
                </span>
                <span className="ofd-engagement__name">{sig}</span>
              </li>
            ))}
          </ul>
        );

      case "why":
        // Credentials as one paragraph. The old chip strip shredded a sentence
        // that reads as a single claim — a degree, a language and eight years
        // are one argument, not five tags.
        return (
          <div className="ofd-why">
            <p className="ofd-why__text">{d.why?.text}</p>
          </div>
        );

      case "proof":
        return (
          <ul className="ofd-proof" aria-label="Credentials">
            {(d.signals ?? []).map((sig) => (
              <li key={sig} className="ofd-proof__item">
                {sig}
              </li>
            ))}
          </ul>
        );

      case "ask":
        return (
          <div className="ofd-ask">
            {!noteIsPromoted && <p className="ofd-ask__note">{d.ask.note}</p>}
            <div className="ofd-ask__actions">
              {d.ask.actions.map((a, ai) => (
                <a
                  key={a.label}
                  // `peers` is declared by the copy, not inferred from the
                  // count — Consulting and Experience both have two actions but
                  // only Consulting's are equal front doors. Demoting one of
                  // those would tell half the audience they are the
                  // afterthought; flattening Experience's would erase a real
                  // hierarchy.
                  className={`ofd-action ${
                    d.ask.peers || ai === 0
                      ? "ofd-action--primary"
                      : "ofd-action--ghost"
                  }`}
                  href={a.href}
                  {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="ofd-action__label">{a.label}</span>
                  <span className="ofd-action__chev" aria-hidden="true">
                    ›
                  </span>
                </a>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    /* The container is this WRAPPER. A container query never matches the
       element that establishes the container, so `container-type` must not go
       on `.ofd` — every `@container` rule targeting `.ofd[data-direction=...]`
       would silently do nothing while descendant rules kept working, which is
       the failure mode that cost a thread last time. */
    <div className="ofd-shell">
      <article
        ref={rootRef}
        className="ofd"
        data-direction={direction}
        data-surface={surface}
        data-kind={kind}
        data-template={templateMode}
        /* Declared on the root rather than sniffed with `:has(~ ...)`: the
           plate is a SIBLING of the flow that contains the row, so matching it
           structurally meant a selector that broke the moment anything was
           nested differently. */
        data-masthead={masthead ? "true" : undefined}
      >
        {meta.usesPhoto && (
          <div className="ofd__plate" aria-hidden="true">
            <picture>
              <source media="(max-width: 640px)" srcSet={HERO_NARROW} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ofd__plateImg" src={HERO_WIDE} alt="" />
            </picture>
            <span className="ofd__plateScrim" />
            <span className="ofd__plateGrain" />
          </div>
        )}

        {trackChapters && (
          <nav className="ofd-rail" aria-label="Sections" id={railId}>
            <ol className="ofd-rail__list">
              {sections.map((s, i) => (
                <li key={s.id} className="ofd-rail__item">
                  <a
                    className={`ofd-rail__link ${i === activeIndex ? "is-current" : ""}`}
                    href={`#${idPrefix}-sec-${s.id}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                  >
                    <span className="ofd-rail__tick" aria-hidden="true" />
                    <span className="ofd-rail__num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ofd-rail__name">{s.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="ofd__flow">{sections.map(renderSection)}</div>
      </article>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   A labelled block. Same DOM in every direction — the Furniture direction
   turns the items into candy bars purely in CSS, which is why they must not
   be buttons: in the CTA row that object is a control, and it is a false
   affordance the moment it stops navigating.
   ------------------------------------------------------------------------ */
function Block({
  block,
  index,
  showLabel = true,
}: {
  block: OfferBlock;
  index: number;
  /** False when the section header already carries this block's name. */
  showLabel?: boolean;
}) {
  const items = block.items ?? [];
  return (
    <div className="ofd-block" data-block-index={index}>
      {showLabel && <h3 className="ofd-block__label">{block.label}</h3>}
      <p className="ofd-block__desc">{block.descriptor}</p>

      {items.length > 0 && (
        <ul className="ofd-block__list">
          {items.map((item) => (
            <li key={item} className="ofd-block__item">
              <span className="ofd-block__itemText">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* The capability's own way in. A quiet text link rather than a plate:
          the page already ends in two plates, and three competing buttons per
          screen is how an offer page stops having an obvious next move. */}
      {block.action && (
        <a
          className="ofd-block__action"
          href={block.action.href}
          {...(block.action.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <span>{block.action.label}</span>
          <span className="ofd-block__actionChev" aria-hidden="true">
            ›
          </span>
        </a>
      )}
    </div>
  );
}
