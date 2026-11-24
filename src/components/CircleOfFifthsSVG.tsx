import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playChordSymbol } from '../utils/audioEngine';

interface CircleKey {
  major: string;
  minor: string;
  sig: string;
  angleDeg: number; // 0 = top (C)
}

const CIRCLE_KEYS: CircleKey[] = [
  { major: 'C', minor: 'Am', sig: '0', angleDeg: 0 },
  { major: 'G', minor: 'Em', sig: '1♯', angleDeg: 30 },
  { major: 'D', minor: 'Bm', sig: '2♯', angleDeg: 60 },
  { major: 'A', minor: 'F#m', sig: '3♯', angleDeg: 90 },
  { major: 'E', minor: 'C#m', sig: '4♯', angleDeg: 120 },
  { major: 'B', minor: 'G#m', sig: '5♯', angleDeg: 150 },
  { major: 'F#/Gb', minor: 'D#m/Ebm', sig: '6♯/6♭', angleDeg: 180 },
  { major: 'Db', minor: 'Bbm', sig: '5♭', angleDeg: 210 },
  { major: 'Ab', minor: 'Fm', sig: '4♭', angleDeg: 240 },
  { major: 'Eb', minor: 'Cm', sig: '3♭', angleDeg: 270 },
  { major: 'Bb', minor: 'Gm', sig: '2♭', angleDeg: 300 },
  { major: 'F', minor: 'Dm', sig: '1♭', angleDeg: 330 },
];

type ProgPattern = 'I-IV-V' | 'ii-V-I' | 'vi-ii-V-I';

