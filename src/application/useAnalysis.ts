import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { type Analysis, analyzeSleep } from "@/application/anthropic";
import { useSleepLog } from "@/application/useSleepLog";
import { computeStats } from "@/domain/stats";

type State =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "success"; analysis: Analysis }
  | { status: "error"; message: string };

export function useAnalysis() {
  const { entries } = useSleepLog();
  const [state, setState] = useState<State>({ status: "empty" });
  const analyzedKey = useRef<string | null>(null);

  const stats = computeStats(entries);
  const key = entries.map((e) => e.id).join(",");

  const run = useCallback(async () => {
    if (!stats) return setState({ status: "empty" });
    analyzedKey.current = key;
    setState({ status: "loading" });
    try {
      setState({
        status: "success",
        analysis: await analyzeSleep(entries, stats),
      });
    } catch (e) {
      analyzedKey.current = null;
      setState({ status: "error", message: (e as Error).message });
    }
  }, [entries, stats, key]);

  // Re-runs on focus only when the entries changed since the last analysis.
  useFocusEffect(
    useCallback(() => {
      if (analyzedKey.current !== key) run();
    }, [key, run]),
  );

  return { state, stats, entryCount: entries.length, retry: run };
}
