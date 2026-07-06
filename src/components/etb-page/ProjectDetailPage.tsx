import Link from "next/link";
import type { ETBDemoDetail, ETBProject } from "@/data/work";
import DemoScreenshots from "@/components/etb-page/DemoScreenshots";
import DemoStats from "@/components/etb-page/DemoStats";

interface Props {
  project: ETBProject;
}

/** Standalone project detail page layout. When a project has `demo` content
 *  it renders a real showcase (screenshots + write-up); otherwise it falls
 *  back to quiet placeholder sections that read as deliberate. */
export default function ProjectDetailPage({ project }: Props) {
  const heroCategory = project.demo?.heroCategory ?? project.category;

  return (
    <main className="etb-page">
      <Link href="/emerging-tech-builds" className="etb-page__back">
        <span aria-hidden="true">&larr;</span>
        <span>Back to Emerging Tech Builds</span>
      </Link>

      <header className="etb-page__hero">
        {project.mark ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="etb-page__mark"
            src={project.mark.src}
            alt={project.mark.alt}
            width={project.mark.width}
            height={project.mark.height}
          />
        ) : null}
        <span className="etb-page__category">{heroCategory}</span>
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
      {demo.disclaimer || demo.badge ? (
        <aside className="etb-page__demoNote" role="note">
          {demo.badge ? (
            <span className="etb-page__demoBadge">{demo.badge}</span>
          ) : null}
          {demo.disclaimer ? (
            <p className="etb-page__demoNoteText">{demo.disclaimer}</p>
          ) : null}
        </aside>
      ) : null}

      {/* Opening project story */}
      {demo.story && demo.story.length > 0 ? (
        <div className="etb-page__story">
          {demo.story.map((para, i) => (
            <p key={i} className="etb-page__storyPara">{para}</p>
          ))}
        </div>
      ) : demo.summary ? (
        <p className="etb-page__lede">{demo.summary}</p>
      ) : null}

      {demo.principle ? (
        <blockquote className="etb-page__principle">
          {demo.principle}
        </blockquote>
      ) : null}

      {/* Metric cards */}
      {demo.stats && demo.stats.length > 0 ? (
        <DemoStats stats={demo.stats} />
      ) : null}

      <div className="etb-page__acc">
        {/* Screenshots — ordered to tell one story */}
        {demo.screenshots.length > 0 ? (
          <details className="etb-page__accItem" open>
            <summary className="etb-page__accHead">Screenshots</summary>
            <div className="etb-page__accBody">
              <DemoScreenshots screenshots={demo.screenshots} />
            </div>
          </details>
        ) : null}

        {/* How AtomicOS works */}
        {demo.howItWorks && demo.howItWorks.length > 0 ? (
          <details className="etb-page__accItem" open>
            <summary className="etb-page__accHead">How {projectName} works</summary>
            <div className="etb-page__accBody">
              <ol className="etb-page__steps">
                {demo.howItWorks.map((step, i) => (
                  <li key={step.title} className="etb-page__step">
                    <span className="etb-page__stepNum" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="etb-page__stepText">
                      <h3 className="etb-page__stepTitle">{step.title}</h3>
                      <p className="etb-page__stepBody">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        ) : null}

        {/* What makes it different */}
        {demo.differentiators && demo.differentiators.length > 0 ? (
          <details className="etb-page__accItem" open>
            <summary className="etb-page__accHead">
              What makes it different
            </summary>
            <div className="etb-page__accBody">
              <ul className="etb-page__diffs">
                {demo.differentiators.map((item) => (
                  <li key={item.title} className="etb-page__diff">
                    <h3 className="etb-page__diffTitle">{item.title}</h3>
                    <p className="etb-page__diffBody">{item.body}</p>
                  </li>
                ))}
              </ul>
              {demo.differentiatorsNote ? (
                <p className="etb-page__diffNote">{demo.differentiatorsNote}</p>
              ) : null}
            </div>
          </details>
        ) : null}

        {/* Technical breakdown */}
        {demo.techSections && demo.techSections.length > 0 ? (
          <details className="etb-page__accItem">
            <summary className="etb-page__accHead">Technical breakdown</summary>
            <div className="etb-page__accBody">
              <div className="etb-page__techGroups">
                {demo.techSections.map((sec) => (
                  <div key={sec.title} className="etb-page__techGroup">
                    <h3 className="etb-page__techTitle">{sec.title}</h3>
                    <p className="etb-page__techBody">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ) : (
          <AccordionList title="Technical breakdown" items={demo.techBreakdown} />
        )}

        <AccordionList title="Outcomes" items={demo.outcomes} />
        <AccordionList title="Lessons learned" items={demo.lessonsLearned} />

        {/* Honest limitations */}
        {demo.limitations && demo.limitations.length > 0 ? (
          <AccordionList title="Honest limitations" items={demo.limitations} />
        ) : null}
      </div>
    </>
  );
}

function AccordionList({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <details className="etb-page__accItem">
      <summary className="etb-page__accHead">{title}</summary>
      <div className="etb-page__accBody">
        <ul className="etb-page__list">
          {items.map((item) => (
            <li key={item} className="etb-page__listItem">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </details>
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
