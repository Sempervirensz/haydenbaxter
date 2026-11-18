import { Languages, Building2, Cpu, Database, FileText } from 'lucide-react';
import { Reveal, SectionLabel } from './primitives';

const TRANSLATIONS = [
  {
    icon: Languages,
    from: 'Mandarin Chinese',
    to: 'English',
    body: 'Fluent Mandarin built through formal study at Utah State and years of direct work in China. Language fluency opens doors that transactional translation cannot.',
  },
  {
    icon: Building2,
    from: 'Business requirements',
    to: 'Technical capabilities',
    body: 'Translating what an organization needs into what a system can do, and back again. Bridging the gap between the people who define problems and the people who build solutions.',
  },
  {
    icon: Cpu,
    from: 'AI capabilities',
    to: 'Practical business needs',
    body: 'Understanding what AI can actually do, then matching it to real business problems rather than impressive demonstrations that solve nothing.',
  },
  {
    icon: Database,
    from: 'Complex supply chain data',
    to: 'Decisions people can act on',
    body: 'Consolidating fragmented supplier records, compliance documents, and operational data into something a decision-maker can actually use.',
  },
  {
    icon: FileText,
    from: 'Regulatory compliance',
    to: 'Business value',
    body: 'Reframing compliance not as a cost center but as a foundation for transparency, trust, and better customer experiences.',
  },
];

export function Connector() {
  return (
    <section id="connector" className="relative bg-ink-900 py-20 text-ink-50 ink-grain sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl font-light text-clay-400">A</span>
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink-50 sm:text-3xl">
                The Connector
              </h2>
              <p className="mt-1 text-sm text-ink-400">Translation as a way of working</p>
            </div>
          </div>
        </Reveal>

        {/* Intro */}
        <Reveal delay={1}>
          <div className="mt-12 max-w-prose">
            <p className="font-serif text-xl font-light leading-relaxed text-ink-200 text-pretty">
              A career spent connecting different worlds. East and West. Business and technology.
              Operational complexity and human understanding. The connective tissue is translation
              in both its literal and metaphorical senses.
            </p>
          </div>
        </Reveal>

        {/* Translation modes */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRANSLATIONS.map((t, i) => (
            <Reveal key={t.from} delay={(i % 3) as 0 | 1 | 2}>
              <div className="h-full rounded-xl border border-ink-700 bg-ink-800/50 p-6">
                <t.icon size={22} className="text-clay-400" strokeWidth={1.5} />
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-200">{t.from}</span>
                  <span className="text-clay-400">&rarr;</span>
                  <span className="text-sm font-medium text-sea-300">{t.to}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{t.body}</p>
              </div>
            </Reveal>
          ))}

          {/* Final card: the synthesis */}
          <Reveal delay={2}>
            <div className="flex h-full flex-col justify-center rounded-xl border border-clay-500/30 bg-clay-500/10 p-6">
              <p className="font-serif text-lg font-light italic leading-relaxed text-ink-100">
                The distinctive strength is not expertise in any single domain. It is the ability to
                stand at the intersection and make the connections visible.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Cross-cultural formation */}
        <Reveal>
          <div className="mt-16 max-w-prose">
            <h3 className="font-serif text-xl font-medium text-ink-100">How the perspective formed</h3>
            <div className="mt-5 space-y-4 text-ink-300">
              <p className="leading-relaxed">
                Mandarin fluency opened direct access to Chinese manufacturers and markets, bypassing
                the layers of intermediation that obscure so much of global sourcing. Formal study at
                Utah State provided the business foundation. Years of factory visits, Canton Fair
                sourcing, and buyer–supplier coordination provided the practical education that
                no classroom can deliver.
              </p>
              <p className="leading-relaxed">
                Global business training supplied the frameworks. Cross-functional operations at Nike,
                Converse, Disney, and Aosom supplied the constraints, the stakes, and the scale. A
                master’s in AI in Business at Arizona State connected the operational world to
                the technological one, turning curiosity about emerging technology into the ability
                to build with it.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
