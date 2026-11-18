import { useState } from 'react';
import { SUPPLY_STAGES } from '@/data/v2Content';
import { Reveal } from './primitives';
import { ArrowRight, Database, Lock, Unlock, RefreshCw } from 'lucide-react';

export function SupplyChainJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const [passportEnabled, setPassportEnabled] = useState(false);
  const stage = SUPPLY_STAGES[activeStage];

  const next = () => setActiveStage((i) => (i + 1) % SUPPLY_STAGES.length);
  const prev = () => setActiveStage((i) => (i - 1 + SUPPLY_STAGES.length) % SUPPLY_STAGES.length);

  return (
    <div className="mt-12 rounded-2xl border border-ink-200 bg-white/50 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-medium text-ink-900">
            Interactive: Trace a product through its supply chain
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Illustrative data. Not an actual Hayden Baxter project.
          </p>
        </div>
        <button
          onClick={() => setPassportEnabled((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
            passportEnabled
              ? 'border-sea-500 bg-sea-500 text-white'
              : 'border-ink-300 bg-white text-ink-700 hover:border-ink-900'
          }`}
          aria-pressed={passportEnabled}
        >
          {passportEnabled ? <Unlock size={16} /> : <Lock size={16} />}
          {passportEnabled ? 'Digital Product Passport: ON' : 'Enable Digital Product Passport'}
        </button>
      </div>

      {/* Stage rail */}
      <div className="mt-8">
        <ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {SUPPLY_STAGES.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => setActiveStage(i)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  i === activeStage
                    ? 'bg-ink-900 text-ink-50'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
                }`}
                aria-current={i === activeStage ? 'step' : undefined}
              >
                <span className="font-mono text-xs tabular-nums opacity-60">0{i + 1}</span>
                {s.label}
              </button>
              {i < SUPPLY_STAGES.length - 1 && (
                <ArrowRight size={14} className="hidden shrink-0 text-ink-300 sm:block" />
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Stage detail */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Visual: SVG journey diagram */}
        <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-6">
          <JourneyDiagram
            activeStage={activeStage}
            passportEnabled={passportEnabled}
            onStageClick={setActiveStage}
          />
        </div>

        {/* Text + data */}
        <div className="flex flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-clay-500">
              Stage {activeStage + 1} of {SUPPLY_STAGES.length}
            </p>
            <h4 className="mt-1 font-serif text-2xl font-medium text-ink-900">{stage.label}</h4>
            <p className="mt-1 text-sm font-medium text-ink-500">{stage.location}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{stage.description}</p>
          </div>

          {/* Data panel */}
          <div className="mt-5 rounded-lg border border-ink-200 bg-white/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <Database size={14} strokeWidth={1.5} />
              Traceability data {passportEnabled ? '' : '(limited)'}
            </div>
            <dl className="mt-3 space-y-2">
              {stage.data.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-ink-500">{d.label}</dt>
                  <dd
                    className={`font-medium ${
                      passportEnabled ? 'text-sea-700' : 'text-ink-500'
                    }`}
                  >
                    {passportEnabled ? d.value : d.value === 'Pending' || d.value === 'No' || d.value === 'None' || d.value === 'Unavailable' ? '—' : d.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Navigation */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <button
              onClick={prev}
              className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
            >
              Previous
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-ink-50 transition-colors hover:bg-ink-800"
            >
              Next stage <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Passport effect callout */}
      {passportEnabled && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-sea-200 bg-sea-50 px-4 py-3 animate-fade-in">
          <RefreshCw size={18} className="mt-0.5 shrink-0 text-sea-600" strokeWidth={1.5} />
          <p className="text-sm text-sea-800">
            With a Digital Product Passport active, each stage retains and carries its data forward.
            The product’s story remains accessible at retail and into reuse, instead of
            disappearing at the factory door.
          </p>
        </div>
      )}
    </div>
  );
}

/* SVG diagram showing the circular supply chain with an active highlight */
function JourneyDiagram({
  activeStage,
  passportEnabled,
  onStageClick,
}: {
  activeStage: number;
  passportEnabled: boolean;
  onStageClick: (index: number) => void;
}) {
  const stages = SUPPLY_STAGES;
  // Positions in a circle
  const cx = 150;
  const cy = 120;
  const r = 95;
  const positions = stages.map((_, i) => {
    const angle = (i / stages.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    // role="group", not "img": an img role hides the focusable stage nodes
    // inside it from assistive tech.
    <svg viewBox="0 0 300 240" className="w-full" role="group" aria-label="Supply chain journey diagram">
      {/* Connecting arcs */}
      {positions.map((pos, i) => {
        const next = positions[(i + 1) % positions.length];
        return (
          <line
            key={i}
            x1={pos.x}
            y1={pos.y}
            x2={next.x}
            y2={next.y}
            stroke={passportEnabled ? '#2a776f' : '#d9d2c2'}
            strokeWidth={passportEnabled ? 2 : 1.5}
            strokeDasharray={passportEnabled ? '0' : '4 4'}
            opacity={passportEnabled ? 0.5 : 0.4}
          />
        );
      })}

      {/* Center label */}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-ink-400 font-serif text-[11px]">
        Product
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-ink-400 font-serif text-[11px]">
        Journey
      </text>

      {/* Nodes */}
      {positions.map((pos, i) => {
        const isActive = i === activeStage;
        return (
          <g
            key={i}
            onClick={() => onStageClick(i)}
            tabIndex={0}
            role="button"
            aria-label={`Stage ${i + 1}: ${stages[i].label}`}
            aria-pressed={isActive}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onStageClick(i);
              }
            }}
            className="v2-node cursor-pointer"
          >
            {/* Keyboard focus ring; shown by .v2-node:focus-visible in v2.css */}
            <circle
              className="v2-node__ring"
              cx={pos.x}
              cy={pos.y}
              r={17}
              fill="none"
              stroke="#2a776f"
              strokeWidth={2}
            />
            {isActive && (
              <circle cx={pos.x} cy={pos.y} r={16} fill="#a8543a" opacity={0.15} className="animate-pulse-slow" />
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 11 : 7}
              fill={isActive ? '#a8543a' : passportEnabled ? '#2a776f' : '#b8ad97'}
              stroke="#f7f5f0"
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y + (pos.y < cy ? -18 : 24)}
              textAnchor="middle"
              className={`text-[9px] ${isActive ? 'fill-ink-900 font-semibold' : 'fill-ink-500'}`}
            >
              {stages[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
