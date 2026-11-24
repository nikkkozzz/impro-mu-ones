import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Volume2, Square, RotateCcw } from 'lucide-react';
import { FretboardData, FretNoteRole } from '../data/types';
import { playGuitarNote, SequencePlayer, stringFretToMidi, midiToNoteName } from '../utils/audioEngine';

interface FretboardSVGProps {
  data: FretboardData;
  compact?: boolean;
}

const ROLE_STYLES: Record<
  FretNoteRole,
  { fill: string; stroke: string; text: string; legend: string }
> = {
  root: {
    fill: '#DC2626',
    stroke: '#FCA5A5',
    text: '#FFFFFF',
    legend: 'Fundamental (1)',
  },
  chord: {
    fill: '#0284C7',
    stroke: '#BAE6FD',
    text: '#FFFFFF',
    legend: 'Nota de arpegio / acorde',
  },
  scale: {
    fill: '#334155',
    stroke: '#94A3B8',
    text: '#F8FAFC',
    legend: 'Nota de escala',
  },
  characteristic: {
    fill: '#D97706',
    stroke: '#FDE68A',
    text: '#FFFFFF',
    legend: 'Nota característica / tensión',
  },
  passing: {
    fill: '#7C3AED',
    stroke: '#DDD6FE',
    text: '#FFFFFF',
    legend: 'Nota de paso (NP / Blue note)',
  },
  approach: {
    fill: '#059669',
    stroke: '#A7F3D0',
    text: '#FFFFFF',
    legend: 'Aproximación cromática',
  },
  avoid: {
    fill: '#475569',
    stroke: '#F87171',
    text: '#FCA5A5',
    legend: 'Nota a evitar',
  },
};

const INLAY_FRETS = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21]);
const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']; // 1 to 6

