import { CourseModule, Lesson } from '../data/types';
import { PracticeLogEntry } from '../components/PracticeLog';

export const STORAGE_LOG_KEY = 'ipm_practice_log_v1';
export const STORAGE_COMPLETED_DATES_KEY = 'ipm_completed_dates_v1';

export type PracticeLogStore = Record<string, PracticeLogEntry[]>;
export type CompletedDatesStore = Record<string, string>; // lessonId -> YYYY-MM-DD

export function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function readPracticeLogStore(): PracticeLogStore {
  try {
    const raw = localStorage.getItem(STORAGE_LOG_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as PracticeLogStore;
    }
  } catch {
    // ignore storage errors
  }
  return {};
}

export function readCompletedDatesStore(): CompletedDatesStore {
  try {
    const raw = localStorage.getItem(STORAGE_COMPLETED_DATES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as CompletedDatesStore;
    }
  } catch {
    // ignore storage errors
  }
  return {};
}

export function writeCompletedDatesStore(store: CompletedDatesStore): void {
  try {
    localStorage.setItem(STORAGE_COMPLETED_DATES_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the Monday (start of week) for any given date.
 */
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = Sun, 1 = Mon...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export interface WeeklyPracticePoint {
  weekKey: string; // YYYY-MM-DD (Monday)
  weekLabel: string; // e.g., "16 nov"
  minutes: number;
  cumulativeMinutes: number;
  sessions: number;
}

export interface LessonProgressPoint {
  dateKey: string;
  label: string;
  completedOnDate: number;
  cumulativeCompleted: number;
  percent: number;
}

export interface ModuleStat {
  moduleId: string;
  number: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  minutesPracticed: number;
  sessions: number;
}

export interface FlatSessionItem extends PracticeLogEntry {
  lessonId: string;
  lessonCode: string;
  lessonTitle: string;
}

export interface GlobalPracticeStats {
  totalMinutes: number;
  totalSessions: number;
  activeDays: number;
  avgMinutesPerSession: number;
  maxBpm: number | null;
  completedCount: number;
  totalLessons: number;
  completionPercent: number;
  weeklyData: WeeklyPracticePoint[];
  progressData: LessonProgressPoint[];
  moduleStats: ModuleStat[];
  recentSessions: FlatSessionItem[];
}

export function formatDurationHM(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0 min';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function computeGlobalStats(
  modules: CourseModule[],
  allLessons: Lesson[],
  completedIds: Set<string>,
  logStore: PracticeLogStore,
  completedDates: CompletedDatesStore
): GlobalPracticeStats {
  const lessonMap = new Map<string, Lesson>();
  allLessons.forEach((l) => lessonMap.set(l.id, l));

  // 1. Flatten all sessions
  const flatSessions: FlatSessionItem[] = [];
  const uniqueDays = new Set<string>();
  const minutesByLesson = new Map<string, number>();
  const sessionsByLesson = new Map<string, number>();

  Object.entries(logStore).forEach(([lessonId, entries]) => {
    if (!Array.isArray(entries)) return;
    const lesson = lessonMap.get(lessonId);
    entries.forEach((entry) => {
      const mins = Math.max(0, Number(entry.minutes) || 0);
      if (entry.date) uniqueDays.add(entry.date);
      minutesByLesson.set(lessonId, (minutesByLesson.get(lessonId) ?? 0) + mins);
      sessionsByLesson.set(lessonId, (sessionsByLesson.get(lessonId) ?? 0) + 1);

      flatSessions.push({
        ...entry,
        minutes: mins,
        lessonId,
        lessonCode: lesson?.code ?? '',
        lessonTitle: lesson?.shortTitle ?? lessonId,
      });
    });
  });

  flatSessions.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.createdAt - a.createdAt;
  });

  const totalMinutes = flatSessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalSessions = flatSessions.length;
  const avgMinutesPerSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  const bpms = flatSessions
    .map((s) => s.bpmReached)
    .filter((b): b is number => typeof b === 'number' && b > 0);
  const maxBpm = bpms.length > 0 ? Math.max(...bpms) : null;

  // 2. Weekly Practice Series (last 8 weeks, expanding earlier if older sessions exist)
  const today = new Date();
  const currentMonday = getMondayOfWeek(today);
  const defaultStartMonday = new Date(currentMonday);
  defaultStartMonday.setDate(defaultStartMonday.getDate() - 7 * 7); // 8 weeks total including current

  let earliestMonday = defaultStartMonday;
  flatSessions.forEach((s) => {
    if (!s.date) return;
    const mon = getMondayOfWeek(parseISODate(s.date));
    if (mon < earliestMonday) earliestMonday = mon;
  });

  // Cap at 16 weeks so the chart stays crisp and legible
  const maxStartMonday = new Date(currentMonday);
  maxStartMonday.setDate(maxStartMonday.getDate() - 15 * 7);
  if (earliestMonday < maxStartMonday) earliestMonday = maxStartMonday;

  const weeklyBuckets = new Map<string, { minutes: number; sessions: number; date: Date }>();
  const cursor = new Date(earliestMonday);
  while (cursor <= currentMonday) {
    const key = toISODate(cursor);
    weeklyBuckets.set(key, { minutes: 0, sessions: 0, date: new Date(cursor) });
    cursor.setDate(cursor.getDate() + 7);
  }

  let preWindowMinutes = 0;
  flatSessions.forEach((s) => {
    if (!s.date) return;
    const mon = getMondayOfWeek(parseISODate(s.date));
    const key = toISODate(mon);
    const bucket = weeklyBuckets.get(key);
    if (bucket) {
      bucket.minutes += s.minutes;
      bucket.sessions += 1;
    } else if (mon < earliestMonday) {
      preWindowMinutes += s.minutes;
    }
  });

  const weeklyData: WeeklyPracticePoint[] = [];
  let runningMinutes = preWindowMinutes;
  Array.from(weeklyBuckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([weekKey, info]) => {
      runningMinutes += info.minutes;
      weeklyData.push({
        weekKey,
        weekLabel: `Sem. ${formatShortDate(info.date)}`,
        minutes: info.minutes,
        cumulativeMinutes: runningMinutes,
        sessions: info.sessions,
      });
    });

  // 3. Lessons Completed Over Time (cumulative progression across dates)
  const todayISO = getTodayISO();
  const completionsByDate = new Map<string, number>();

  completedIds.forEach((id) => {
    const dateKey = completedDates[id] || todayISO;
    completionsByDate.set(dateKey, (completionsByDate.get(dateKey) ?? 0) + 1);
  });

  // Build timeline from either last 7 days or earliest completion date up to today
  const progressDates: string[] = [];
  const defaultProgStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  let earliestProgDate = defaultProgStart;

  completionsByDate.forEach((_count, dKey) => {
    const parsed = parseISODate(dKey);
    if (parsed < earliestProgDate) earliestProgDate = parsed;
  });

  const dayDiff = Math.round(
    (today.getTime() - earliestProgDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const progressData: LessonProgressPoint[] = [];
  const totalLessons = allLessons.length;

  if (dayDiff <= 21) {
    // Daily granularity when span is up to 3 weeks
    const dayCursor = new Date(earliestProgDate);
    const endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    while (dayCursor <= endDay) {
      progressDates.push(toISODate(dayCursor));
      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    let cumulative = 0;
    progressDates.forEach((dateKey) => {
      const onDate = completionsByDate.get(dateKey) ?? 0;
      cumulative += onDate;
      progressData.push({
        dateKey,
        label: formatShortDate(parseISODate(dateKey)),
        completedOnDate: onDate,
        cumulativeCompleted: cumulative,
        percent: totalLessons > 0 ? Math.round((cumulative / totalLessons) * 100) : 0,
      });
    });
  } else {
    // Weekly granularity when history spans more than 3 weeks
    const weekStart = getMondayOfWeek(earliestProgDate);
    const weekMap = new Map<string, { count: number; date: Date }>();
    const wCursor = new Date(weekStart);
    while (wCursor <= currentMonday) {
      weekMap.set(toISODate(wCursor), { count: 0, date: new Date(wCursor) });
      wCursor.setDate(wCursor.getDate() + 7);
    }
    completionsByDate.forEach((count, dKey) => {
      const monKey = toISODate(getMondayOfWeek(parseISODate(dKey)));
      const b = weekMap.get(monKey);
      if (b) b.count += count;
    });
    let cumulative = 0;
    Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([weekKey, info]) => {
        cumulative += info.count;
        progressData.push({
          dateKey: weekKey,
          label: `Sem. ${formatShortDate(info.date)}`,
          completedOnDate: info.count,
          cumulativeCompleted: cumulative,
          percent: totalLessons > 0 ? Math.round((cumulative / totalLessons) * 100) : 0,
        });
      });
  }

  // 4. Module breakdown
  const moduleStats: ModuleStat[] = modules.map((mod) => {
    let modCompleted = 0;
    let modMinutes = 0;
    let modSessions = 0;
    mod.lessons.forEach((l) => {
      if (completedIds.has(l.id)) modCompleted += 1;
      modMinutes += minutesByLesson.get(l.id) ?? 0;
      modSessions += sessionsByLesson.get(l.id) ?? 0;
    });
    const modTotal = mod.lessons.length;
    return {
      moduleId: mod.id,
      number: mod.number,
      title: mod.title,
      totalLessons: modTotal,
      completedLessons: modCompleted,
      percent: modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0,
      minutesPracticed: modMinutes,
      sessions: modSessions,
    };
  });

  return {
    totalMinutes,
    totalSessions,
    activeDays: uniqueDays.size,
    avgMinutesPerSession,
    maxBpm,
    completedCount: completedIds.size,
    totalLessons,
    completionPercent: totalLessons > 0 ? Math.round((completedIds.size / totalLessons) * 100) : 0,
    weeklyData,
    progressData,
    moduleStats,
    recentSessions: flatSessions.slice(0, 8),
  };
}
