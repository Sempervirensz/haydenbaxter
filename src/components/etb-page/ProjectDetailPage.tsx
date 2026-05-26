import Link from "next/link";
import type { ETBDemoDetail, ETBProject } from "@/data/work";
import DemoScreenshots from "@/components/etb-page/DemoScreenshots";

interface Props {
  project: ETBProject;
}

/** Standalone project detail page layout. When a project has `demo` content
 *  it renders a real showcase (screenshots + write-up); otherwise it falls
 *  back to quiet placeholder sections that read as deliberate. */
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

      {project.demo ? (
        <DemoShowcase demo={project.demo} projectName={project.name} />
      ) : (
        <PlaceholderSections />
      )}

      <Link href="/emerging-tech-builds" className="etb-page__backFooter">
        <span aria-hidden="true">&larr;</span>
        <span>Back to Emerging Tech Builds</span>
      </Link>
    </main>
  );
}

function DemoShowcase({
  demo,
  projectName,
}: {
  demo: ETBDemoDetail;
  projectName: string;
}) {
  return (
    <>
      <aside className="etb-page__demoNote" role="note">
        {demo.badge ? (
          <span className="etb-page__demoBadge">{demo.badge}</span>
        ) : null}
        <p className="etb-page__demoNoteText">{demo.disclaimer}</p>
      </aside>

      {demo.summary ? (
        <p className="etb-page__lede">{demo.summary}</p>
      ) : null}

      {demo.liveUrl ? (
        <a
          className="etb-page__cta"
          href={demo.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{demo.liveLabel ?? "Open live demo"}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      ) : null}

      <section className="etb-page__section" aria-label="Screenshots">
        <h2 className="etb-page__sectionTitle">Screenshots</h2>
        <DemoScreenshots screenshots={demo.screenshots} />
      </section>

      <DetailList
        title="Technical breakdown"
        label="Technical breakdown"
        items={demo.techBreakdown}
      />
      <DetailList title="Outcomes" label="Outcomes" items={demo.outcomes} />
      <DetailList
        title="Lessons learned"
        label="Lessons learned"
        items={demo.lessonsLearned}
      />

      <p className="etb-page__demoFootnote">
        {projectName} demo · synthetic sample data only — not the live app
        interface.
      </p>
    </>
  );
}

function DetailList({
  title,
  label,
  items,
}: {
  title: string;
  label: string;
  items: string[];
}) {
  return (
    <section className="etb-page__section" aria-label={label}>
      <h2 className="etb-page__sectionTitle">{title}</h2>
      <ul className="etb-page__list">
        {items.map((item) => (
          <li key={item} className="etb-page__listItem">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlaceholderSections() {
  return (
    <>
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
    </>
  );
}
