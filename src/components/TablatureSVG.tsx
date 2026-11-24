import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Square, Repeat, Minus, Plus } from 'lucide-react';
import { TablatureData } from '../data/types';
import { SequencePlayer, SequenceStep } from '../utils/audioEngine';

interface TablatureSVGProps {
  data: TablatureData;
}

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];

export const TablatureSVG: React.FC<TablatureSVGProps> = ({ data }) => {
  const [bpm, setBpm] = useState(data.bpm || 80);
  const [swing, setSwing] = useState(Boolean(data.swing));
  const [loop, setLoop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGlobalIdx, setActiveGlobalIdx] = useState<number>(-1);
  const playerRef = useRef<SequencePlayer | null>(null);

  useEffect(() => {
    playerRef.current = new SequencePlayer();
    return () => {
      playerRef.current?.stop();
    };
  }, []);

  // Flatten all beats for audio playback and global highlight tracking
  const flatSteps = useMemo(() => {
    const steps: SequenceStep[] = [];
    data.measures.forEach((m) => {
      m.beats.forEach((b) => {
        steps.push({
          notes: b.notes.map((n) => ({ string: n.string, fret: n.fret })),
          durationBeats: b.duration,
          isRest: b.isRest,
          chordSymbol: b.notes.length === 0 && !b.isRest ? m.chord : undefined,
        });
      });
    });
    return steps;
  }, [data.measures]);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
      setActiveGlobalIdx(-1);
      return;
    }

    setIsPlaying(true);
    playerRef.current.play(flatSteps, bpm, {
      swing,
      loop,
      onStep: (idx) => setActiveGlobalIdx(idx),
      onEnd: () => {
        setIsPlaying(false);
        setActiveGlobalIdx(-1);
      },
    });
  };

  // Group measures into clean rows of up to 4 measures so tablature stays large & readable
  const measuresPerRow = data.measures.length <= 2 ? data.measures.length : data.measures.length === 3 ? 3 : 4;
  const rows = useMemo(() => {
    const result: Array<{ startMeasureIdx: number; startBeatIdx: number; measures: typeof data.measures }> = [];
    let beatCursor = 0;
    for (let i = 0; i < data.measures.length; i += measuresPerRow) {
      const slice = data.measures.slice(i, i + measuresPerRow);
      result.push({
        startMeasureIdx: i,
        startBeatIdx: beatCursor,
        measures: slice,
      });
      slice.forEach((m) => {
        beatCursor += m.beats.length;
      });
    }
    return result;
  }, [data.measures, measuresPerRow]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-4 sm:p-5 my-5">
      {/* Header + Audio Transport */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            {data.exampleNum && <span>{data.exampleNum}</span>}
            {data.exampleNum && <span>·</span>}
            <span>{data.timeSignature ?? '4/4'}</span>
            <span>·</span>
            <span>{swing ? 'Swing' : 'Recto'}</span>
          </div>
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg mt-0.5">
            {data.title}
          </h4>
          {data.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{data.subtitle}</p>
          )}
        </div>

        {/* Transport Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 py-1 text-xs font-mono tabular-nums">
            <button
              type="button"
              onClick={() => setBpm((b) => Math.max(40, b - 5))}
              className="p-0.5 hover:text-amber-500 cursor-pointer"
              aria-label="Bajar tempo 5 BPM"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">{bpm} BPM</span>
            <button
              type="button"
              onClick={() => setBpm((b) => Math.min(200, b + 5))}
              className="p-0.5 hover:text-amber-500 cursor-pointer"
              aria-label="Subir tempo 5 BPM"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSwing((s) => !s)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
              swing
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Alternar sensación rítmica Recto / Swing"
          >
            {swing ? 'Swing' : 'Recto'}
          </button>

          <button
            type="button"
            onClick={() => setLoop((l) => !l)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              loop
                ? 'border-sky-500/60 bg-sky-500/15 text-sky-600 dark:text-sky-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Repetir en bucle"
            aria-label="Repetir en bucle"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'Detener' : 'Reproducir TAB'}
          </button>
        </div>
      </div>

      {/* SVG Tablature Rows */}
      <div className="space-y-4 overflow-x-auto">
        {rows.map((row, rowIdx) => {
          const leftPad = 36;
          const rightPad = 16;
          const topPad = 42;
          const stringGap = 20;
          const staffH = 5 * stringGap;
          const bottomPad = 44;
          const svgH = topPad + staffH + bottomPad;

          // Calculate widths proportionally by beats in each measure
          const minSlotW = 36;
          const measureWidths = row.measures.map((m) =>
            Math.max(150, m.beats.length * minSlotW + 24)
          );
          const totalW = leftPad + measureWidths.reduce((a, b) => a + b, 0) + rightPad;

          let xCursor = leftPad;
          let globalBeat = row.startBeatIdx;

          return (
            <svg
              key={`row-${rowIdx}`}
              viewBox={`0 0 ${totalW} ${svgH}`}
              className="w-full h-auto min-w-[520px] select-none"
              role="img"
              aria-label={`Tablatura ${data.title} sistema ${rowIdx + 1}`}
            >
              {/* TAB Clef / String names */}
              {STRING_NAMES.map((sName, sIdx) => {
                const y = topPad + sIdx * stringGap;
                return (
                  <g key={`st-${sIdx}`}>
                    <text
                      x={14}
                      y={y + 4}
                      textAnchor="middle"
                      className="fill-slate-400 dark:fill-slate-500 font-mono text-[11px] font-bold"
                    >
                      {sName}
                    </text>
                    <line
                      x1={leftPad}
                      y1={y}
                      x2={totalW - rightPad}
                      y2={y}
                      className="stroke-slate-300 dark:stroke-slate-700"
                      strokeWidth={1.15}
                    />
                  </g>
                );
              })}

              {/* Left starting barline */}
              <line
                x1={leftPad}
                y1={topPad}
                x2={leftPad}
                y2={topPad + staffH}
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth={2}
              />

              {/* Render each measure */}
              {row.measures.map((measure, mIdx) => {
                const mW = measureWidths[mIdx];
                const mStartX = xCursor;
                xCursor += mW;
                const slotW = (mW - 20) / Math.max(1, measure.beats.length);

                return (
                  <g key={`m-${mIdx}`}>
                    {/* Chord symbol & Roman numeral above measure */}
                    {measure.chord && (
                      <text
                        x={mStartX + 10}
                        y={20}
                        className="fill-amber-600 dark:fill-amber-400 font-display text-[15px] font-bold"
                      >
                        {measure.chord}
                      </text>
                    )}
                    {measure.roman && (
                      <text
                        x={mStartX + (measure.chord ? 10 + measure.chord.length * 10 + 8 : 10)}
                        y={20}
                        className="fill-slate-500 dark:fill-slate-400 font-mono text-[12px] font-medium"
                      >
                        {measure.roman}
                      </text>
                    )}

                    {/* Measure end barline */}
                    <line
                      x1={mStartX + mW}
                      y1={topPad}
                      x2={mStartX + mW}
                      y2={topPad + staffH}
                      className="stroke-slate-400 dark:stroke-slate-500"
                      strokeWidth={mIdx === row.measures.length - 1 && rowIdx === rows.length - 1 ? 3 : 1.5}
                    />

                    {/* Beats inside measure */}
                    {measure.beats.map((beat, bIdx) => {
                      const thisGlobalIdx = globalBeat;
                      globalBeat += 1;
                      const cx = mStartX + 10 + (bIdx + 0.5) * slotW;
                      const isActive = activeGlobalIdx === thisGlobalIdx;
                      const stemTop = topPad + staffH + 8;
                      const stemBottom = topPad + staffH + 24;

                      return (
                        <g key={`b-${bIdx}`}>
                          {/* Active Playhead Column */}
                          {isActive && (
                            <rect
                              x={cx - 13}
                              y={topPad - 8}
                              width={26}
                              height={staffH + 16}
                              rx={6}
                              fill="rgba(245, 158, 11, 0.22)"
                              stroke="#F59E0B"
                              strokeWidth={1.5}
                            />
                          )}

                          {/* Picking / Strumming Arrow above staff */}
                          {beat.pick && (
                            <text
                              x={cx}
                              y={topPad - 8}
                              textAnchor="middle"
                              className="fill-sky-600 dark:fill-sky-400 font-mono text-[12px] font-bold"
                            >
                              {beat.pick === 'down' ? '↓' : '↑'}
                            </text>
                          )}

                          {/* Rest marker */}
                          {beat.isRest ? (
                            <text
                              x={cx}
                              y={topPad + staffH / 2 + 5}
                              textAnchor="middle"
                              className="fill-slate-400 dark:fill-slate-500 font-mono text-[14px] font-bold"
                            >
                              𝄽
                            </text>
                          ) : (
                            beat.notes.map((n, nIdx) => {
                              const ny = topPad + (n.string - 1) * stringGap;
                              const fretLabel = `${n.fret}${n.tech ?? ''}`;
                              const boxW = fretLabel.length > 1 ? 22 : 16;
                              return (
                                <g key={`tn-${nIdx}`}>
                                  <rect
                                    x={cx - boxW / 2}
                                    y={ny - 8.5}
                                    width={boxW}
                                    height={17}
                                    rx={3}
                                    className={
                                      isActive
                                        ? 'fill-amber-500'
                                        : 'fill-white dark:fill-slate-900'
                                    }
                                  />
                                  <text
                                    x={cx}
                                    y={ny + 4.8}
                                    textAnchor="middle"
                                    className={`font-mono text-[14px] font-bold ${
                                      isActive
                                        ? 'fill-slate-950'
                                        : 'fill-slate-900 dark:fill-slate-100'
                                    }`}
                                  >
                                    {fretLabel}
                                  </text>
                                </g>
                              );
                            })
                          )}

                          {/* Rhythmic stem indicator below staff */}
                          {!beat.isRest && beat.duration < 4 && (
                            <g>
                              <line
                                x1={cx}
                                y1={stemTop}
                                x2={cx}
                                y2={beat.duration >= 2 ? stemTop + 11 : stemBottom}
                                className="stroke-slate-500 dark:stroke-slate-400"
                                strokeWidth={1.6}
                              />
                              {/* Eighth note flag/beam hint */}
                              {beat.duration <= 0.5 && (
                                <line
                                  x1={cx}
                                  y1={stemBottom}
                                  x2={cx + 8}
                                  y2={stemBottom - 3}
                                  className="stroke-slate-500 dark:stroke-slate-400"
                                  strokeWidth={2}
                                />
                              )}
                              {/* Half note hollow circle */}
                              {beat.duration >= 2 && (
                                <circle
                                  cx={cx}
                                  cy={stemTop + 14}
                                  r={3}
                                  fill="none"
                                  className="stroke-slate-500 dark:stroke-slate-400"
                                  strokeWidth={1.5}
                                />
                              )}
                            </g>
                          )}

                          {/* Degree / fingering label below rhythm */}
                          {beat.label && (
                            <text
                              x={cx}
                              y={topPad + staffH + 39}
                              textAnchor="middle"
                              className="fill-slate-500 dark:fill-slate-400 font-mono text-[10.5px] font-semibold"
                            >
                              {beat.label}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          );
        })}
      </div>

      {data.footerNote && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
          {data.footerNote}
        </p>
      )}
    </div>
  );
};
