import { z } from "zod";
import {
  buildAnalysisPrompt,
  SYSTEM_PROMPT,
} from "@/business/sleepAnalysisPrompt";
import type { SleepEntry } from "@/domain/sleepEntry";
import type { SleepStats } from "@/domain/stats";

// ponytail: key in the bundle for the interview build — move to a backend proxy before shipping.
const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? "";
const MODEL = "claude-sonnet-4-6";

export const analysisSchema = z.object({
  summary: z.string().min(1),
  tip: z.object({ title: z.string().min(1), body: z.string().min(1) }),
});

export type Analysis = z.infer<typeof analysisSchema>;

export function parseAnalysis(text: string): Analysis {
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return analysisSchema.parse(JSON.parse(json));
}

export async function analyzeSleep(
  entries: SleepEntry[],
  stats: SleepStats,
): Promise<Analysis> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: buildAnalysisPrompt(entries, stats) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  }

  const body = await res.json();
  return parseAnalysis(body.content?.[0]?.text ?? "");
}
