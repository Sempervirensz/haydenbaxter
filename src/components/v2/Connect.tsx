import { Linkedin, Mail, Calendar, ArrowUpRight, Globe } from 'lucide-react';
import { LINKS, PROFILE } from '@/data/v2Content';
import { Reveal, SectionLabel } from './primitives';

const AUDIENCES = [
  'Recruiters and hiring managers evaluating strategic or leadership roles',
  'Organizations seeking AI adoption, sourcing, procurement, or operational transformation expertise',
  'Potential WorldPulse customers and collaborators',
  'Technology and product collaborators',
  'Readers interested in international business, sustainability, and emerging technology',
];

export function Connect() {
  return (
    <section id="connect" className="relative bg-ink-50 py-20 paper-grain sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel title="Connect" subtitle="Opportunities to work together" />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: who this is for */}
          <Reveal>
            <div>
              <h3 className="font-serif text-xl font-medium text-ink-900">Who this is for</h3>
              <ul className="mt-5 space-y-3">
                {AUDIENCES.map((audience) => (
                  <li key={audience} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right: contact actions */}
          <Reveal delay={1}>
            <div className="rounded-2xl border border-ink-200 bg-white/60 p-6 sm:p-8">
              <h3 className="font-serif text-xl font-medium text-ink-900">Get in touch</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {PROFILE.centralMessage}
              </p>

              <div className="mt-6 space-y-3">
                {/* Calendly - primary */}
                <a
                  href={LINKS.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl bg-ink-900 px-5 py-4 text-ink-50 transition-all hover:bg-ink-800 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={20} strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-semibold">Schedule a conversation</p>
                      <p className="text-xs text-ink-400">30 minutes via Calendly</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* LinkedIn */}
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-ink-200 px-5 py-4 transition-all hover:border-ink-400 hover:bg-ink-100/50"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin size={20} strokeWidth={1.5} className="text-ink-700" />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">LinkedIn</p>
                      <p className="text-xs text-ink-400">/haydenjbaxter</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* WorldPulse */}
                <a
                  href={LINKS.worldpulse}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-sea-200 bg-sea-50/50 px-5 py-4 transition-all hover:border-sea-400 hover:bg-sea-50"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={20} strokeWidth={1.5} className="text-sea-600" />
                    <div>
                      <p className="text-sm font-semibold text-sea-900">WorldPulse</p>
                      <p className="text-xs text-sea-600">Digital Product Passports</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-sea-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Email */}
                <a
                  href={LINKS.email}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-ink-200 px-5 py-4 transition-all hover:border-ink-400 hover:bg-ink-100/50"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={20} strokeWidth={1.5} className="text-ink-700" />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Email</p>
                      <p className="text-xs text-ink-400">haydenjbaxter@gmail.com</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