export const CircleOfFifthsSVG: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0); // C major default
  const [pattern, setPattern] = useState<ProgPattern>('ii-V-I');

  const idxWrap = (n: number) => ((n % 12) + 12) % 12;

  const keyI = CIRCLE_KEYS[selectedIdx];
  const keyIV = CIRCLE_KEYS[idxWrap(selectedIdx - 1)];
  const keyV = CIRCLE_KEYS[idxWrap(selectedIdx + 1)];
  const keyii = CIRCLE_KEYS[idxWrap(selectedIdx - 1)]; // minor of IV slot is ii! (e.g., F -> Dm)
  const keyvi = CIRCLE_KEYS[selectedIdx]; // minor of I slot is vi! (e.g., C -> Am)
  const keyiii = CIRCLE_KEYS[idxWrap(selectedIdx + 1)]; // minor of V slot is iii (e.g., G -> Em)

  const cleanChord = (name: string) => name.split('/')[0];

  const getProgressionChords = (): Array<{ label: string; roman: string; chord: string }> => {
    const I = `${cleanChord(keyI.major)}maj7`;
    const IV = `${cleanChord(keyIV.major)}maj7`;
    const V = `${cleanChord(keyV.major)}7`;
    const ii = `${cleanChord(keyii.minor)}7`;
    const vi = `${cleanChord(keyvi.minor)}7`;

    if (pattern === 'I-IV-V') {
      return [
        { label: I, roman: 'I', chord: I },
        { label: IV, roman: 'IV', chord: IV },
        { label: V, roman: 'V7', chord: V },
        { label: I, roman: 'I', chord: I },
      ];
    }
    if (pattern === 'ii-V-I') {
      return [
        { label: ii, roman: 'iim7', chord: ii },
        { label: V, roman: 'V7', chord: V },
        { label: I, roman: 'Imaj7', chord: I },
      ];
    }
    return [
      { label: vi, roman: 'vim7', chord: vi },
      { label: ii, roman: 'iim7', chord: ii },
      { label: V, roman: 'V7', chord: V },
      { label: I, roman: 'Imaj7', chord: I },
    ];
  };

  const progChords = getProgressionChords();

  const playProgression = () => {
    progChords.forEach((item, i) => {
      playChordSymbol(item.chord, 1.35, i * 1.15);
    });
  };

  // Diatonic 7-note semicircle indices in Circle of Fifths: selectedIdx - 1 to selectedIdx + 5
  const diatonicSet = new Set([
    idxWrap(selectedIdx - 1),
    selectedIdx,
    idxWrap(selectedIdx + 1),
    idxWrap(selectedIdx + 2),
    idxWrap(selectedIdx + 3),
    idxWrap(selectedIdx + 4),
    idxWrap(selectedIdx + 5),
  ]);

  const cx = 200;
  const cy = 200;
  const outerR = 165;
  const midR = 112;
  const innerR = 66;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-5 my-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Circle */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[380px] h-auto select-none"
            role="img"
            aria-label="Círculo de quintas interactivo"
          >
            {/* Outer & Inner rings */}
            <circle
              cx={cx}
              cy={cy}
              r={outerR}
              className="fill-slate-50 dark:fill-slate-950 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth={1.5}
            />
            <circle
              cx={cx}
              cy={cy}
              r={midR}
              className="fill-slate-100/70 dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth={1.5}
            />
            <circle
              cx={cx}
              cy={cy}
              r={innerR}
              className="fill-white dark:fill-slate-950 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth={1.5}
            />

            {/* 12 Wedges */}
            {CIRCLE_KEYS.map((k, idx) => {
              const rad = ((k.angleDeg - 90) * Math.PI) / 180;
              const majorR = (outerR + midR) / 2;
              const minorR = (midR + innerR) / 2;
              const mx = cx + majorR * Math.cos(rad);
              const my = cy + majorR * Math.sin(rad);
              const nx = cx + minorR * Math.cos(rad);
              const ny = cy + minorR * Math.sin(rad);

              const isSelected = idx === selectedIdx;
              const isNeighborIV = idx === idxWrap(selectedIdx - 1);
              const isNeighborV = idx === idxWrap(selectedIdx + 1);
              const isInScale = diatonicSet.has(idx);

              // Divider line
              const divRad = ((k.angleDeg - 105) * Math.PI) / 180;
              const lx1 = cx + innerR * Math.cos(divRad);
              const ly1 = cy + innerR * Math.sin(divRad);
              const lx2 = cx + outerR * Math.cos(divRad);
              const ly2 = cy + outerR * Math.sin(divRad);

              return (
                <g key={k.major} onClick={() => setSelectedIdx(idx)} className="cursor-pointer">
                  <line
                    x1={lx1}
                    y1={ly1}
                    x2={lx2}
                    y2={ly2}
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth={1}
                  />

                  {/* Major key badge */}
                  <circle
                    cx={mx}
                    cy={my}
                    r={isSelected ? 22 : isNeighborIV || isNeighborV ? 19 : 16}
                    fill={
                      isSelected
                        ? '#DC2626'
                        : isNeighborIV || isNeighborV
                        ? '#D97706'
                        : isInScale
                        ? '#0284C7'
                        : 'transparent'
                    }
                    opacity={isSelected || isNeighborIV || isNeighborV || isInScale ? 0.92 : 0}
                  />
                  <text
                    x={mx}
                    y={my + 4.5}
                    textAnchor="middle"
                    className={`font-display text-[13px] font-bold ${
                      isSelected || isNeighborIV || isNeighborV || isInScale
                        ? 'fill-white'
                        : 'fill-slate-600 dark:fill-slate-400'
                    }`}
                  >
                    {cleanChord(k.major)}
                  </text>

                  {/* Relative minor label */}
                  <text
                    x={nx}
                    y={ny + 4}
                    textAnchor="middle"
                    className={`font-mono text-[10.5px] font-semibold ${
                      isSelected || isNeighborIV || isNeighborV
                        ? 'fill-amber-600 dark:fill-amber-400'
                        : 'fill-slate-500 dark:fill-slate-500'
                    }`}
                  >
                    {cleanChord(k.minor)}
                  </text>
                </g>
              );
            })}

            {/* Center Info */}
            <text
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              className="fill-slate-900 dark:fill-slate-100 font-display text-[20px] font-bold"
            >
              {keyI.major}
            </text>
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              className="fill-amber-600 dark:fill-amber-400 font-mono text-[12px] font-semibold"
            >
              Rel: {keyI.minor}
            </text>
            <text
              x={cx}
              y={cy + 28}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-mono text-[11px]"
            >
              Armadura: {keyI.sig}
            </text>
          </svg>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
            Haz clic en cualquier tonalidad del círculo para rotar las funciones y mini progresiones.
          </p>
        </div>

        {/* Right Control & Analysis Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Familia de acordes en {keyI.major} mayor
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">IV</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {cleanChord(keyIV.major)}maj7
                </div>
              </div>
              <div className="p-2 rounded bg-red-600/10 border border-red-500/40">
                <div className="text-red-500 dark:text-red-400">I (Tónica)</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {cleanChord(keyI.major)}maj7
                </div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">V</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {cleanChord(keyV.major)}7
                </div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">ii</div>
                <div className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                  {cleanChord(keyii.minor)}7
                </div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">vi</div>
                <div className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                  {cleanChord(keyvi.minor)}7
                </div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">iii</div>
                <div className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                  {cleanChord(keyiii.minor)}7
                </div>
              </div>
            </div>
          </div>

          {/* Mini Progression Selector & Audio */}
          <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Mini progresiones en {keyI.major}
            </div>
            <div className="flex gap-1.5 mb-3">
              {(['I-IV-V', 'ii-V-I', 'vi-ii-V-I'] as ProgPattern[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPattern(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    pattern === p
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {progChords.map((c, i) => (
                <button
                  key={`${c.chord}-${i}`}
                  type="button"
                  onClick={() => playChordSymbol(c.chord, 1.5)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors cursor-pointer text-left"
                >
                  <div className="text-[10px] font-mono text-slate-400">{c.roman}</div>
                  <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                    {c.label}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={playProgression}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Escuchar progresión {pattern} en {keyI.major}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
