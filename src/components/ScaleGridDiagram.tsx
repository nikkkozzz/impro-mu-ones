import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ScaleGridData } from '../data/types';
import { playGuitarMidi } from '../utils/audioEngine';

interface ScaleGridDiagramProps {
  data: ScaleGridData;
}

export const ScaleGridDiagram: React.FC<ScaleGridDiagramProps> = ({ data }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const startMidi = data.startMidi ?? 48; // C3 default

  const cellW = 54;
  const cellH = 44;
  const padX = 16;
  const topSpace = data.intervals && data.intervals.length > 0 ? 44 : 18;
  const bottomSpace = 28;
  const svgW = padX * 2 + data.cells.length * cellW;
  const svgH = topSpace + cellH + bottomSpace;

  const playCell = (idx: number) => {
    const cell = data.cells[idx];
    if (!cell || cell.role === 'empty') return;
    playGuitarMidi(startMidi + idx, 0.9);
    setActiveIdx(idx);
    window.setTimeout(() => setActiveIdx((p) => (p === idx ? null : p)), 380);
  };

  const playScale = () => {
    let delay = 0;
    data.cells.forEach((cell, idx) => {
      if (cell.role !== 'empty') {
        const d = delay;
        window.setTimeout(() => {
          playGuitarMidi(startMidi + idx, 0.65);
          setActiveIdx(idx);
        }, d);
        delay += 260;
      }
    });
    window.setTimeout(() => setActiveIdx(null), delay + 250);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 sm:p-5 my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">
            {data.title}
          </h4>
          {data.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{data.subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={playScale}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Escuchar
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto min-w-[520px] select-none"
          role="img"
          aria-label={data.title}
        >
          {/* Interval brackets above cells */}
          {data.intervals?.map((iv, idx) => {
            const x1 = padX + (iv.fromIndex + 0.5) * cellW;
            const x2 = padX + (iv.toIndex + 0.5) * cellW;
            const midX = (x1 + x2) / 2;
            const archY = topSpace - 22;
            return (
              <g key={`iv-${idx}`}>
                <path
                  d={`M ${x1} ${topSpace - 4} Q ${midX} ${archY - 12} ${x2} ${topSpace - 4}`}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth={1.6}
                />
                <text
                  x={midX}
                  y={archY - 2}
                  textAnchor="middle"
                  className="fill-amber-600 dark:fill-amber-400 font-mono text-[11px] font-bold"
                >
                  {iv.label}
                </text>
              </g>
            );
          })}

          {/* Note cells */}
          {data.cells.map((cell, idx) => {
            const x = padX + idx * cellW;
            const y = topSpace;
            const isActive = activeIdx === idx;
            const isEmpty = cell.role === 'empty';

            let fillClass = 'fill-slate-100 dark:fill-slate-800/70';
            let textClass = 'fill-slate-900 dark:fill-slate-100';

            if (isActive) {
              fillClass = 'fill-amber-400';
              textClass = 'fill-slate-950';
            } else if (cell.role === 'root') {
              fillClass = 'fill-red-600';
              textClass = 'fill-white';
            } else if (cell.role === 'chord') {
              fillClass = 'fill-sky-600';
              textClass = 'fill-white';
            } else if (cell.role === 'characteristic') {
              fillClass = 'fill-amber-600';
              textClass = 'fill-white';
            } else if (cell.role === 'passing') {
              fillClass = 'fill-violet-600';
              textClass = 'fill-white';
            } else if (isEmpty) {
              fillClass = 'fill-slate-200/70 dark:fill-slate-950';
              textClass = 'fill-slate-400 dark:fill-slate-600';
            }

            return (
              <g
                key={`c-${idx}`}
                onClick={() => playCell(idx)}
                className={isEmpty ? '' : 'cursor-pointer'}
              >
                <rect
                  x={x + 1.5}
                  y={y}
                  width={cellW - 3}
                  height={cellH}
                  rx={5}
                  className={`${fillClass} stroke-slate-300 dark:stroke-slate-700`}
                  strokeWidth={1.2}
                />
                <text
                  x={x + cellW / 2}
                  y={y + cellH / 2 + 5}
                  textAnchor="middle"
                  className={`font-mono text-[13px] font-bold ${textClass}`}
                >
                  {cell.note}
                </text>
                {cell.degree && (
                  <text
                    x={x + cellW / 2}
                    y={y + cellH + 17}
                    textAnchor="middle"
                    className="fill-slate-500 dark:fill-slate-400 font-mono text-[11px] font-semibold"
                  >
                    {cell.degree}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
