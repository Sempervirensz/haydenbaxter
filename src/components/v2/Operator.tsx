import { useState } from 'react';
import { ChevronDown, MapPin, Wrench, TrendingUp } from 'lucide-react';
import { EXPERIENCES } from '@/data/v2Content';
import { Reveal, Pill } from './primitives';
import { SupplierDemo } from './SupplierDemo';

export function Operator() {
  const [openId, setOpenId] = useState<string>(EXPERIENCES[0].id);

  return (
    <section id="operator" className="relative bg-ink-50 py-20 paper-grain sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl font-light text-clay-500">B</span>
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
                The Global Operator
              </h2>
              <p className="mt-1 text-sm text-ink-500">Eight years across sourcing & supply</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <p className="mt-8 max-w-prose text-pretty text-base leading-relaxed text-ink-600">
            The problems, decisions, and value behind each role rather than a list of
            responsibilities. Select an experience to inspect it more closely.
          </p>
        </Reveal>

        {/* Accordion of experiences */}
        <div className="mt-12 space-y-3">
          {EXPERIENCES.map((exp, i) => {
            const isOpen = openId === exp.id;
            return (
              <Reveal key={exp.id} delay={(i % 3) as 0 | 1 | 2}>
                <div className="overflow-hidden rounded-xl border border-ink-200 bg-white/50">
                  <button
                    onClick={() => setOpenId(isOpen ? '' : exp.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-ink-100/50"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-ink-500 tabular-nums">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl font-medium text-ink-900">{exp.company}</h3>
                        <p className="text-sm text-ink-500">
                          {exp.role} <span className="text-ink-300">/</span> {exp.region}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-ink-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-ink-200 px-6 py-6">
                      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        {/* Details */}
                        <div className="space-y-5">
                          <p className="text-pretty leading-relaxed text-ink-700">{exp.summary}</p>
                          <div className="space-y-4">
                            {exp.details.map((d) => (
                              <div key={d.heading} className="border-l-2 border-clay-300 pl-4">
                                <p className="text-sm font-semibold text-ink-900">{d.heading}</p>
                                <p className="mt-1 text-sm leading-relaxed text-ink-600">{d.body}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-start gap-2 rounded-lg bg-sea-50 px-4 py-3">
                            <TrendingUp size={18} className="mt-0.5 shrink-0 text-sea-600" strokeWidth={1.5} />
                            <p className="text-sm font-medium text-sea-800">{exp.outcome}</p>
                          </div>
                        </div>

                        {/* Side panel: tools + region */}
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                              <Wrench size={14} strokeWidth={1.5} /> Tools & methods
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {exp.tools.map((tool) => (
                                <Pill key={tool} tone="sea">{tool}</Pill>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                              <MapPin size={14} strokeWidth={1.5} /> Geography
                            </div>
                            <p className="mt-2 text-sm text-ink-600">{exp.region}</p>
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                              Focus
                            </div>
                            <p className="mt-2 text-sm text-ink-600">{exp.focus}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Interactive supplier decision demo */}
        <Reveal>
          <SupplierDemo />
        </Reveal>
      </div>
    </section>
  );
}