export const FretboardSVG: React.FC<FretboardSVGProps> = ({ data, compact = false }) => {
  const [transpose, setTranspose] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastClickedNote, setLastClickedNote] = useState<string | null>(null);
  const playerRef = useRef<SequencePlayer | null>(null);

  useEffect(() => {
    playerRef.current = new SequencePlayer();
    return () => {
      playerRef.current?.stop();
    };
  }, []);

  const effectiveStartFret = Math.max(0, data.startFret + transpose);
  const numFrets = data.numFrets;
  const showNut = effectiveStartFret === 0;

  // Dimensions tuned for readability at arm's length while holding a guitar
  const leftPad = 48;
  const rightPad = 24;
  const topPad = compact ? 30 : 38;
  const bottomPad = compact ? 32 : 38;
  const fretWidth = compact ? 52 : 66;
  const stringGap = compact ? 26 : 32;

  const boardWidth = numFrets * fretWidth;
  const boardHeight = 5 * stringGap;
  const svgWidth = leftPad + boardWidth + rightPad;
  const svgHeight = topPad + boardHeight + bottomPad;

  const transposedNotes = useMemo(() => {
    return data.notes.map((n) => ({
      ...n,
      fret: n.fret + transpose,
      approachTo: n.approachTo
        ? { string: n.approachTo.string, fret: n.approachTo.fret + transpose }
        : undefined,
    }));
  }, [data.notes, transpose]);

  const getNoteX = (fret: number) => {
    if (fret === 0 && showNut) {
      return leftPad - 18;
    }
    const relFret = showNut ? fret : fret - effectiveStartFret + 1;
    return leftPad + (relFret - 0.5) * fretWidth;
  };

  // String 1 (high e) at top (y = topPad), String 6 (low E) at bottom (y = topPad + 5*stringGap)
  // Matches standard guitar tab & book diagram orientation!
  const getStringY = (stringNum: number) => {
    return topPad + (stringNum - 1) * stringGap;
  };

  const handleNoteClick = (stringNum: number, fret: number) => {
    if (fret < 0) return;
    playGuitarNote(stringNum, fret, 1.15);
    const key = `${stringNum}-${fret}`;
    setActiveKey(key);
    const midi = stringFretToMidi(stringNum, fret);
    setLastClickedNote(`${midiToNoteName(midi)} (Cuerda ${stringNum}ª, Traste ${fret})`);
    window.setTimeout(() => {
      setActiveKey((prev) => (prev === key ? null : prev));
    }, 450);
  };

  const handlePlayAll = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
      setActiveKey(null);
      return;
    }

    const ordered = data.playOrder
      ? data.playOrder.map((p) => ({ string: p.string, fret: p.fret + transpose }))
      : [...transposedNotes]
          .filter((n) => n.fret >= 0)
          .sort((a, b) => stringFretToMidi(a.string, a.fret) - stringFretToMidi(b.string, b.fret));

    const steps = ordered.map((n) => ({
      notes: [{ string: n.string, fret: n.fret }],
      durationBeats: 0.65,
    }));

    setIsPlaying(true);
    playerRef.current.play(steps, 108, {
      onStep: (idx) => {
        if (idx >= 0 && ordered[idx]) {
          setActiveKey(`${ordered[idx].string}-${ordered[idx].fret}`);
        } else {
          setActiveKey(null);
        }
      },
      onEnd: () => {
        setIsPlaying(false);
        setActiveKey(null);
      },
    });
  };

  // Determine unique roles present in this diagram for a clean legend
  const presentRoles = useMemo(() => {
    const set = new Set<FretNoteRole>();
    data.notes.forEach((n) => set.add(n.role));
    return Array.from(set);
  }, [data.notes]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 sm:p-5 my-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-snug">
            {data.title}
            {transpose !== 0 && (
              <span className="ml-2 font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
                ({transpose > 0 ? `+${transpose}` : transpose} trastes)
              </span>
            )}
          </h4>
          {data.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{data.subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.transposable && (
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 py-1 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 mr-1">Transportar:</span>
              <button
                type="button"
                onClick={() => setTranspose((t) => Math.max(-data.startFret, t - 1))}
                className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                aria-label="Bajar un traste"
              >
                −1
              </button>
              <button
                type="button"
                onClick={() => setTranspose((t) => Math.min(12 - data.startFret, t + 1))}
                className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                aria-label="Subir un traste"
              >
                +1
              </button>
              {transpose !== 0 && (
                <button
                  type="button"
                  onClick={() => setTranspose(0)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-500"
                  title="Volver a posición original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handlePlayAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
            {isPlaying ? 'Detener' : 'Escuchar secuencia'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[340px] max-w-[780px] mx-auto select-none"
          role="img"
          aria-label={`Diagrama de mástil: ${data.title}`}
        >
          <defs>
            <marker
              id="approach-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 7 3.5, 0 7" fill="#10B981" />
            </marker>
          </defs>

          {/* Rosewood/Ebony Fretboard Surface */}
          <rect
            x={leftPad}
            y={topPad - 8}
            width={boardWidth}
            height={boardHeight + 16}
            rx={4}
            className="fill-slate-100 dark:fill-[#131926] stroke-slate-300 dark:stroke-slate-700"
            strokeWidth={1.5}
          />

          {/* Nut or Left Edge */}
          <line
            x1={leftPad}
            y1={topPad - 8}
            x2={leftPad}
            y2={topPad + boardHeight + 8}
            stroke={showNut ? '#F59E0B' : '#64748B'}
            strokeWidth={showNut ? 5.5 : 2}
          />

          {/* Fret Wires & Fret Numbers */}
          {Array.from({ length: numFrets }).map((_, idx) => {
            const fretNumber = showNut ? idx + 1 : effectiveStartFret + idx;
            const wireX = leftPad + (idx + 1) * fretWidth;
            const centerX = leftPad + (idx + 0.5) * fretWidth;
            const isInlay = INLAY_FRETS.has(fretNumber);
            const isDoubleInlay = fretNumber === 12;

            return (
              <g key={`fret-${idx}`}>
                <line
                  x1={wireX}
                  y1={topPad - 8}
                  x2={wireX}
                  y2={topPad + boardHeight + 8}
                  className="stroke-slate-300 dark:stroke-slate-600/80"
                  strokeWidth={1.6}
                />

                {/* Fretboard Position Inlays */}
                {isInlay && !isDoubleInlay && (
                  <circle
                    cx={centerX}
                    cy={topPad + boardHeight / 2}
                    r={5}
                    className="fill-slate-300/70 dark:fill-slate-700/70"
                  />
                )}
                {isDoubleInlay && (
                  <>
                    <circle
                      cx={centerX}
                      cy={topPad + stringGap * 1.5}
                      r={5}
                      className="fill-slate-300/70 dark:fill-slate-700/70"
                    />
                    <circle
                      cx={centerX}
                      cy={topPad + stringGap * 3.5}
                      r={5}
                      className="fill-slate-300/70 dark:fill-slate-700/70"
                    />
                  </>
                )}

                {/* Fret Number Labels (bottom) */}
                <text
                  x={centerX}
                  y={topPad + boardHeight + 25}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 font-mono text-[12px] font-semibold"
                >
                  {fretNumber}
                </text>
              </g>
            );
          })}

          {/* Open fret label if nut shown */}
          {showNut && (
            <text
              x={leftPad - 18}
              y={topPad + boardHeight + 25}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500 font-mono text-[11px]"
            >
              0
            </text>
          )}

          {/* Guitar Strings (1 = thin high e at top, 6 = thick low E at bottom) */}
          {STRING_LABELS.map((strName, idx) => {
            const y = topPad + idx * stringGap;
            const thickness = 1.1 + idx * 0.42;
            return (
              <g key={`str-${idx}`}>
                <text
                  x={14}
                  y={y + 4}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 font-mono text-[13px] font-bold"
                >
                  {strName}
                </text>
                <line
                  x1={leftPad}
                  y1={y}
                  x2={leftPad + boardWidth}
                  y2={y}
                  className="stroke-slate-400 dark:stroke-slate-500"
                  strokeWidth={thickness}
                />
              </g>
            );
          })}

          {/* Optional Barre Bar */}
          {data.barre && (
            <rect
              x={getNoteX(data.barre.fret + transpose) - 11}
              y={getStringY(Math.min(data.barre.fromString, data.barre.toString)) - 11}
              width={22}
              height={
                Math.abs(data.barre.toString - data.barre.fromString) * stringGap + 22
              }
              rx={11}
              fill="rgba(245, 158, 11, 0.22)"
              stroke="#F59E0B"
              strokeWidth={1.8}
              strokeDasharray="4 2"
            />
          )}

          {/* Approach Arrows */}
          {transposedNotes.map((n, idx) => {
            if (!n.approachTo) return null;
            const x1 = getNoteX(n.fret);
            const y1 = getStringY(n.string);
            const x2 = getNoteX(n.approachTo.fret);
            const y2 = getStringY(n.approachTo.string);
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy) || 1;
            const trim = 15;
            return (
              <line
                key={`arr-${idx}`}
                x1={x1 + (dx / len) * trim}
                y1={y1 + (dy / len) * trim}
                x2={x2 - (dx / len) * trim}
                y2={y2 - (dy / len) * trim}
                stroke="#10B981"
                strokeWidth={2.2}
                markerEnd="url(#approach-arrow)"
              />
            );
          })}

          {/* Interactive Notes */}
          {transposedNotes.map((n, idx) => {
            if (n.fret < 0) return null;
            const x = getNoteX(n.fret);
            const y = getStringY(n.string);
            const style = ROLE_STYLES[n.role];
            const key = `${n.string}-${n.fret}`;
            const isActive = activeKey === key;
            const radius = compact ? 11.5 : 13.5;

            return (
              <g
                key={`note-${idx}`}
                onClick={() => handleNoteClick(n.string, n.fret)}
                className="cursor-pointer group"
              >
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={radius + 6}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth={3}
                    opacity={0.9}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={isActive ? '#F59E0B' : style.fill}
                  stroke={isActive ? '#FEF3C7' : style.stroke}
                  strokeWidth={n.role === 'root' ? 2.4 : 1.7}
                  strokeDasharray={n.role === 'avoid' ? '3 2' : undefined}
                />
                <text
                  x={x}
                  y={y + 4.2}
                  textAnchor="middle"
                  fill={isActive ? '#0F172A' : style.text}
                  className="font-mono font-bold pointer-events-none"
                  fontSize={n.label && n.label.length > 2 ? (compact ? 9 : 10) : (compact ? 11 : 12)}
                >
                  {n.label ?? ''}
                </text>
                {n.finger && (
                  <text
                    x={x}
                    y={y - radius - 4}
                    textAnchor="middle"
                    className="fill-amber-600 dark:fill-amber-400 font-mono text-[9.5px] font-bold pointer-events-none"
                  >
                    d{n.finger}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive feedback + color legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {presentRoles.map((role) => (
            <span key={role} className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shrink-0"
                style={{
                  backgroundColor: ROLE_STYLES[role].fill,
                  border: `1.5px solid ${ROLE_STYLES[role].stroke}`,
                }}
              />
              <span>{ROLE_STYLES[role].legend}</span>
            </span>
          ))}
        </div>
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {lastClickedNote ? `Nota: ${lastClickedNote}` : 'Pulsa cualquier nota del mástil para escucharla'}
        </span>
      </div>
      {data.legend && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 italic">{data.legend}</p>
      )}
    </div>
  );
};
