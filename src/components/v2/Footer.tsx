import { LINKS } from '@/data/v2Content';
import { ArrowUp } from 'lucide-react';
import { scrollBehavior } from './hooks';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-200 bg-ink-100/40 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-lg font-medium text-ink-900">Hayden Baxter</p>
            <p className="mt-1 text-sm text-ink-500">
              Global Business Strategist {'\u00b7'} AI Product Builder {'\u00b7'} Founder, WorldPulse
            </p>
            <p className="mt-4 text-xs text-ink-400">
              &copy; {year} Hayden Baxter. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-600 transition-colors hover:text-clay-600"
            >
              LinkedIn
            </a>
            <a
              href={LINKS.worldpulse}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-600 transition-colors hover:text-clay-600"
            >
              WorldPulse
            </a>
            <a
              href={LINKS.email}
              className="font-medium text-ink-600 transition-colors hover:text-clay-600"
            >
              Email
            </a>
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-600 transition-colors hover:text-clay-600"
            >
              Schedule
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
            >
              <ArrowUp size={14} /> Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
