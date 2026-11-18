import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { LINKS, CHAPTERS } from '@/data/v2Content';
import { useActiveSection, scrollBehavior } from './hooks';

const NAV_ITEMS = [
  { id: 'top', label: 'Overview' },
  { id: 'background', label: 'Background' },
  { id: 'work', label: 'Work' },
  { id: 'connector', label: 'A \u00b7 Connector' },
  { id: 'operator', label: 'B \u00b7 Operator' },
  { id: 'builder', label: 'C \u00b7 Builder' },
  { id: 'worldpulse', label: 'D \u00b7 WorldPulse' },
  { id: 'ideas', label: 'E \u00b7 Ideas' },
  { id: 'connect', label: 'Connect' },
];

const ALL_SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeSection = useActiveSection(ALL_SECTION_IDS);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setScrolled(scrollTop > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed left-0 top-0 z-50 h-0.5 bg-clay-500 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <header
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-ink-50/90 paper-grain backdrop-blur-xs shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          {/* Logo / name */}
          <button
            onClick={() => goTo('top')}
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="font-serif text-lg font-semibold tracking-tight text-ink-900">
              Hayden Baxter
            </span>
            <span className="hidden text-xs font-medium text-ink-400 transition-colors group-hover:text-clay-500 sm:inline">
              / WorldPulse
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.slice(0, 3).map((item) => (
              <NavButton key={item.id} item={item} onClick={() => goTo(item.id)} active={activeSection === item.id} />
            ))}
            <span className="mx-1 h-4 w-px bg-ink-200" aria-hidden="true" />
            {CHAPTERS.map((ch) => (
              <NavButton
                key={ch.id}
                item={{ id: ch.id, label: ch.letter }}
                onClick={() => goTo(ch.id)}
                active={activeSection === ch.id}
              />
            ))}
            <span className="mx-1 h-4 w-px bg-ink-200" aria-hidden="true" />
            <NavButton item={{ id: 'connect', label: 'Connect' }} onClick={() => goTo('connect')} active={activeSection === 'connect'} />
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-2 text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="border-t border-ink-200 bg-ink-50/95 paper-grain px-5 py-4 backdrop-blur-xs lg:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => goTo(item.id)}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="mt-2 border-t border-ink-200 pt-3">
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-700"
                >
                  LinkedIn <ArrowUpRight size={14} />
                </a>
                <a
                  href={LINKS.worldpulse}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-700"
                >
                  WorldPulse <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}

function NavButton({ item, onClick, active }: { item: { id: string; label: string }; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-ink-100 text-ink-900' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
      }`}
    >
      {item.label}
    </button>
  );
}
