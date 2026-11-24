import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { CourseModule } from '../data/types';

interface SidebarProps {
  modules: CourseModule[];
  currentLessonId: string;
  completedIds: Set<string>;
  totalLessons: number;
  showingStats: boolean;
  onOpenStats: () => void;
  onSelectLesson: (lessonId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  currentLessonId,
  completedIds,
  totalLessons,
  showingStats,
  onOpenStats,
  onSelectLesson,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [query, setQuery] = useState('');
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());

  const completedCount = completedIds.size;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleModule = (modId: string) => {
    setCollapsedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modules;
    return modules
      .map((m) => ({
        ...m,
        lessons: m.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.shortTitle.toLowerCase().includes(q) ||
            l.summary.toLowerCase().includes(q) ||
            l.bookPages.toLowerCase().includes(q) ||
            l.code.toLowerCase().includes(q)
        ),
      }))
      .filter((m) => m.lessons.length > 0);
  }, [modules, query]);

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      {/* Course Identity & Overall Progress */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                Improvisación para Muñones
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Curso completo · pp. 1–353
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Cerrar índice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-400">Progreso del curso</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {completedCount}/{totalLessons} ({pct}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Global Stats Button */}
        <button
          type="button"
          onClick={() => {
            onOpenStats();
            onCloseMobile();
          }}
          className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            showingStats
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Panel de Estadísticas
        </button>

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tema, escala, página..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Modules & Lessons List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2" aria-label="Índice del curso">
        {filteredModules.map((mod) => {
          const isCollapsed = collapsedModules.has(mod.id) && !query;
          const modDone = mod.lessons.filter((l) => completedIds.has(l.id)).length;

          return (
            <div key={mod.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                      Módulo {mod.number} · {mod.bookPages}
                    </div>
                    <div className="font-display font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {mod.title}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                  {modDone}/{mod.lessons.length}
                </span>
              </button>

              {!isCollapsed && (
                <ul className="pl-2 space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const isActive = !showingStats && lesson.id === currentLessonId;
                    const isDone = completedIds.has(lesson.id);

                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectLesson(lesson.id);
                            onCloseMobile();
                          }}
                          className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isActive ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="leading-snug">
                              <span className="font-mono text-[11px] opacity-70 mr-1.5">
                                {lesson.code}
                              </span>
                              {lesson.shortTitle}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {lesson.bookPages}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {filteredModules.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
            No se encontraron lecciones para «{query}».
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile slide-over sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85vw] h-full z-10">{content}</div>
        </div>
      )}
    </>
  );
};
