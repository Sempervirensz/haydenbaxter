import { type ReactNode } from 'react';
import { useReveal } from './hooks';

/* Reveal: wraps children in a scroll-triggered fade-up */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
}) {
  const [ref, visible] = useReveal<HTMLDivElement>();
  const delayClass = delay ? ` reveal-delay-${delay}` : '';
  return (
    <div
      ref={ref}
      className={`reveal${delayClass}${visible ? ' is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* SectionLabel: editorial chapter marker */
export function SectionLabel({
  letter,
  title,
  subtitle,
}: {
  letter?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      {letter && (
        <span className="font-serif text-2xl font-light text-clay-500 tabular-nums">{letter}</span>
      )}
      <div>
        <h2 className="font-serif text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
      </div>
    </div>
  );
}

/* Pill: small status/tag label */
export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'sea' | 'clay' | 'gold';
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-ink-100 text-ink-600 border-ink-200',
    sea: 'bg-sea-50 text-sea-700 border-sea-200',
    clay: 'bg-clay-50 text-clay-700 border-clay-200',
    gold: 'bg-gold-50 text-gold-700 border-gold-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* Rule: horizontal divider with optional label */
export function Rule({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-ink-200" />
      {label && <span className="text-xs uppercase tracking-widest text-ink-300">{label}</span>}
      <div className="h-px flex-1 bg-ink-200" />
    </div>
  );
}

/* StatusBadge: maps AI project status to a colored pill */
export function StatusBadge({ status }: { status: string }) {
  const tone = status === 'Working product' ? 'sea' : status === 'Prototype' ? 'gold' : 'clay';
  return <Pill tone={tone as 'sea' | 'gold' | 'clay'}>{status}</Pill>;
}
