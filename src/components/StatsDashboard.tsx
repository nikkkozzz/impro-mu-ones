import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  CalendarDays,
  Gauge,
  BarChart3,
  TrendingUp,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { CourseModule, Lesson } from '../data/types';
import {
  computeGlobalStats,
  formatDurationHM,
  readPracticeLogStore,
  CompletedDatesStore,
} from '../utils/practiceStats';

interface StatsDashboardProps {
  modules: CourseModule[];
  allLessons: Lesson[];
  completedIds: Set<string>;
  completedDates: CompletedDatesStore;
  logRevision: number;
  darkMode: boolean;
  onBackToLesson: () => void;
  onSelectLesson: (lessonId: string) => void;
}

type WeeklyChartMode = 'combined' | 'weekly' | 'cumulative';

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  modules,
  allLessons,
  completedIds,
  completedDates,
  logRevision,
  darkMode,
  onBackToLesson,
  onSelectLesson,
}) => {
  const [weeklyMode, setWeeklyMode] = useState<WeeklyChartMode>('combined');

  const stats = useMemo(() => {
    const logStore = readPracticeLogStore();
    return computeGlobalStats(modules, allLessons, completedIds, logStore, completedDates);
    // logRevision ensures fresh recalculation whenever the user saves/deletes a log entry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules, allLessons, completedIds, completedDates, logRevision]);

  const axisTickColor = darkMode ? '#94A3B8' : '#64748B';
  const gridColor = darkMode ? '#1E293B' : '#E2E8F0';
  const tooltipBg = darkMode ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = darkMode ? '#334155' : '#CBD5E1';
  const tooltipText = darkMode ? '#F8FAFC' : '#0F172A';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Panel de Estadísticas Global</span>
            <span>·</span>
            <span>Datos en tiempo real</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-tight">
            Tu Evolución en la Guitarra
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Visualiza el tiempo total de práctica acumulado por semana, el ritmo de lecciones completadas y tu avance en cada módulo del curso.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToLesson}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-500 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lección
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span>Tiempo acumulado</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
            {formatDurationHM(stats.totalMinutes)}
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            {stats.totalSessions} {stats.totalSessions === 1 ? 'sesión' : 'sesiones'} · media {stats.avgMinutesPerSession}m
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span>Lecciones completadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
            {stats.completedCount}
            <span className="text-base font-mono font-normal text-slate-400">
              /{stats.totalLessons}
            </span>
          </div>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-1 tabular-nums">
            {stats.completionPercent}% del curso total
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span>Días con práctica</span>
            <CalendarDays className="w-4 h-4 text-sky-500" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
            {stats.activeDays}
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            {stats.activeDays > 0 ? 'Constancia registrada' : 'Registra tu primer día'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span>Máximo BPM limpio</span>
            <Gauge className="w-4 h-4 text-violet-500" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
            {stats.maxBpm ? `${stats.maxBpm}` : '—'}
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            {stats.maxBpm ? 'Récord en diario de práctica' : 'Sin BPM registrado aún'}
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Chart 1: Weekly & Accumulated Practice Time */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Tiempo de práctica acumulado por semana
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Minutos practicados cada semana (barras) y total acumulado (línea).
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5 text-[11px] font-mono">
              {(
                [
                  { id: 'combined', label: 'Ambos' },
                  { id: 'weekly', label: 'Semanal' },
                  { id: 'cumulative', label: 'Acumulado' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setWeeklyMode(tab.id)}
                  className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    weeklyMode === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stats.weeklyData}
                margin={{ top: 10, right: 12, left: -10, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="weekLabel"
                  tick={{ fill: axisTickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: axisTickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  unit="m"
                  allowDecimals={false}
                />
                {weeklyMode === 'combined' && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#38BDF8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    unit="m"
                    allowDecimals={false}
                  />
                )}
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '10px',
                    color: tooltipText,
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(value: unknown, name: unknown) => {
                    const num = Number(value) || 0;
                    const label =
                      name === 'minutes'
                        ? 'Esta semana'
                        : name === 'cumulativeMinutes'
                        ? 'Total acumulado'
                        : String(name);
                    return [formatDurationHM(num), label];
                  }}
                />
                {(weeklyMode === 'combined' || weeklyMode === 'weekly') && (
                  <Bar
                    yAxisId="left"
                    dataKey="minutes"
                    name="minutes"
                    fill="#F59E0B"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={36}
                  />
                )}
                {(weeklyMode === 'combined' || weeklyMode === 'cumulative') && (
                  <Line
                    yAxisId={weeklyMode === 'combined' ? 'right' : 'left'}
                    type="monotone"
                    dataKey="cumulativeMinutes"
                    name="cumulativeMinutes"
                    stroke="#0EA5E9"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0EA5E9', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#38BDF8' }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              {(weeklyMode === 'combined' || weeklyMode === 'weekly') && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                  Minutos/semana
                </span>
              )}
              {(weeklyMode === 'combined' || weeklyMode === 'cumulative') && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                  Total acumulado
                </span>
              )}
            </div>
            {stats.totalMinutes === 0 && (
              <span className="text-amber-600 dark:text-amber-400">
                Registra sesiones en el Diario de Práctica para llenar esta gráfica
              </span>
            )}
          </div>
        </div>

        {/* Chart 2: Completed Lessons Over Time */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Progreso de lecciones completadas en el tiempo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evolución acumulada de lecciones completadas sobre un total de {stats.totalLessons}.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              <TrendingUp className="w-4 h-4" />
              {stats.completedCount}/{stats.totalLessons} ({stats.completionPercent}%)
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.progressData}
                margin={{ top: 10, right: 16, left: -12, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="completedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: axisTickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, Math.max(stats.totalLessons, 5)]}
                  tick={{ fill: axisTickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <ReferenceLine
                  y={stats.totalLessons}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: `Meta: ${stats.totalLessons}`,
                    position: 'insideTopRight',
                    fill: '#F59E0B',
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '10px',
                    color: tooltipText,
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(value: unknown, name: unknown) => {
                    const num = Number(value) || 0;
                    if (name === 'cumulativeCompleted') {
                      return [`${num} de ${stats.totalLessons} lecciones`, 'Completadas acumuladas'];
                    }
                    return [String(num), String(name)];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeCompleted"
                  name="cumulativeCompleted"
                  stroke="#10B981"
                  strokeWidth={2.6}
                  fill="url(#completedAreaGrad)"
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#34D399' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Lecciones acumuladas
            </span>
            {stats.completedCount === 0 && (
              <span className="text-emerald-600 dark:text-emerald-400">
                Marca tus primeras lecciones como completadas para ver tu curva crecer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Progress by Module + Recent Practice Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Per-Module Breakdown */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4.5 h-4.5 text-amber-500" />
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Avance y tiempo por módulo
            </h2>
          </div>

          <div className="space-y-4">
            {stats.moduleStats.map((mod) => (
              <div key={mod.moduleId} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-sm">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    <span className="font-mono text-amber-600 dark:text-amber-400 mr-1.5">
                      M{mod.number}
                    </span>
                    {mod.title}
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {mod.completedLessons}/{mod.totalLessons}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span className="text-sky-600 dark:text-sky-400">
                      {formatDurationHM(mod.minutesPracticed)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${mod.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Practice Log Activity */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/85 p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-sky-500" />
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Sesiones recientes registradas
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              Últimas {stats.recentSessions.length}
            </span>
          </div>

          {stats.recentSessions.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentSessions.map((session) => (
                <button
                  key={`${session.lessonId}-${session.id}`}
                  type="button"
                  onClick={() => onSelectLesson(session.lessonId)}
                  className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 hover:border-amber-500/60 p-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono mb-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400 truncate">
                      {session.lessonCode} {session.lessonTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                      {session.date} · {session.minutes}m
                      {session.bpmReached ? ` · ${session.bpmReached} BPM` : ''}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:text-amber-500" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {session.progressNotes || session.struggles}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Todavía no hay sesiones guardadas en tu Diario de Práctica.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Al final de cada lección encontrarás el formulario para registrar tus minutos diarios, BPM y dificultades.
              </p>
              <button
                type="button"
                onClick={onBackToLesson}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Ir a registrar mi primera sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
