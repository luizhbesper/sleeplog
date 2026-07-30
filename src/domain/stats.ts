import {
  durationMinutes,
  formatDate,
  type SleepEntry,
} from "@/domain/sleepEntry";

export type SleepStats = {
  count: number;
  longest: { minutes: number; date: string };
  shortest: { minutes: number; date: string };
  avgDuration: number;
  avgBedtime: string;
  rangeLabel: string;
};

// Bedtimes before noon belong to the next day — shift them so the average
// doesn't get dragged back toward midday.
const bedtimeMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m;
  return total < 12 * 60 ? total + 24 * 60 : total;
};

export function computeStats(entries: SleepEntry[]): SleepStats | null {
  if (!entries.length) return null;

  const nights = entries.map((e) => ({
    date: e.date,
    minutes: durationMinutes(e.sleepStart, e.wakeTime),
    bedtime: bedtimeMinutes(e.sleepStart),
  }));

  const longest = nights.reduce((a, b) => (b.minutes > a.minutes ? b : a));
  const shortest = nights.reduce((a, b) => (b.minutes < a.minutes ? b : a));
  const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

  const avgBed =
    Math.round(sum(nights.map((n) => n.bedtime)) / nights.length) % (24 * 60);
  const dates = entries.map((e) => e.date).sort();

  return {
    count: entries.length,
    longest: { minutes: longest.minutes, date: longest.date },
    shortest: { minutes: shortest.minutes, date: shortest.date },
    avgDuration: Math.round(sum(nights.map((n) => n.minutes)) / nights.length),
    avgBedtime: `${String(Math.floor(avgBed / 60)).padStart(2, "0")}:${String(avgBed % 60).padStart(2, "0")}`,
    rangeLabel: `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`,
  };
}
