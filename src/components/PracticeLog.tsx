import React, { useState, useEffect, useMemo } from 'react';
import {
  NotebookPen,
  Plus,
  Clock,
  Calendar,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Gauge,
  Timer,
} from 'lucide-react';

export interface PracticeLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  bpmReached?: number;
  progressNotes: string;
  struggles: string;
  createdAt: number;
}

type PracticeLogStore = Record<string, PracticeLogEntry[]>;

const STORAGE_LOG_KEY = 'ipm_practice_log_v1';
const MINUTE_PRESETS = [10, 15, 20, 30, 45];

function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTotalDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function readPracticeStore(): PracticeLogStore {
  try {
    const raw = localStorage.getItem(STORAGE_LOG_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as PracticeLogStore;
    }
  } catch {
    // Ignore storage read errors
  }
  return {};
}

function writePracticeStore(store: PracticeLogStore): void {
  try {
    localStorage.setItem(STORAGE_LOG_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage write errors in restricted environments
  }
}

interface PracticeLogProps {
  lessonId: string;
  lessonCode: string;
  lessonTitle: string;
  suggestedBpm?: number;
  activeTimerSeconds?: number;
  activeMetronomeBpm?: number;
  onLogChange?: () => void;
}

export const PracticeLog: React.FC<PracticeLogProps> = ({
  lessonId,
  lessonCode,
  lessonTitle,
  suggestedBpm,
  activeTimerSeconds = 0,
  activeMetronomeBpm,
  onLogChange,
}) => {
  const [entries, setEntries] = useState<PracticeLogEntry[]>(() => {
    const store = readPracticeStore();
    return Array.isArray(store[lessonId]) ? store[lessonId] : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [date, setDate] = useState<string>(getTodayISO);
  const [minutes, setMinutes] = useState<number>(20);
  const [bpmInput, setBpmInput] = useState<string>(suggestedBpm ? String(suggestedBpm) : '');
  const [progressNotes, setProgressNotes] = useState<string>('');
  const [struggles, setStruggles] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync entries whenever the active lesson changes
  useEffect(() => {
    const store = readPracticeStore();
    setEntries(Array.isArray(store[lessonId]) ? store[lessonId] : []);
    setIsFormOpen(false);
    setEditingId(null);
    setConfirmDeleteId(null);
    setValidationError(null);
    setDate(getTodayISO());
    setMinutes(20);
    setBpmInput(suggestedBpm ? String(suggestedBpm) : '');
    setProgressNotes('');
    setStruggles('');
  }, [lessonId, suggestedBpm]);

  const persistLessonEntries = (nextEntries: PracticeLogEntry[]) => {
    const sorted = [...nextEntries].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt - a.createdAt;
    });
    setEntries(sorted);
    const store = readPracticeStore();
    if (sorted.length === 0) {
      delete store[lessonId];
    } else {
      store[lessonId] = sorted;
    }
    writePracticeStore(store);
    onLogChange?.();
  };

  const stats = useMemo(() => {
    const totalMinutes = entries.reduce((sum, e) => sum + (Number(e.minutes) || 0), 0);
    const bpms = entries.map((e) => e.bpmReached).filter((b): b is number => typeof b === 'number' && b > 0);
    const maxBpm = bpms.length > 0 ? Math.max(...bpms) : null;
    return {
      sessions: entries.length,
      totalMinutes,
      maxBpm,
    };
  }, [entries]);

  const resetForm = () => {
    setEditingId(null);
    setDate(getTodayISO());
    setMinutes(20);
    setBpmInput(suggestedBpm ? String(suggestedBpm) : '');
    setProgressNotes('');
    setStruggles('');
    setValidationError(null);
  };

  const openNewForm = () => {
    resetForm();
    if (activeTimerSeconds >= 60) {
      setMinutes(Math.max(1, Math.round(activeTimerSeconds / 60)));
    }
    if (activeMetronomeBpm) {
      setBpmInput(String(activeMetronomeBpm));
    }
    setIsFormOpen(true);
  };

  const startEdit = (entry: PracticeLogEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setMinutes(entry.minutes);
    setBpmInput(entry.bpmReached ? String(entry.bpmReached) : '');
    setProgressNotes(entry.progressNotes);
    setStruggles(entry.struggles);
    setValidationError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanProgress = progressNotes.trim();
    const cleanStruggles = struggles.trim();
    const parsedMinutes = Math.max(1, Math.min(600, Math.round(Number(minutes) || 0)));

    if (!cleanProgress && !cleanStruggles) {
      setValidationError('Escribe al menos una nota de progreso o una dificultad específica para guardar la sesión.');
      return;
    }

    const parsedBpm = bpmInput.trim() ? parseInt(bpmInput.trim(), 10) : undefined;
    const validBpm =
      parsedBpm && !Number.isNaN(parsedBpm) && parsedBpm >= 30 && parsedBpm <= 260
        ? parsedBpm
        : undefined;

    if (editingId) {
      const updated = entries.map((item) =>
        item.id === editingId
          ? {
              ...item,
              date: date || getTodayISO(),
              minutes: parsedMinutes,
              bpmReached: validBpm,
              progressNotes: cleanProgress,
              struggles: cleanStruggles,
            }
          : item
      );
      persistLessonEntries(updated);
    } else {
      const newEntry: PracticeLogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: date || getTodayISO(),
        minutes: parsedMinutes,
        bpmReached: validBpm,
        progressNotes: cleanProgress,
        struggles: cleanStruggles,
        createdAt: Date.now(),
      };
      persistLessonEntries([newEntry, ...entries]);
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const filtered = entries.filter((item) => item.id !== id);
    persistLessonEntries(filtered);
    setConfirmDeleteId(null);
    if (editingId === id) {
      setIsFormOpen(false);
      resetForm();
    }
  };

  const timerMinutes = Math.round(activeTimerSeconds / 60);

  return (
    <section
      aria-label={`Diario de práctica de la lección ${lessonCode}`}
      className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/75 p-5 sm:p-6">
        {/* Header & Metrics */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <NotebookPen className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                Diario de Práctica · Lección {lessonCode}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              <span>
                {stats.sessions} {stats.sessions === 1 ? 'sesión registrada' : 'sesiones registradas'}
              </span>
              <span>·</span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                {formatTotalDuration(stats.totalMinutes)} acumulados
              </span>
              {stats.maxBpm && (
                <>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Máx. {stats.maxBpm} BPM
                  </span>
                </>
              )}
            </div>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={openNewForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              Registrar sesión de hoy
            </button>
          )}
        </div>

        {/* Add / Edit Session Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200">
                {editingId ? 'Editar registro de práctica' : `Nueva nota diaria para «${lessonTitle}»`}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Cerrar formulario"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Row 1: Date, Minutes, BPM */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Date */}
              <div>
                <label
                  htmlFor="practice-date"
                  className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 mb-1.5"
                >
                  Fecha
                </label>
                <input
                  id="practice-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Minutes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="practice-minutes"
                    className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400"
                  >
                    Tiempo (minutos)
                  </label>
                  {timerMinutes >= 1 && (
                    <button
                      type="button"
                      onClick={() => setMinutes(timerMinutes)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      <Timer className="w-3 h-3" />
                      Usar cronómetro ({timerMinutes}m)
                    </button>
                  )}
                </div>
                <input
                  id="practice-minutes"
                  type="number"
                  min={1}
                  max={600}
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-amber-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {MINUTE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMinutes(preset)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                        minutes === preset
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>
              </div>

              {/* BPM Reached (optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="practice-bpm"
                    className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400"
                  >
                    BPM limpio (opcional)
                  </label>
                  {activeMetronomeBpm && (
                    <button
                      type="button"
                      onClick={() => setBpmInput(String(activeMetronomeBpm))}
                      className="text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Metrónomo ({activeMetronomeBpm})
                    </button>
                  )}
                </div>
                <input
                  id="practice-bpm"
                  type="number"
                  min={30}
                  max={260}
                  placeholder={suggestedBpm ? `Ej. ${suggestedBpm}` : 'Ej. 80'}
                  value={bpmInput}
                  onChange={(e) => setBpmInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-slate-900 dark:text-slate-100 tabular-nums placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Row 2: Progress Notes & Specific Struggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="practice-progress"
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Avances y progreso de hoy
                </label>
                <textarea
                  id="practice-progress"
                  rows={3}
                  value={progressNotes}
                  onChange={(e) => {
                    setProgressNotes(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Ej. Hoy logré enlazar G7 → C7 en negras a 80 BPM sin mirar la tablatura y cantando las fundamentales..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 resize-y"
                />
              </div>

              <div>
                <label
                  htmlFor="practice-struggles"
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold text-red-700 dark:text-red-400 mb-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Dificultades específicas a trabajar
                </label>
                <textarea
                  id="practice-struggles"
                  rows={3}
                  value={struggles}
                  onChange={(e) => {
                    setStruggles(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Ej. Me cuesta el salto de púa alterna en la bajada de la 2ª a la 3ª cuerda y me adelanto en el cambio al compás 9..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-red-500 resize-y"
                />
              </div>
            </div>

            {validationError && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">{validationError}</p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {editingId ? 'Guardar cambios' : 'Guardar sesión'}
              </button>
            </div>
          </form>
        )}

        {/* Saved Entries List */}
        {entries.length > 0 ? (
          <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {entries.map((entry) => {
              const isDeleting = confirmDeleteId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {formatDisplayDate(entry.date)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {entry.minutes} min
                      </span>
                      {entry.bpmReached && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Gauge className="w-3.5 h-3.5" />
                            {entry.bpmReached} BPM
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isDeleting ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="text-red-500 dark:text-red-400">¿Eliminar?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            className="px-2 py-0.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer"
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(entry)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Editar nota"
                            aria-label="Editar nota"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(entry.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Eliminar nota"
                            aria-label="Eliminar nota"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {entry.progressNotes && (
                      <div className={!entry.struggles ? 'md:col-span-2' : ''}>
                        <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                          Progreso
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {entry.progressNotes}
                        </p>
                      </div>
                    )}

                    {entry.struggles && (
                      <div className={!entry.progressNotes ? 'md:col-span-2' : ''}>
                        <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-red-700 dark:text-red-400 mb-1">
                          Dificultades a reforzar
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {entry.struggles}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !isFormOpen && (
            <p className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-sm text-slate-500 dark:text-slate-400">
              Aún no has registrado sesiones en esta lección. Anota cada día cuánto tiempo has practicado, tus avances y qué puntos te han costado para medir tu evolución real.
            </p>
          )
        )}
      </div>
    </section>
  );
};
