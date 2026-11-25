import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sun,
  Moon,
  Guitar,
  BarChart3,
} from 'lucide-react';
import { COURSE_MODULES, ALL_LESSONS } from './data/course';
import { Sidebar } from './components/Sidebar';
import { LessonRenderer } from './components/LessonRenderer';
import { PracticeToolbar } from './components/PracticeToolbar';
import { PracticeLog } from './components/PracticeLog';
import { StatsDashboard } from './components/StatsDashboard';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  CompletedDatesStore,
  getTodayISO,
  readCompletedDatesStore,
  writeCompletedDatesStore,
} from './utils/practiceStats';

const STORAGE_COMPLETED_KEY = 'ipm_completed_lessons_v1';
const STORAGE_CURRENT_KEY = 'ipm_current_lesson_v1';
const STORAGE_THEME_KEY = 'ipm_theme_v1';

function safeStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted iframe or private browsing contexts
  }
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = safeStorageGet(STORAGE_THEME_KEY);
    return saved ? saved === 'dark' : true; // Dark mode default for practice comfort
  });

  const [currentLessonId, setCurrentLessonId] = useState<string>(() => {
    const saved = safeStorageGet(STORAGE_CURRENT_KEY);
    if (saved && ALL_LESSONS.some((l) => l.id === saved)) {
      return saved;
    }
    return ALL_LESSONS[0].id;
  });

  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const raw = safeStorageGet(STORAGE_COMPLETED_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set<string>(arr);
      }
    } catch {
      // ignore corrupted storage
    }
    return new Set<string>();
  });

  const [completedDates, setCompletedDates] = useState<CompletedDatesStore>(() => {
    const stored = readCompletedDatesStore();
    const today = getTodayISO();
    const next = { ...stored };
    completedIds.forEach((id) => {
      if (!next[id]) next[id] = today;
    });
    return next;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [logRevision, setLogRevision] = useState(0);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(0);
  const [activeMetronomeBpm, setActiveMetronomeBpm] = useState<number | undefined>(undefined);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    safeStorageSet(STORAGE_THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    safeStorageSet(STORAGE_CURRENT_KEY, currentLessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLessonId, showStats]);

  useEffect(() => {
    safeStorageSet(STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(completedIds)));
  }, [completedIds]);

  useEffect(() => {
    writeCompletedDatesStore(completedDates);
  }, [completedDates]);

  const currentIndex = useMemo(
    () => Math.max(0, ALL_LESSONS.findIndex((l) => l.id === currentLessonId)),
    [currentLessonId]
  );

  const currentLesson = ALL_LESSONS[currentIndex] ?? ALL_LESSONS[0];
  const currentModule = useMemo(
    () => COURSE_MODULES.find((m) => m.id === currentLesson.moduleId) ?? COURSE_MODULES[0],
    [currentLesson]
  );

  const prevLesson = currentIndex > 0 ? ALL_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[currentIndex + 1] : null;
  const isCompleted = completedIds.has(currentLesson.id);
  const progressPct = Math.round((completedIds.size / ALL_LESSONS.length) * 100);

  const toggleComplete = () => {
    const willBeCompleted = !completedIds.has(currentLesson.id);
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (willBeCompleted) next.add(currentLesson.id);
      else next.delete(currentLesson.id);
      return next;
    });
    setCompletedDates((prev) => {
      const next = { ...prev };
      if (willBeCompleted) next[currentLesson.id] = getTodayISO();
      else delete next[currentLesson.id];
      return next;
    });
  };

  const completeAndNext = () => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(currentLesson.id);
      return next;
    });
    setCompletedDates((prev) => {
      if (prev[currentLesson.id]) return prev;
      return { ...prev, [currentLesson.id]: getTodayISO() };
    });
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setShowStats(false);
  };

  // Keyboard shortcuts (Left/Right arrows for quick lesson stepping)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.altKey && e.key === 'ArrowRight' && nextLesson) {
        setCurrentLessonId(nextLesson.id);
      } else if (e.altKey && e.key === 'ArrowLeft' && prevLesson) {
        setCurrentLessonId(prevLesson.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevLesson, nextLesson]);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Persistent / Responsive Course Sidebar */}
      <Sidebar
        modules={COURSE_MODULES}
        currentLessonId={currentLesson.id}
        completedIds={completedIds}
        totalLessons={ALL_LESSONS.length}
        showingStats={showStats}
        onOpenStats={() => setShowStats(true)}
        onSelectLesson={handleSelectLesson}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Single-Row Top Bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Abrir índice del curso"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 min-w-0 text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                <Guitar className="w-4 h-4 text-amber-500 shrink-0 hidden sm:block" />
                {showStats ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400 truncate">
                    Panel de Estadísticas Global
                  </span>
                ) : (
                  <>
                    <span className="truncate">
                      Módulo {currentModule.number}: {currentModule.title}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                      Lección {currentLesson.code}
                    </span>
                    <span className="hidden md:inline text-slate-300 dark:text-slate-700">·</span>
                    <span className="hidden md:inline shrink-0">{currentLesson.bookPages}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Compact Progress Indicator */}
              <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                <span>
                  {currentIndex + 1}/{ALL_LESSONS.length}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {progressPct}% completado
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowStats((s) => !s)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  showStats
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
                title="Abrir panel de estadísticas globales"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>

              <PWAInstallButton />

              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Lesson Content Canvas or Global Stats Dashboard */}
        <main ref={mainRef} className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          {showStats ? (
            <StatsDashboard
              modules={COURSE_MODULES}
              allLessons={ALL_LESSONS}
              completedIds={completedIds}
              completedDates={completedDates}
              logRevision={logRevision}
              darkMode={darkMode}
              onBackToLesson={() => setShowStats(false)}
              onSelectLesson={handleSelectLesson}
            />
          ) : (
            <>
          {/* Lesson Hero Header */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                <span>Módulo {currentModule.number}</span>
                <span>·</span>
                <span>Paso {currentIndex + 1} de {ALL_LESSONS.length}</span>
                <span>·</span>
                <span>Páginas del libro: {currentLesson.bookPages}</span>
              </div>

              <button
                type="button"
                onClick={toggleComplete}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {isCompleted ? 'Completado' : 'Marcar como completado'}
              </button>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
              {currentLesson.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {currentLesson.summary}
            </p>
          </div>

          {/* Interactive Lesson Body */}
          <LessonRenderer key={currentLesson.id} lesson={currentLesson} />

          {/* Per-Lesson Daily Practice Log */}
          <PracticeLog
            lessonId={currentLesson.id}
            lessonCode={currentLesson.code}
            lessonTitle={currentLesson.shortTitle}
            suggestedBpm={currentLesson.suggestedBpm}
            activeTimerSeconds={activeTimerSeconds}
            activeMetronomeBpm={activeMetronomeBpm}
            onLogChange={() => setLogRevision((r) => r + 1)}
          />

          {/* Bottom Stepper Navigation */}
          <nav
            aria-label="Navegación entre lecciones"
            className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
          >
            {prevLesson ? (
              <button
                type="button"
                onClick={() => setCurrentLessonId(prevLesson.id)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/60 transition-colors text-left cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    Lección anterior
                  </div>
                  <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {prevLesson.code} {prevLesson.shortTitle}
                  </div>
                </div>
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={toggleComplete}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-600/15 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                {isCompleted ? 'Lección completada' : 'Marcar completado'}
              </button>

              {nextLesson && (
                <button
                  type="button"
                  onClick={completeAndNext}
                  className="flex items-center justify-between sm:justify-end gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors text-left sm:text-right cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono uppercase text-slate-900/75 font-semibold">
                      Siguiente lección
                    </div>
                    <div className="font-display font-bold text-sm truncate">
                      {nextLesson.code} {nextLesson.shortTitle}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              )}
            </div>
          </nav>
            </>
          )}
        </main>

        {/* Integrated Metronome + Practice Cronómetro */}
        <PracticeToolbar
          suggestedBpm={currentLesson.suggestedBpm}
          onTimerChange={setActiveTimerSeconds}
          onBpmChange={setActiveMetronomeBpm}
        />
      </div>

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
