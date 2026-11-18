import { useState, useMemo } from 'react';
import { SUPPLIERS, PRIORITIES, type PriorityKey } from '@/data/v2Content';
import { Reveal } from './primitives';
import { SlidersHorizontal, Trophy, Info } from 'lucide-react';

export function SupplierDemo() {
  const [weights, setWeights] = useState<Record<PriorityKey, number>>({
    cost: 50,
    reliability: 50,
    transparency: 50,
    speed: 50,
  });

  const results = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
    return SUPPLIERS.map((s) => {
      // Normalize: cost is inverse (lower is better)
      const score =
        ((10 - s.cost) * weights.cost +
          s.reliability * weights.reliability +
          s.transparency * weights.transparency +
          s.speed * weights.speed) /
        totalWeight;
      return { ...s, score: Math.round(score * 10) / 10 };
    }).sort((a, b) => b.score - a.score);
  }, [weights]);

  const winner = results[0];

  return (
    <div className="mt-8 rounded-2xl border border-ink-200 bg-white/50 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-medium text-ink-900">
            Interactive: Adjust sourcing priorities
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Illustrative data. Not actual suppliers or outcomes.
          </p>
        </div>
        <SlidersHorizontal size={22} className="shrink-0 text-clay-500" strokeWidth={1.5} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Controls */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Adjust your priorities
          </p>
          <div className="mt-4 space-y-5">
            {PRIORITIES.map((p) => (
              <div key={p.key}>
                <div className="flex items-center justify-between">
                  <label htmlFor={`slider-${p.key}`} className="text-sm font-medium text-ink-800">
                    {p.label}
                  </label>
                  <span className="font-mono text-xs text-ink-500 tabular-nums">
                    {weights[p.key]}
                  </span>
                </div>
                <input
                  id={`slider-${p.key}`}
                  type="range"
                  min={0}
                  max={100}
                  value={weights[p.key]}
                  onChange={(e) =>
                    setWeights((w) => ({ ...w, [p.key]: Number(e.target.value) }))
                  }
                  className="mt-2 w-full accent-clay-500"
                />
                <p className="mt-1 text-xs text-ink-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <Trophy size={14} strokeWidth={1.5} className="text-gold-500" />
            Recommended supplier
          </div>
          <div className="mt-3 rounded-lg border border-gold-300 bg-gold-50/60 p-4">
            <p className="font-serif text-lg font-medium text-ink-900">{winner.name}</p>
            <p className="text-sm text-ink-500">{winner.country}</p>
            <p className="mt-1 text-sm font-medium text-gold-700">
              Score: {winner.score.toFixed(1)} / 10
            </p>
          </div>

          {/* Full ranking */}
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Full ranking
          </p>
          <div className="mt-3 space-y-2">
            {results.map((s, i) => (
              <div
                key={s.id}
                className={`rounded-lg border px-3 py-2.5 transition-all ${
                  i === 0 ? 'border-gold-300 bg-gold-50/40' : 'border-ink-200 bg-ink-50/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs text-ink-500 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="truncate text-sm font-medium text-ink-800">{s.name}</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-ink-700 tabular-nums">
                    {s.score.toFixed(1)}
                  </span>
                </div>
                {/* Score bar */}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      i === 0 ? 'bg-gold-500' : 'bg-sea-400'
                    }`}
                    style={{ width: `${(s.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <div className="mt-6 flex items-start gap-3 rounded-lg bg-ink-100/60 px-4 py-3">
        <Info size={16} className="mt-0.5 shrink-0 text-ink-400" strokeWidth={1.5} />
        <p className="text-xs leading-relaxed text-ink-500">
          Each supplier is scored on a 1–10 scale across cost (inverted, so lower cost scores
          higher), reliability, transparency, and delivery speed. Your slider weights determine how
          much each factor matters. The weighted average produces the ranking. This is a simplified
          demonstration of how structured evaluation can replace ad-hoc sourcing decisions.
        </p>
      </div>
    </div>
  );
}
