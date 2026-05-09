import Link from "next/link";
import type { ETBProject } from "@/data/work";

interface Props {
  project: ETBProject;
}

/** Standalone project detail page layout. Header + summary + four
 *  placeholder sections ready for future content. Visually quiet so the
 *  placeholder copy reads as deliberate. */
export default function ProjectDetailPage({ project }: Props) {
  return (
    <main className="etb-page">
      <Link href="/emerging-tech-builds" className="etb-page__back">
        <span aria-hidden="true">&larr;</span>
        <span>Back to Emerging Tech Builds</span>
      </Link>

      <header className="etb-page__hero">
        <span className="etb-page__category">{project.category}</span>
        <h1 className="etb-page__title">{project.name}</h1>
        <p className="etb-page__oneLiner">{project.oneLiner}</p>
        <div className="etb-page__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="etb-page__tag">{tag}</span>
          ))}
        </div>
      </header>

      <section className="etb-page__section" aria-label="Screenshots">
        <h2 className="etb-page__sectionTitle">Screenshots</h2>
        <div className="etb-page__placeholder etb-page__placeholder--media">
          Coming soon
        </div>
      </section>

      <section className="etb-page__section" aria-label="Video demo">
        <h2 className="etb-page__sectionTitle">Video demo</h2>
        <div className="etb-page__placeholder etb-page__placeholder--media">
          Coming soon
        </div>
      </section>

      <section className="etb-page__section" aria-label="Technical breakdown">
        <h2 className="etb-page__sectionTitle">Technical breakdown</h2>
        <div className="etb-page__placeholder">
          Architecture, data model, and tooling notes — coming soon.
        </div>
      </section>

      <section
        className="etb-page__section"
        aria-label="Outcomes and lessons learned"
      >
        <h2 className="etb-page__sectionTitle">Outcomes &amp; lessons learned</h2>
        <div className="etb-page__placeholder">
          What worked, what didn&rsquo;t, and what shaped the next build —
          coming soon.
        </div>
      </section>

      <Link href="/emerging-tech-builds" className="etb-page__backFooter">
        <span aria-hidden="true">&larr;</span>
        <span>Back to Emerging Tech Builds</span>
      </Link>
    </main>
  );
}
