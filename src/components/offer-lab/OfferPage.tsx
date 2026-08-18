// An offer as a PAGE, not a panel.
//
// This is the structural argument the lab exists to test. The in-card version
// puts page-shaped content inside a fixed-height card, and every problem that
// follows is downstream of that one decision:
//
//   · content overflows the card (886–1048px of offer in a 695px frame)
//   · so it scrolls INSIDE a page that is already scrolling — nested scroll,
//     which is disorienting on a trackpad and close to unusable on a phone
//   · the photo has to be blurred and dimmed so the panel can be read, i.e.
//     the image is fighting the content rather than supporting it
//   · a bespoke "back to options" control has to exist, because a mini-SPA
//     was built inside a card
//   · and the offer has NO URL, so it cannot be linked, shared, bookmarked,
//     indexed, or returned to with the browser's own back button
//
// The last one is the serious one. A consulting offer you cannot send someone
// a link to is a business-development failure, not a styling problem.
//
// As a page: one scroll, no blur needed, real history, shareable, indexable.

import Link from "next/link";
import type { OfferLayoutId, OfferSurfaceId, PathDef } from "@/data/offerLab";
import type { OfferDirectionId, OfferTemplateModeId } from "@/data/offerDirections";
import type { OfferChromeId } from "@/data/offerDirections";
import { CTA_HINT } from "@/data/workTogether";
import OfferChoiceRow from "./OfferChoiceRow";
import OfferRender from "./OfferRender";
import "./offer-lab.css";

interface Props {
  path: PathDef;
  /** The art direction. `baseline` is the page that ships today. */
  direction: OfferDirectionId;
  layout: OfferLayoutId;
  surface: OfferSurfaceId;
  templateMode: OfferTemplateModeId;
  /** Where "back" goes. A real destination, not a state reset. */
  backHref: string;
  backLabel: string;
  /** The other two offers, so a visitor can move sideways without going back. */
  siblings: Array<{ id: string; label: string; href: string }>;
  /**
   * `expanded` reads as the Work chapter continuing: the photograph carries
   * over, the choice row travels to the top of the plate with the pressed bar
   * still lit, and the offer unfurls beneath it. No sticky back bar, no
   * sibling footer — the row is the navigation.
   *
   * `standalone` is the earlier chrome, kept switchable so the two can be
   * compared rather than argued about.
   */
  chrome: OfferChromeId;
  /** Carried onto the sibling links so switching offers keeps the treatment. */
  qs?: string;
}

export default function OfferPage({
  path,
  direction,
  layout,
  surface,
  templateMode,
  backHref,
  backLabel,
  siblings,
  chrome,
  qs = "",
}: Props) {
  const expanded = chrome === "expanded";

  // The row travels with the reader. It carries the back link and the same
  // hint the homepage uses, so nothing here is new vocabulary.
  const masthead = expanded ? (
    <div className="ofx__masthead">
      <Link href={backHref} className="ofx__back">
        <span aria-hidden="true">←</span> {backLabel}
      </Link>
      <p className="ofx__hint">{CTA_HINT}</p>
      <OfferChoiceRow current={path.id} qs={qs} />
    </div>
  ) : undefined;

  return (
    /* `data-direction` is on the PAGE CHROME, not only the screen: the
       cinematic direction opens on a full-bleed photograph, and a solid back
       bar sitting above it would put a horizon line across the top of the
       plate. The bar has to know. */
    <div
      className="ofrp"
      data-surface={surface}
      data-direction={direction}
      data-chrome={chrome}
    >
      {!expanded && (
        <header className="ofrp__bar">
          <Link href={backHref} className="ofrp__back">
            <span aria-hidden="true">←</span> {backLabel}
          </Link>
          <span className="ofrp__crumb">{path.destination.eyebrow}</span>
        </header>
      )}

      <main className="ofrp__main">
        <OfferRender
          path={path}
          direction={direction}
          layout={layout}
          surface={surface}
          templateMode={templateMode}
          idPrefix={`ofd-${path.id}`}
          masthead={masthead}
        />
      </main>

      {/* Sideways movement. The in-card model forces a visitor back to the row
          to change their mind; a page can simply offer the other two. */}
      {/* In expanded mode this footer is dead weight: the row at the top of
          the plate already offers the other two, still lit, without the reader
          having to reach the bottom of the page to find them. */}
      {!expanded && siblings.length > 0 && (
        <nav className="ofrp__siblings" aria-label="Other ways to work together">
          <p className="ofrp__siblingsTitle">Also worth a look</p>
          <div className="ofrp__siblingsRow">
            {siblings.map((s) => (
              <Link key={s.id} href={s.href} className="ofrp__sibling">
                <span>{s.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
