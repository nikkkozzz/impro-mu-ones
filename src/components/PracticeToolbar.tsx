import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Timer, RotateCcw, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { MetronomeEngine, TimeSignature } from '../utils/audioEngine';

interface PracticeToolbarProps {
  suggestedBpm?: number;
  onTimerChange?: (elapsedSeconds: number) => void;
  onBpmChange?: (bpm: number) => void;
}

const TIME_SIGNATURES: TimeSignature[] = ['4/4', '3/4', '2/4', '6/8', '12/8'];

export const PracticeToolbar: React.FC<PracticeToolbarProps> = ({
  suggestedBpm,
  onTimerChange,
  onBpmChange,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [bpm, setBpm] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ipm_bpm_v1');
      return saved ? Math.max(40, Math.min(220, parseInt(saved, 10) || 80)) : 80;
    } catch {
      return 80;
    }
  });
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [beatsTwoFour, setBeatsTwoFour] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number>(-1);
  const [totalBeats, setTotalBeats] = useState<number>(4);

  // Practice Timer (Cronómetro) — explicitly recommended in Módulo 1.3
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Tap Tempo
  const tapTimesRef = useRef<number[]>([]);
  const engineRef = useRef<MetronomeEngine | null>(null);

  useEffect(() => {
    engineRef.current = new MetronomeEngine();
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ipm_bpm_v1', String(bpm));
    } catch {
      // Ignore storage errors in restricted iframe environments
    }
    onBpmChange?.(bpm);
    engineRef.current?.configure({
      bpm,
      timeSignature,
      beatsTwoFourOnly: beatsTwoFour,
      onBeat: (beat, total) => {
        setCurrentBeat(beat);
        setTotalBeats(total);
      },
    });
  }, [bpm, timeSignature, beatsTwoFour, onBpmChange]);

  useEffect(() => {
    onTimerChange?.(elapsedSec);
  }, [elapsedSec, onTimerChange]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const toggleMetronome = () => {
    if (!engineRef.current) return;
    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(-1);
    } else {
      engineRef.current.configure({
        bpm,
        timeSignature,
        beatsTwoFourOnly: beatsTwoFour,
        onBeat: (beat, total) => {
          setCurrentBeat(beat);
          setTotalBeats(total);
        },
      });
      engineRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleTapTempo = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      taps.length = 0;
    }
    taps.push(now);
    if (taps.length > 4) taps.shift();
    if (taps.length >= 2) {
      const diffs: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        diffs.push(taps[i] - taps[i - 1]);
      }
      const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const calcBpm = Math.round(60000 / avgMs);
      setBpm(Math.max(40, Math.min(220, calcBpm)));
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const visualDotsCount = totalBeats > 6 ? 4 : totalBeats;
  const activeDot = totalBeats > 6 ? Math.floor(currentBeat / 3) : currentBeat;

  return (
    <div className="sticky bottom-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-2.5">
        {/* Compact Header Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMetronome}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}
            >
              {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              Metrónomo
            </button>

            {/* Visual Beat Indicator */}
            <div className="flex items-center gap-1.5" aria-label="Indicador visual de pulso">
              {Array.from({ length: visualDotsCount }).map((_, idx) => {
                const isActive = isPlaying && activeDot === idx;
                const isTwoFourAccent = beatsTwoFour && timeSignature === '4/4' && (idx === 1 || idx === 3);
                const isDownbeat = !beatsTwoFour && idx === 0;
                return (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-transform ${
                      isActive
                        ? isTwoFourAccent || isDownbeat
                          ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                          : 'bg-sky-400 scale-110'
                        : isTwoFourAccent
                        ? 'bg-amber-500/30 border border-amber-500/60'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {bpm} <span className="text-xs font-normal text-slate-500">BPM</span>
            </span>

            {suggestedBpm && suggestedBpm !== bpm && (
              <button
                type="button"
                onClick={() => setBpm(suggestedBpm)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Usar {suggestedBpm} BPM de la lección
              </button>
            )}
          </div>

          {/* Right side: Cronómetro & Collapse */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-xs font-mono tabular-nums">
              <Timer className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatTime(elapsedSec)}
              </span>
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="ml-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {timerRunning ? 'Pausa' : 'Iniciar'}
              </button>
              {elapsedSec > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setElapsedSec(0);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Reiniciar cronómetro"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label={expanded ? 'Contraer controles de práctica' : 'Expandir controles de práctica'}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Metronome Controls */}
        {expanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {/* BPM Slider with explicit label & value */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
              <label htmlFor="metronome-bpm" className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                Tempo: {bpm} BPM
              </label>
              <input
                id="metronome-bpm"
                type="range"
                min={40}
                max={220}
                step={1}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Time Signatures */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1">Compás:</span>
              {TIME_SIGNATURES.map((sig) => (
                <button
                  key={sig}
                  type="button"
                  onClick={() => setTimeSignature(sig)}
                  className={`px-2 py-1 rounded text-xs font-mono font-semibold cursor-pointer transition-colors ${
                    timeSignature === sig
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sig}
                </button>
              ))}
            </div>

            {/* Beats 2 & 4 Jazz Mode */}
            <button
              type="button"
              onClick={() => {
                setTimeSignature('4/4');
                setBeatsTwoFour((v) => !v);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold cursor-pointer transition-colors ${
                beatsTwoFour && timeSignature === '4/4'
                  ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Modo Swing/Jazz: el metrónomo suena solo en los tiempos 2 y 4 (ver Módulo 4.2)"
            >
              <Activity className="w-3.5 h-3.5" />
              Modo 2 y 4
            </button>

            {/* Tap Tempo */}
            <button
              type="button"
              onClick={handleTapTempo}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500 cursor-pointer"
            >
              Tap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
