import React from 'react';

export const ForgettingCurveSVG: React.FC = () => {
  const retentionBars = [
    { label: '0 min', pct: 100 },
    { label: '20 min', pct: 58 },
    { label: '1 hora', pct: 44 },
    { label: '9 horas', pct: 36 },
    { label: '1 día', pct: 34 },
    { label: '2 días', pct: 28 },
    { label: '6 días', pct: 25 },
    { label: '31 días', pct: 21 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
      {/* Left: Bar chart of retention without review */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-4">
        <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
          Retención sin repasos (Curva del olvido)
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          A los 20 minutos ya olvidamos casi la mitad; tras 1 día solo retenemos ~34%.
        </p>
        <svg viewBox="0 0 420 215" className="w-full h-auto select-none" role="img" aria-label="Gráfico de barras de retención">
          {[0, 25, 50, 75, 100].map((v) => {
            const y = 175 - v * 1.45;
            return (
              <g key={v}>
                <line x1={38} y1={y} x2={406} y2={y} className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="3 3" />
                <text x={32} y={y + 3.5} textAnchor="end" className="fill-slate-400 font-mono text-[10px]">
                  {v}%
                </text>
              </g>
            );
          })}
          {retentionBars.map((bar, i) => {
            const barW = 30;
            const gap = 15;
            const x = 48 + i * (barW + gap);
            const h = bar.pct * 1.45;
            const y = 175 - h;
            return (
              <g key={bar.label}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={4}
                  fill={i === 0 ? '#059669' : i < 3 ? '#D97706' : '#DC2626'}
                  opacity={0.88}
                />
                <text x={x + barW / 2} y={y - 5} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 font-mono text-[10px] font-bold">
                  {bar.pct}%
                </text>
                <text x={x + barW / 2} y={195} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 font-mono text-[9.5px]">
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Right: Spaced Repetition Curves */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-4">
        <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
          Efecto de los repasos espaciados
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Cada repaso (5m, 20m, 1h, 8h, diario) aplana la curva y consolida la memoria a largo plazo.
        </p>
        <svg viewBox="0 0 420 215" className="w-full h-auto select-none" role="img" aria-label="Curvas de repetición espaciada">
          {/* Axes */}
          <line x1={40} y1={25} x2={40} y2={175} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={1.5} />
          <line x1={40} y1={175} x2={400} y2={175} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={1.5} />
          <text x={32} y={32} textAnchor="end" className="fill-slate-400 font-mono text-[10px]">100%</text>
          <text x={32} y={176} textAnchor="end" className="fill-slate-400 font-mono text-[10px]">0%</text>

          {/* Without review (steep red drop) */}
          <path
            d="M 42 30 Q 85 135 200 155 T 395 162"
            fill="none"
            stroke="#DC2626"
            strokeWidth={2.2}
            strokeDasharray="5 4"
          />
          <text x={285} y={169} className="fill-red-500 font-mono text-[10px] font-bold">Sin repaso</text>

          {/* Review 1 -> 2 -> 3 -> 4 (green rising & flattening curves) */}
          <path d="M 42 30 Q 65 95 95 110 L 95 30" fill="none" stroke="#F59E0B" strokeWidth={2} />
          <path d="M 95 30 Q 130 78 165 88 L 165 30" fill="none" stroke="#0EA5E9" strokeWidth={2} />
          <path d="M 165 30 Q 210 62 255 68 L 255 30" fill="none" stroke="#10B981" strokeWidth={2.2} />
          <path d="M 255 30 Q 320 44 395 48" fill="none" stroke="#10B981" strokeWidth={2.8} />

          {/* Markers */}
          {[
            { x: 95, label: 'Rep. 1 (20m)' },
            { x: 165, label: 'Rep. 2 (1h)' },
            { x: 255, label: 'Rep. 3 (1d)' },
            { x: 350, label: 'Memoria fija' },
          ].map((m) => (
            <text key={m.label} x={m.x} y={194} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 font-mono text-[9.5px]">
              {m.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
