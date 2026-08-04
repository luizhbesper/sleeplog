import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BABY } from "@/application/sleepAnalysisPrompt";
import { useAnalysis } from "@/application/useAnalysis";
import { formatDate, formatDuration, formatTime } from "@/domain/sleepEntry";
import type { SleepStats } from "@/domain/stats";
import { Skeleton } from "@/presentation/components/Skeleton";
import { colors, font, radius, spacing } from "@/presentation/theme";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

function Stats({ stats }: { stats: SleepStats }) {
  return (
    <>
      <Text style={styles.section}>KEY STATS</Text>
      <Stat
        label="LONGEST SLEEP"
        value={formatDuration(stats.longest.minutes)}
        hint={formatDate(stats.longest.date)}
      />
      <Stat
        label="SHORTEST SLEEP"
        value={formatDuration(stats.shortest.minutes)}
        hint={formatDate(stats.shortest.date)}
      />
      <Stat
        label="AVG DURATION"
        value={formatDuration(stats.avgDuration)}
        hint={`across ${stats.count} night${stats.count > 1 ? "s" : ""}`}
      />
      <Stat
        label="AVG BEDTIME"
        value={formatTime(stats.avgBedtime)}
        hint={stats.rangeLabel}
      />
    </>
  );
}

function Loading({ count }: { count: number }) {
  return (
    <View testID="analysis-skeleton">
      <Text style={styles.section}>ANALYZING {count} ENTRIES…</Text>
      <Skeleton height={3} style={styles.progress} />
      <Skeleton height={120} color={colors.border} style={styles.block} />
      <Skeleton height={70} style={styles.block} />
      <Skeleton height={70} style={styles.block} />
      <Skeleton height={90} color={colors.warm} style={styles.block} />
    </View>
  );
}

export function AnalysisScreen() {
  const { state, stats, entryCount, retry } = useAnalysis();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis</Text>
        {entryCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{entryCount} entries</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {state.status === "empty" && (
          <Text style={styles.muted}>
            Log a night or two first — there's nothing to analyze yet.
          </Text>
        )}

        {state.status === "loading" && <Loading count={entryCount} />}

        {state.status === "error" && (
          <View>
            <Text style={styles.error}>Couldn't get an analysis.</Text>
            <Text style={styles.muted}>{state.message}</Text>
            <Pressable
              testID="retry"
              style={styles.retry}
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel="Try the analysis again"
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {state.status === "success" && stats && (
          <>
            <Text style={styles.section}>SUMMARY</Text>
            <View style={styles.aiCard}>
              <Text style={styles.aiLabel}>AI · {stats.rangeLabel}</Text>
              <Text style={styles.aiText}>{state.analysis.summary}</Text>
            </View>

            <Stats stats={stats} />

            <View style={styles.tip}>
              <Text style={styles.tipTitle}>{state.analysis.tip.title}</Text>
              <Text style={styles.tipBody}>{state.analysis.tip.body}</Text>
            </View>

            <Text style={styles.footnote}>
              Based on {BABY.name}'s last {stats.count} logged night
              {stats.count > 1 ? "s" : ""}.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: font.title, color: colors.ink, fontWeight: "500" },
  badge: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: { color: colors.mintInk, fontSize: font.label },
  body: { padding: spacing.lg },
  section: {
    fontSize: font.label,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  progress: { marginBottom: spacing.lg },
  block: { marginBottom: spacing.md },
  aiCard: {
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  aiLabel: {
    color: colors.muted,
    fontSize: font.label,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  aiText: { color: colors.bg, fontSize: font.body, lineHeight: 24 },
  stat: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statLabel: { fontSize: font.label, color: colors.muted, letterSpacing: 1 },
  statValue: { fontSize: font.heading, color: colors.ink, marginVertical: 2 },
  statHint: { fontSize: font.label, color: colors.muted },
  tip: {
    backgroundColor: colors.warm,
    borderWidth: 1,
    borderColor: colors.warmBorder,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  tipTitle: {
    fontSize: font.body,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  tipBody: { fontSize: font.body, color: colors.ink, lineHeight: 22 },
  muted: { color: colors.muted, fontSize: font.body, lineHeight: 22 },
  error: {
    color: colors.danger,
    fontSize: font.body,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  retry: {
    backgroundColor: colors.indigo,
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  retryText: { color: colors.bg, fontWeight: "600" },
  footnote: {
    color: colors.muted,
    fontSize: font.label,
    marginTop: spacing.lg,
    textAlign: "center",
  },
});
