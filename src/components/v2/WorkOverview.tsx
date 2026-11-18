import { MapPin, ArrowRight } from 'lucide-react';
import { EXPERIENCES } from '@/data/v2Content';
import { Reveal, SectionLabel, Pill } from './primitives';
import { scrollBehavior } from './hooks';

export function WorkOverview() {
  return (
    <section id="work" className="relative bg-ink-100/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel title="Selected Work" subtitle="Professional experience across global operations" />
        </Reveal>

        <div className="mt-12 space-y-6">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <article className="group rounded-xl border border-ink-200 bg-white/50 p-6 transition-all hover:border-clay-300 hover:shadow-md sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                  {/* Left: company + role */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-ink-400">
                      <MapPin size={14} strokeWidth={1.5} />
                      {exp.region}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-ink-900">{exp.company}</h3>
                    <p className="mt-1 text-sm font-semibold text-clay-600">{exp.role}</p>
                    <p className="mt-1 text-sm text-ink-500">{exp.focus}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.tools.map((tool) => (
                        <Pill key={tool}>{tool}</Pill>
                      ))}
                    </div>
                  </div>

                  {/* Right: summary + details */}
                  <div>
                    <p className="text-pretty text-base leading-relaxed text-ink-700">{exp.summary}</p>
                    <div className="mt-4 space-y-3">
                      {exp.details.map((d) => (
                        <div key={d.heading}>
                          <p className="text-sm font-semibold text-ink-800">{d.heading}</p>
                          <p className="text-sm leading-relaxed text-ink-600">{d.body}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 border-l-2 border-sea-400 pl-3 text-sm font-medium text-sea-700">
                      {exp.outcome}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Link to full chapter */}
        <Reveal>
          <div className="mt-10 text-center">
            <button
              onClick={() => document.getElementById('operator')?.scrollIntoView({ behavior: scrollBehavior() })}
              className="inline-flex items-center gap-2 text-sm font-semibold text-clay-600 transition-colors hover:text-clay-700"
            >
              Explore the full operator chapter <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
