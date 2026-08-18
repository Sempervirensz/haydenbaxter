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
import OfferScreen from "./OfferScreen";
import "./offer-lab.css";

interface Props {
  path: PathDef;
  layout: OfferLayoutId;
  surface: OfferSurfaceId;
  /** Where "back" goes. A real destination, not a state reset. */
  backHref: string;
  backLabel: string;
  /** The other two offers, so a visitor can move sideways without going back. */
  siblings: Array<{ id: string; label: string; href: string }>;
}

export default function OfferPage({
  path,
  layout,
  surface,
  backHref,
  backLabel,
  siblings,
}: Props) {
  return (
    <div className="ofrp" data-surface={surface}>
      <header className="ofrp__bar">
        <Link href={backHref} className="ofrp__back">
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
        <span className="ofrp__crumb">{path.destination.eyebrow}</span>
      </header>

      <main className="ofrp__main">
        <OfferScreen path={path} layout={layout} surface={surface} />
      </main>

      {/* Sideways movement. The in-card model forces a visitor back to the row
          to change their mind; a page can simply offer the other two. */}
      {siblings.length > 0 && (
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
