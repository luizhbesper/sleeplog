import { z } from "zod";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function durationMinutes(sleepStart: string, wakeTime: string): number {
  const start = toMinutes(sleepStart);
  const wake = toMinutes(wakeTime);
  return wake > start ? wake - start : wake + 24 * 60 - start;
}

// The wake instant can fall on the next calendar day, so both ends are derived
// from the sleep instant rather than from `date` alone.
function instants(date: string, sleepStart: string, wakeTime: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = sleepStart.split(":").map(Number);
  const sleepAt = new Date(y, m - 1, d, h, min);
  const wakeAt = new Date(
    sleepAt.getTime() + durationMinutes(sleepStart, wakeTime) * 60_000,
  );
  return { sleepAt, wakeAt };
}

export const sleepEntrySchema = z
  .object({
    date: z.string().regex(DATE, "Invalid date"),
    sleepStart: z.string().regex(TIME, "Invalid time"),
    wakeTime: z.string().regex(TIME, "Invalid time"),
    notes: z.string().max(280).optional(),
  })
  .refine((e) => e.sleepStart !== e.wakeTime, {
    message: "Sleep and wake time can't be identical",
    path: ["wakeTime"],
  })
  .refine(
    (e) => instants(e.date, e.sleepStart, e.wakeTime).sleepAt <= new Date(),
    {
      message: "Sleep time is in the future",
      path: ["sleepStart"],
    },
  )
  .refine(
    (e) => instants(e.date, e.sleepStart, e.wakeTime).wakeAt <= new Date(),
    {
      message: "Wake time is in the future",
      path: ["wakeTime"],
    },
  );

export type SleepEntryInput = z.infer<typeof sleepEntrySchema>;
export type SleepEntry = SleepEntryInput & { id: string };

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${WEEKDAYS[new Date(y, m - 1, d).getDay()]}, ${MONTHS[m - 1]} ${d}`;
}

export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const toTimeString = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
