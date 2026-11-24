import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ChordDiagramData } from '../data/types';
import { playChordFrets } from '../utils/audioEngine';

interface ChordDiagramSVGProps {
  chord: ChordDiagramData;
}

export const ChordDiagramSVG: React.FC<ChordDiagramSVGProps> = ({ chord }) => {
  const [strumming, setStrumming] = useState(false);

  const numFrets = 5;
  const startFret = chord.startFret;
  const showNut = startFret <= 1;

  const leftPad = 34;
  const rightPad = 20;
  const topPad = 36;
  const bottomPad = 26;
  const stringGap = 24;
  const fretGap = 28;

  const gridW = 5 * stringGap;
  const gridH = numFrets * fretGap;
  const svgW = leftPad + gridW + rightPad;
  const svgH = topPad + gridH + bottomPad;

  // Vertical chord chart: left = string 6 (low E), right = string 1 (high e)
  const getStringX = (str: number) => leftPad + (6 - str) * stringGap;
  const getFretY = (absFret: number) => {
    const rel = absFret - Math.max(1, startFret) + 1;
    return topPad + (rel - 0.5) * fretGap;
  };

  const handlePlay = () => {
    const playable = chord.frets
      .filter((f) => f.fret >= 0)
      .map((f) => ({ string: f.string, fret: f.fret }));
    playChordFrets(playable, 'down', 1.9);
    setStrumming(true);
    window.setTimeout(() => setStrumming(false), 550);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 flex flex-col items-center justify-between">
      <div className="text-center mb-2">
        <div className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
          {chord.name}
        </div>
        {chord.subtitle && (
          <div className="text-xs text-slate-500 dark:text-slate-400">{chord.subtitle}</div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-[185px] h-auto select-none"
        role="img"
        aria-label={`Diagrama de acorde ${chord.name}`}
      >
        {/* Starting fret indicator */}
        {!showNut && (
          <text
            x={leftPad - 14}
            y={topPad + fretGap * 0.65}
            textAnchor="middle"
            className="fill-amber-600 dark:fill-amber-400 font-mono text-[13px] font-bold"
          >
            {startFret}fr
          </text>
        )}

        {/* Nut or top fret line */}
        <line
          x1={leftPad}
          y1={topPad}
          x2={leftPad + gridW}
          y2={topPad}
          stroke={showNut ? '#F59E0B' : '#64748B'}
          strokeWidth={showNut ? 5 : 2}
        />

        {/* Horizontal frets */}
        {Array.from({ length: numFrets }).map((_, i) => (
          <line
            key={`f-${i}`}
            x1={leftPad}
            y1={topPad + (i + 1) * fretGap}
            x2={leftPad + gridW}
            y2={topPad + (i + 1) * fretGap}
            className="stroke-slate-300 dark:stroke-slate-700"
            strokeWidth={1.4}
          />
        ))}

        {/* Vertical strings (6 left -> 1 right) */}
        {[6, 5, 4, 3, 2, 1].map((s, idx) => (
          <g key={`s-${s}`}>
            <line
              x1={leftPad + idx * stringGap}
              y1={topPad}
              x2={leftPad + idx * stringGap}
              y2={topPad + gridH}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={2.2 - idx * 0.22}
            />
            <text
              x={leftPad + idx * stringGap}
              y={topPad + gridH + 17}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]"
            >
              {['E', 'A', 'D', 'G', 'B', 'e'][idx]}
            </text>
          </g>
        ))}

        {/* Barre arc */}
        {chord.barre && (
          <rect
            x={getStringX(Math.max(chord.barre.fromString, chord.barre.toString)) - 8}
            y={getFretY(chord.barre.fret) - 8}
            width={Math.abs(chord.barre.fromString - chord.barre.toString) * stringGap + 16}
            height={16}
            rx={8}
            fill="rgba(245, 158, 11, 0.28)"
            stroke="#F59E0B"
            strokeWidth={1.6}
          />
        )}

        {/* Open / Muted / Fretted notes */}
        {chord.frets.map((f, idx) => {
          const x = getStringX(f.string);
          if (f.fret === -1) {
            return (
              <text
                key={`m-${idx}`}
                x={x}
                y={topPad - 12}
                textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500 font-mono text-[13px] font-bold"
              >
                ×
              </text>
            );
          }
          if (f.fret === 0) {
            return (
              <circle
                key={`o-${idx}`}
                cx={x}
                cy={topPad - 16}
                r={5.5}
                fill="none"
                stroke={f.role === 'root' ? '#DC2626' : '#38BDF8'}
                strokeWidth={2}
              />
            );
          }
          const y = getFretY(f.fret);
          const isRoot = f.role === 'root';
          return (
            <g key={`n-${idx}`}>
              <circle
                cx={x}
                cy={y}
                r={9.5}
                fill={isRoot ? '#DC2626' : '#0284C7'}
                stroke={isRoot ? '#FCA5A5' : '#BAE6FD'}
                strokeWidth={1.6}
              />
              <text
                x={x}
                y={y + 3.8}
                textAnchor="middle"
                fill="#FFFFFF"
                className="font-mono text-[10.5px] font-bold"
              >
                {f.degree ?? f.finger ?? ''}
              </text>
            </g>
          );
        })}
      </svg>

      <button
        type="button"
        onClick={handlePlay}
        className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
          strumming
            ? 'bg-amber-400 text-slate-950'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5" />
        Escuchar acorde
      </button>
    </div>
  );
};
