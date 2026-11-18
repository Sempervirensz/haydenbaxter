import { useState } from 'react';
import { Reveal } from './primitives';
import { JOURNAL_THEMES, JOURNAL_ENTRIES } from '@/data/v2Content';
import { BookOpen, Quote, Globe2, ArrowRight } from 'lucide-react';

const INTERESTS = [
  'Responsible AI',
  'Ethical sourcing',
  'Technology adoption',
  'Sustainability',
  'Cross-cultural business',
  'Thoughtful leadership',
];

export function Ideas() {
  const [activeEntry, setActiveEntry] = useState(JOURNAL_ENTRIES[0].id);
  const entry = JOURNAL_ENTRIES.find((e) => e.id === activeEntry) ?? JOURNAL_ENTRIES[0];

  return (
    <section id="ideas" className="relative bg-ink-900 py-20 text-ink-50 ink-grain sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl font-light text-clay-400">E</span>
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink-50 sm:text-3xl">
                Ideas, Judgment & the Future
              </h2>
              <p className="mt-1 text-sm text-ink-400">Where strategy meets stewardship</p>
            </div>
          </div>
        </Reveal>

        {/* Interests */}
        <Reveal delay={1}>
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">Areas of interest</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-ink-700 bg-ink-800/50 px-3 py-1 text-sm text-ink-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Three themes */}
        <Reveal>
          <h3 className="mt-14 font-serif text-xl font-medium text-ink-100">Three themes</h3>
        </Reveal>
        <div className="mt-6 space-y-3">
          {JOURNAL_THEMES.map((theme, i) => (
            <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
              <div className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-800/30 px-4 py-3">
                <span className="font-mono text-sm text-clay-400 tabular-nums">{i + 1}</span>
                <p className="text-sm leading-relaxed text-ink-200">{theme}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Journal */}
        <Reveal>
          <div className="mt-14">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-clay-400" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-medium text-ink-100">Journal</h3>
              <a
                href="/blog"
                className="ml-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-clay-300 transition-colors hover:text-clay-200"
              >
                All journal posts <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Entry selector */}
          <Reveal>
            <nav className="flex flex-row flex-wrap gap-2 lg:flex-col" aria-label="Journal entries">
              {JOURNAL_ENTRIES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setActiveEntry(e.id)}
                  aria-pressed={activeEntry === e.id}
                  className={`rounded-lg border px-4 py-3 text-left transition-all ${
                    activeEntry === e.id
                      ? 'border-clay-500 bg-clay-500/10 text-ink-50'
                      : 'border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200'
                  }`}
                >
                  <p className="text-sm font-medium leading-snug">{e.title}</p>
                </button>
              ))}
            </nav>
          </Reveal>

          {/* Entry body */}
          <Reveal delay={1} key={entry.id}>
            <article className="animate-fade-in rounded-2xl border border-ink-700 bg-ink-800/30 p-6 sm:p-8">
              <div className="flex items-start gap-2 text-xs text-ink-400">
                <Globe2 size={14} className="mt-0.5 shrink-0" strokeWidth={1.5} />
                {entry.origin}
              </div>
              <h4 className="mt-3 font-serif text-2xl font-medium text-ink-50">{entry.title}</h4>
              <div className="mt-5 space-y-4">
                {entry.body.map((para, i) => (
                  <p key={i} className="leading-relaxed text-ink-300 text-pretty">
                    {i === 0 && <Quote size={16} className="mr-1 inline text-clay-400" strokeWidth={1.5} />}
                    {para}
                  </p>
                ))}
              </div>
              {entry.postSlug && (
                <a
                  href={`/blog/${entry.postSlug}`}
                  className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-clay-300 transition-colors hover:text-clay-200"
                >
                  Read the full post <ArrowRight size={14} />
                </a>
              )}
            </article>
          </Reveal>
        </div>

        {/* Closing synthesis */}
        <Reveal>
          <div className="mt-16 max-w-prose">
            <div className="rounded-2xl border border-clay-500/30 bg-clay-500/5 p-8">
              <p className="font-serif text-lg font-light italic leading-relaxed text-ink-100 text-pretty">
                Business strategy, human judgment, design, AI, and environmental stewardship are not
                separate disciplines. They are different lenses on the same problem: how to build
                things that work for people and for the planet they share. The work is bringing them
                into the same frame.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
