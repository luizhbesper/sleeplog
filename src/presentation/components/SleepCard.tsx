import { StyleSheet, Text, View } from "react-native";
import {
  durationMinutes,
  formatDate,
  formatDuration,
  formatTime,
  type SleepEntry,
} from "@/domain/sleepEntry";
import { colors, font, radius, spacing } from "@/presentation/theme";

const MAX_MINUTES = 12 * 60;

export function SleepCard({
  entry,
  highlighted,
}: {
  entry: SleepEntry;
  highlighted?: boolean;
}) {
  const minutes = durationMinutes(entry.sleepStart, entry.wakeTime);
  const fill = Math.min(minutes / MAX_MINUTES, 1);

  return (
    <View
      style={[styles.card, highlighted && styles.highlighted]}
      testID="sleep-card"
    >
      <Text style={styles.date}>{formatDate(entry.date)}</Text>
      <View style={styles.row}>
        <Text style={styles.time}>
          {formatTime(entry.sleepStart)}
          <Text style={styles.arrow}> → </Text>
          {formatTime(entry.wakeTime)}
        </Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{formatDuration(minutes)}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { flex: fill }]} />
        <View style={{ flex: 1 - fill }} />
      </View>
      {!!entry.notes && <Text style={styles.notes}>{entry.notes}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  highlighted: {
    backgroundColor: colors.lavender,
    borderColor: colors.indigo,
    borderWidth: 2,
  },
  date: {
    color: colors.muted,
    fontSize: font.label,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: { fontSize: font.time, color: colors.ink, fontWeight: "500" },
  arrow: { color: colors.muted },
  pill: {
    backgroundColor: colors.lavender,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pillText: { color: colors.indigo, fontSize: font.label, fontWeight: "600" },
  track: {
    flexDirection: "row",
    height: 3,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    overflow: "hidden",
  },
  fill: { backgroundColor: colors.indigo },
  notes: { color: colors.muted, fontSize: 13, marginTop: spacing.md },
});
