import { ArrowDown, ArrowUpRight, Mail, Calendar } from 'lucide-react';
import { PROFILE, LINKS } from '@/data/v2Content';
import { Reveal } from './primitives';

const CREDIBILITY = ['Nike', 'Converse', 'Disney', 'Aosom', 'Utah State', 'Arizona State'];

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-ink-50 paper-grain">
      {/* Decorative SVG world-connection graphic */}
      <HeroGraphic />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-24 pb-16 sm:px-8">
        {/* Eyebrow */}
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-clay-500" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">
              {'Global Business \u00b7 AI \u00b7 Supply Chain'}
            </span>
          </div>
        </Reveal>

        {/* Name + headline */}
        <Reveal delay={1}>
          <h1 className="max-w-4xl font-serif text-5xl font-light leading-[1.05] tracking-tightest text-ink-900 text-balance sm:text-6xl lg:text-7xl">
            Hayden Baxter
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-5 max-w-2xl font-serif text-xl font-light leading-relaxed text-ink-600 text-pretty sm:text-2xl">
            {PROFILE.centralMessage}
          </p>
        </Reveal>

        {/* Roles */}
        <Reveal delay={3}>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-medium text-ink-500">
            {PROFILE.roles.map((role, i) => (
              <span key={role} className="flex items-center gap-4">
                {i > 0 && <span className="text-ink-300">/</span>}
                {role}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Credibility markers */}
        <Reveal delay={4}>
          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-ink-500">Experience across</p>
            <div className="flex flex-wrap gap-2">
              {CREDIBILITY.map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-ink-200 bg-ink-100/60 px-3 py-1 text-sm font-medium text-ink-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={4}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-semibold text-ink-50 transition-all hover:bg-ink-800 hover:shadow-lg"
            >
              <Calendar size={16} />
              Schedule a conversation
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-800 transition-all hover:border-ink-900 hover:bg-ink-100"
            >
              LinkedIn <ArrowUpRight size={16} />
            </a>
            <a
              href={LINKS.email}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-ink-600 transition-colors hover:text-clay-600"
            >
              <Mail size={16} /> Email
            </a>
          </div>
        </Reveal>

        {/* Scroll hint */}
        <div className="mt-16 flex items-center gap-2 text-sm text-ink-500">
          <ArrowDown size={16} className="animate-bounce" />
          <span>{'Scroll to explore \u00b7 30-second summary, five-minute depth, or a full chapter journey'}</span>
        </div>
      </div>
    </section>
  );
}

/* Animated SVG: abstract world-connection nodes */
function HeroGraphic() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <svg
        className="absolute right-0 top-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Connecting lines */}
        <g stroke="#a8543a" strokeWidth="1">
          <path d="M200 200 Q 400 100 600 300 T 1000 200" />
          <path d="M150 500 Q 350 400 550 550 T 950 450" />
          <path d="M300 100 Q 500 300 700 150 T 1100 350" />
          <path d="M100 350 Q 300 250 500 400 T 900 300" />
        </g>
        {/* Nodes */}
        <g fill="#2a776f">
          <circle cx="200" cy="200" r="4" />
          <circle cx="600" cy="300" r="6" />
          <circle cx="1000" cy="200" r="4" />
          <circle cx="150" cy="500" r="5" />
          <circle cx="550" cy="550" r="4" />
          <circle cx="950" cy="450" r="6" />
          <circle cx="300" cy="100" r="3" />
          <circle cx="700" cy="150" r="5" />
          <circle cx="1100" cy="350" r="4" />
          <circle cx="500" cy="400" r="3" />
          <circle cx="900" cy="300" r="5" />
        </g>
        {/* Pulse on key nodes */}
        <g fill="#d4a832" className="animate-pulse-slow">
          <circle cx="600" cy="300" r="10" opacity="0.3" />
          <circle cx="950" cy="450" r="10" opacity="0.3" />
        </g>
      </svg>

      {/* Vertical accent rule on the left */}
      <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-clay-300 to-transparent opacity-40" />
    </div>
  );
}
