import { useState } from 'react';
import { Lightbulb, Wrench, Heart, GraduationCap } from 'lucide-react';
import { AI_PROJECTS } from '@/data/v2Content';
import { Reveal, StatusBadge } from './primitives';

export function Builder() {
  const [activeId, setActiveId] = useState(AI_PROJECTS[0].id);
  const active = AI_PROJECTS.find((p) => p.id === activeId) ?? AI_PROJECTS[0];

  return (
    <section id="builder" className="relative bg-ink-100/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl font-light text-clay-500">C</span>
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
                The AI Builder
              </h2>
              <p className="mt-1 text-sm text-ink-500">From research systems to legal intelligence</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <p className="mt-8 max-w-prose text-pretty leading-relaxed text-ink-600">
            Five projects, each exploring a different intersection of AI and practical need.
            Working products, prototypes, and in-development concepts are clearly distinguished.
            No clients, revenue, or adoption metrics are claimed.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Project selector */}
          <Reveal>
            <nav className="flex flex-row flex-wrap gap-2 lg:flex-col" aria-label="AI projects">
              {AI_PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  aria-pressed={activeId === p.id}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                    activeId === p.id
                      ? 'border-ink-900 bg-ink-900 text-ink-50'
                      : 'border-ink-200 bg-white/40 text-ink-700 hover:border-ink-400'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-serif text-base font-medium">{p.name}</p>
                    <p className={`truncate text-xs ${activeId === p.id ? 'text-ink-300' : 'text-ink-500'}`}>
                      {p.tagline}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </Reveal>

          {/* Project detail */}
          <Reveal delay={1} key={active.id}>
            <div className="animate-fade-in rounded-2xl border border-ink-200 bg-white/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-3xl font-medium text-ink-900">{active.name}</h3>
                  <p className="mt-1 text-lg text-ink-500">{active.tagline}</p>
                </div>
                <StatusBadge status={active.status} />
              </div>

              {/* Narrative blocks */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <NarrativeBlock icon={Lightbulb} label="Problem" text={active.problem} accent="clay" />
                <NarrativeBlock icon={Wrench} label="Approach" text={active.approach} accent="sea" />
                <NarrativeBlock icon={Heart} label="Value" text={active.value} accent="gold" />
                <NarrativeBlock icon={GraduationCap} label="Lessons" text={active.lessons} accent="clay" />
              </div>

              {/* Pillars */}
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Core pillars</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {active.pillars.map((pillar) => (
                    <div key={pillar.label} className="rounded-lg border border-ink-200 bg-ink-50/60 px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">{pillar.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{pillar.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function NarrativeBlock({
  icon: Icon,
  label,
  text,
  accent,
}: {
  icon: typeof Lightbulb;
  label: string;
  text: string;
  accent: 'clay' | 'sea' | 'gold';
}) {
  const colors = {
    clay: 'text-clay-600',
    sea: 'text-sea-600',
    gold: 'text-gold-600',
  };
  return (
    <div>
      <div className={`flex items-center gap-2 ${colors[accent]}`}>
        <Icon size={18} strokeWidth={1.5} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{text}</p>
    </div>
  );
}
