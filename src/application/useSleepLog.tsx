import { createContext, type ReactNode, useContext, useState } from "react";
import type { SleepEntry, SleepEntryInput } from "@/domain/sleepEntry";

type SleepLog = {
  entries: SleepEntry[];
  addEntry: (input: SleepEntryInput) => void;
};

const SleepLogContext = createContext<SleepLog | null>(null);

const byDateDesc = (a: SleepEntry, b: SleepEntry) =>
  b.date.localeCompare(a.date);

export function SleepLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SleepEntry[]>([]);

  const addEntry = (input: SleepEntryInput) =>
    setEntries((prev) =>
      [...prev, { ...input, id: String(Date.now()) }].sort(byDateDesc),
    );

  return (
    <SleepLogContext.Provider value={{ entries, addEntry }}>
      {children}
    </SleepLogContext.Provider>
  );
}

export function useSleepLog() {
  const ctx = useContext(SleepLogContext);
  if (!ctx) throw new Error("useSleepLog must be used inside SleepLogProvider");
  return ctx;
}
