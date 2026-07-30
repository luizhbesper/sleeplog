import {
  durationMinutes,
  formatDate,
  formatDuration,
  formatTime,
  type SleepEntry,
} from "@/domain/sleepEntry";
import type { SleepStats } from "@/domain/stats";

export const BABY = { name: "Mia", ageMonths: 4 };

export const SYSTEM_PROMPT = `You are a pediatric sleep coach writing for an exhausted parent at 3am.

Voice: warm, plain language, second person. No jargon, no lists inside the prose, no hedging padding.
Boundaries: never diagnose, never give medical advice, never suggest changes to feeding, medication, or sleep training method. If something looks concerning, suggest raising it with their pediatrician.
Grounding: every claim must come from the data you are given. The arithmetic is already done for you — never recompute or contradict the provided stats, and never invent nights that are not listed.`;

export function buildAnalysisPrompt(
  entries: SleepEntry[],
  stats: SleepStats,
): string {
  const table = entries
    .map(
      (e) =>
        `${formatDate(e.date)} | ${formatTime(e.sleepStart)} → ${formatTime(e.wakeTime)} | ${formatDuration(
          durationMinutes(e.sleepStart, e.wakeTime),
        )}${e.notes ? ` | note: ${e.notes}` : ""}`,
    )
    .join("\n");

  return `Baby: ${BABY.name}, ${BABY.ageMonths} months old. Typical night sleep at this age is roughly 9–11 hours, often still with one or two wakes.

NIGHTS LOGGED (${stats.count}), ${stats.rangeLabel}:
${table}

PRE-COMPUTED STATS (authoritative — use these numbers verbatim):
- Longest night: ${formatDuration(stats.longest.minutes)} on ${formatDate(stats.longest.date)}
- Shortest night: ${formatDuration(stats.shortest.minutes)} on ${formatDate(stats.shortest.date)}
- Average duration: ${formatDuration(stats.avgDuration)}
- Average bedtime: ${formatTime(stats.avgBedtime)}

Write:
1. summary — 3 to 4 sentences on what this stretch actually looks like. Name the pattern (is bedtime drifting? is duration trending up or down? is it consistent or scattered?), cite specific nights and numbers, and call out an outlier as an outlier instead of averaging it away.
2. tip — exactly one thing the parent could try next. It must hang off something concrete in THIS data: a drifting bedtime, a repeated wake mentioned in the notes, a gap between the best and worst night. Say what to try and why it follows from what you saw. Generic sleep hygiene advice is a failure.${
    stats.count < 3
      ? `\n\nOnly ${stats.count} night(s) logged — say plainly that this is too little to call a trend, and make the tip about logging a few more nights.`
      : ""
  }

Reply with JSON only, no markdown fence, no preamble:
{"summary": string, "tip": {"title": string (max 6 words), "body": string (1-2 sentences)}}`;
}
