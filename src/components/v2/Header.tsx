import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { LINKS, CHAPTERS } from '@/data/v2Content';
import { RESUME_HREF } from '@/data/workTogether';
import { useActiveSection, scrollBehavior } from './hooks';

const NAV_ITEMS = [
  { id: 'top', label: 'Overview' },
  { id: 'background', label: 'Background' },
  { id: 'work', label: 'Work' },
  { id: 'connector', label: 'A · Connector' },
  { id: 'operator', label: 'B · Operator' },
  { id: 'builder', label: 'C · Builder' },
  { id: 'worldpulse', label: 'D · WorldPulse' },
  { id: 'ideas', label: 'E · Ideas' },
  { id: 'connect', label: 'Connect' },
];

const ALL_SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const activeSection = useActiveSection(ALL_SECTION_IDS);

  // Progress bar is driven by a transform written straight to the DOM, once
  // per frame, so scrolling never re-renders the header. React state only
  // changes when the header crosses its 40px "scrolled" threshold.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
      setScrolled(scrollTop > 40);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Mobile menu: Esc or a tap outside the header closes it, and Esc returns
  // focus to the toggle so keyboard users aren't dropped at the page top.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [menuOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-clay-500"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          scrolled || menuOpen ? 'bg-ink-50/90 paper-grain backdrop-blur-xs shadow-xs' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          {/* Logo / name */}
          <button
            onClick={() => goTo('top')}
            className="group flex min-h-11 items-center gap-2.5"
            aria-label="Hayden Baxter, back to top"
          >
            <span className="font-serif text-lg font-semibold tracking-tight text-ink-900">
              Hayden Baxter
            </span>
            <span className="hidden text-xs font-medium text-ink-500 transition-colors group-hover:text-clay-500 sm:inline">
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
                ariaLabel={`Chapter ${ch.letter}: ${ch.title}`}
                onClick={() => goTo(ch.id)}
                active={activeSection === ch.id}
              />
            ))}
            <span className="mx-1 h-4 w-px bg-ink-200" aria-hidden="true" />
            <NavButton item={{ id: 'connect', label: 'Connect' }} onClick={() => goTo('connect')} active={activeSection === 'connect'} />
          </nav>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-2.5 text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="v2-mobile-nav"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            id="v2-mobile-nav"
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink-200 bg-ink-50/95 paper-grain px-5 py-4 backdrop-blur-xs lg:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => goTo(item.id)}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="mt-2 flex flex-col border-t border-ink-200 pt-3">
                <a
                  href={RESUME_HREF}
                  className="flex min-h-11 items-center gap-1 px-3 text-sm font-medium text-ink-700"
                >
                  Resume
                </a>
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-1 px-3 text-sm font-medium text-ink-700"
                >
                  LinkedIn <ArrowUpRight size={14} />
                </a>
                <a
                  href={LINKS.worldpulse}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-1 px-3 text-sm font-medium text-ink-700"
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

function NavButton({
  item,
  onClick,
  active,
  ariaLabel,
}: {
  item: { id: string; label: string };
  onClick: () => void;
  active?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-ink-100 text-ink-900' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
      }`}
    >
      {item.label}
    </button>
  );
}
