import { ArrowUpRight, Leaf, Eye, FileCheck, BookOpen } from 'lucide-react';
import { LINKS } from '@/data/v2Content';
import { Reveal } from './primitives';
import { SupplyChainJourney } from './SupplyChainJourney';

const VALUE_SOURCES = [
  {
    icon: FileCheck,
    title: 'Compliance',
    body: 'Meeting regulatory requirements for product information, material disclosure, and supply chain documentation.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    body: 'Making the product’s origins, journey, and impact visible to anyone who needs to know, from auditors to customers.',
  },
  {
    icon: BookOpen,
    title: 'Provenance',
    body: 'Preserving the authentic story of where materials came from, how they were made, and by whom.',
  },
  {
    icon: Leaf,
    title: 'Storytelling',
    body: 'Turning data into a narrative that connects people to products emotionally, not just transactionally.',
  },
];

export function WorldPulse() {
  return (
    <section id="worldpulse" className="relative bg-ink-50 py-20 paper-grain sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl font-light text-clay-500">D</span>
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
                WorldPulse
              </h2>
              <p className="mt-1 text-sm text-ink-500">The future of products tells its own story</p>
            </div>
          </div>
        </Reveal>

        {/* Intro */}
        <Reveal delay={1}>
          <div className="mt-12 max-w-prose">
            <p className="font-serif text-xl font-light leading-relaxed text-ink-700 text-pretty">
              WorldPulse develops Digital Product Passports that connect information about origin,
              materials, manufacturing, compliance, craftsmanship, and sustainability into visual
              digital experiences.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              The philosophy is simple: product transparency should not feel like a cold database.
              A product moves through a global supply chain, and data can connect those stages into
              something a brand, a regulator, and a consumer can all understand.
            </p>
          </div>
        </Reveal>

        {/* Link to WorldPulse */}
        <Reveal delay={2}>
          <a
            href={LINKS.worldpulse}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-sea-500 bg-sea-50 px-5 py-3 text-sm font-semibold text-sea-800 transition-all hover:bg-sea-100"
          >
            Visit worldxpulse.com <ArrowUpRight size={16} />
          </a>
        </Reveal>

        {/* Interactive journey */}
        <Reveal delay={1}>
          <SupplyChainJourney />
        </Reveal>

        {/* Value sources */}
        <Reveal>
          <h3 className="mt-16 font-serif text-xl font-medium text-ink-900">
            Four sources of value, related but distinct
          </h3>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_SOURCES.map((src, i) => (
            <Reveal key={src.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <div className="h-full rounded-xl border border-ink-200 bg-white/50 p-5">
                <src.icon size={22} className="text-sea-600" strokeWidth={1.5} />
                <h4 className="mt-3 font-serif text-lg font-medium text-ink-900">{src.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{src.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* AI + design note */}
        <Reveal>
          <div className="mt-12 max-w-prose rounded-xl border-l-4 border-gold-400 bg-gold-50/50 p-6">
            <p className="text-pretty leading-relaxed text-ink-700">
              AI and thoughtful design can help make complex supplier information easier for brands
              and consumers to understand. The goal is not to dump data onto people, but to
              translate it into something that improves decisions and builds trust.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
