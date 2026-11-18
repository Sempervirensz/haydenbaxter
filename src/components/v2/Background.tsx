import { GraduationCap, Languages, Globe2, Briefcase, Sparkles } from 'lucide-react';
import { PROFILE } from '@/data/v2Content';
import { Reveal, SectionLabel, Rule } from './primitives';

const QUICK_FACTS = [
  { icon: Briefcase, label: 'Experience', value: '8+ years across sourcing, procurement & logistics' },
  { icon: GraduationCap, label: 'Education', value: 'MS AI in Business (ASU) \u00b7 BS Global Business & Mandarin (USU)' },
  { icon: Languages, label: 'Languages', value: 'Fluent in Mandarin Chinese' },
  { icon: Globe2, label: 'Reach', value: 'Direct factory experience in China \u00b7 expansion into Vietnam & Indonesia' },
  { icon: Sparkles, label: 'Focus', value: 'AI product building \u00b7 supply chain transparency \u00b7 sustainability' },
];

const SKILL_AREAS = [
  {
    title: 'Global Sourcing & Procurement',
    items: ['Supplier onboarding', 'Data governance', 'Traceability', 'SAP / Aravo', 'Canton Fair sourcing', 'Factory audits'],
  },
  {
    title: 'Logistics & Operations',
    items: ['Warehouse expansion', 'Inventory systems', 'Wayfair operations', 'Cross-border coordination', 'Manufacturing expansion'],
  },
  {
    title: 'AI Product Building',
    items: ['Knowledge systems', 'Conversational AI', 'Structured data extraction', 'Agentic workflows', 'Retrieval & provenance', 'Analytics'],
  },
  {
    title: 'Strategy & Translation',
    items: ['Cross-cultural negotiation', 'East\u2013West bridging', 'Compliance \u2192 business value', 'Supplier evaluation', 'Sustainability strategy'],
  },
];

export function Background() {
  return (
    <section id="background" className="relative bg-ink-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel title="Background" subtitle="Five-minute orientation" />
        </Reveal>

        {/* Quick facts grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {QUICK_FACTS.map((fact, i) => (
            <Reveal key={fact.label} delay={(i % 5) as 0 | 1 | 2 | 3 | 4}>
              <div className="h-full rounded-xl border border-ink-200 bg-white/40 p-5">
                <fact.icon size={20} className="text-clay-500" strokeWidth={1.5} />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
                  {fact.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{fact.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Education + Philosophy */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h3 className="font-serif text-xl font-medium text-ink-900">Education</h3>
            <div className="mt-5 space-y-5">
              {PROFILE.education.map((edu) => (
                <div key={edu.degree} className="border-l-2 border-clay-300 pl-5">
                  <p className="font-serif text-lg font-medium text-ink-900">{edu.degree}</p>
                  <p className="text-sm font-medium text-clay-600">{edu.school}</p>
                  <p className="mt-1 text-sm text-ink-500">{edu.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h3 className="font-serif text-xl font-medium text-ink-900">Personal Philosophy</h3>
            <div className="mt-5 space-y-4">
              {PROFILE.philosophy.map((line, i) => (
                <p key={i} className="font-serif text-lg font-light italic leading-relaxed text-ink-600">
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16">
            <Rule label="Skill areas" />
          </div>
        </Reveal>

        {/* Skills */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_AREAS.map((area, i) => (
            <Reveal key={area.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <div className="rounded-xl border border-ink-200 bg-white/30 p-5">
                <h4 className="font-serif text-base font-medium text-ink-900">{area.title}</h4>
                <ul className="mt-3 space-y-1.5">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink-600">
                      <span className="h-1 w-1 rounded-full bg-sea-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
