import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Repeat, Minus, Plus } from 'lucide-react';
import { ProgressionData } from '../data/types';
import { playChordSymbol, SequencePlayer } from '../utils/audioEngine';

interface ProgressionPlayerProps {
  data: ProgressionData;
}

const REGION_STYLES: Record<string, { border: string; label: string; text: string }> = {
  T: { border: 'border-sky-500/50 bg-sky-500/10', label: 'Tónica', text: 'text-sky-600 dark:text-sky-400' },
  S: { border: 'border-amber-500/50 bg-amber-500/10', label: 'Subdominante', text: 'text-amber-600 dark:text-amber-400' },
  D: { border: 'border-red-500/50 bg-red-500/10', label: 'Dominante', text: 'text-red-600 dark:text-red-400' },
  sec: { border: 'border-violet-500/50 bg-violet-500/10', label: 'Dom. Sec.', text: 'text-violet-600 dark:text-violet-400' },
};

export const ProgressionPlayer: React.FC<ProgressionPlayerProps> = ({ data }) => {
  const [bpm, setBpm] = useState(data.bpm || 90);
  const [loop, setLoop] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBar, setActiveBar] = useState(-1);
  const playerRef = useRef<SequencePlayer | null>(null);

  useEffect(() => {
    playerRef.current = new SequencePlayer();
    return () => playerRef.current?.stop();
  }, []);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
      setActiveBar(-1);
      return;
    }

    const beatsPerBar = data.beatsPerBar ?? 4;
    const steps = data.bars.map((b) => ({
      notes: [],
      durationBeats: beatsPerBar,
      chordSymbol: b.chord === '%' ? undefined : b.chord,
    }));

    // Fill '%' repeat symbols with previous chord
    let lastChord = 'C';
    steps.forEach((st) => {
      if (st.chordSymbol) {
        lastChord = st.chordSymbol;
      } else {
        st.chordSymbol = lastChord;
      }
    });

    setIsPlaying(true);
    playerRef.current.play(steps, bpm, {
      loop,
      onStep: (idx) => setActiveBar(idx),
      onEnd: () => {
        setIsPlaying(false);
        setActiveBar(-1);
      },
    });
  };

  const colsClass =
    (data.barsPerRow ?? 4) === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-4';

  const hasRegions = data.bars.some((b) => Boolean(b.region));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-4 sm:p-5 my-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
            {data.title}
          </h4>
          {data.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{data.subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 py-1 text-xs font-mono tabular-nums">
            <button
              type="button"
              onClick={() => setBpm((b) => Math.max(40, b - 10))}
              className="p-0.5 hover:text-amber-500 cursor-pointer"
              aria-label="Reducir tempo"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold">{bpm} BPM</span>
            <button
              type="button"
              onClick={() => setBpm((b) => Math.min(200, b + 10))}
              className="p-0.5 hover:text-amber-500 cursor-pointer"
              aria-label="Aumentar tempo"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setLoop((l) => !l)}
            className={`p-1.5 rounded-lg border cursor-pointer ${
              loop
                ? 'border-sky-500/60 bg-sky-500/15 text-sky-600 dark:text-sky-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="Repetir progresión"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isPlaying
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'Detener' : 'Tocar base'}
          </button>
        </div>
      </div>

      {/* Chord Bars Grid */}
      <div className={`grid ${colsClass} gap-2.5`}>
        {data.bars.map((bar, idx) => {
          const isCurrent = activeBar === idx;
          const regionStyle = bar.region ? REGION_STYLES[bar.region] : null;
          // Resolve '%' for click playback
          let resolvedChord = bar.chord;
          if (resolvedChord === '%') {
            for (let j = idx - 1; j >= 0; j--) {
              if (data.bars[j].chord !== '%') {
                resolvedChord = data.bars[j].chord;
                break;
              }
            }
          }

          return (
            <button
              key={`bar-${idx}`}
              type="button"
              onClick={() => playChordSymbol(resolvedChord, 1.6)}
              className={`relative rounded-lg border p-3 text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/60'
                  : regionStyle
                  ? regionStyle.border
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Compás {idx + 1}</span>
                {bar.roman && <span className="font-semibold text-slate-500 dark:text-slate-300">{bar.roman}</span>}
              </div>
              <div className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-50">
                {bar.chord}
              </div>
              {bar.note && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-tight">
                  {bar.note}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasRegions && (
        <div className="flex flex-wrap items-center gap-4 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
          {Object.entries(REGION_STYLES).map(([key, st]) => (
            <span key={key} className={`font-mono font-semibold ${st.text}`}>
              ● {st.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
