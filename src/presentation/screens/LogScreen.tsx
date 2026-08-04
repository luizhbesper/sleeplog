import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSleepLog } from "@/application/useSleepLog";
import { AddEntrySheet } from "@/presentation/components/AddEntrySheet";
import { SleepCard } from "@/presentation/components/SleepCard";
import { colors, font, radius, spacing } from "@/presentation/theme";

function Empty() {
  return (
    <View style={styles.empty} testID="empty-state">
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyMoon}>🌙</Text>
      </View>
      <Text style={styles.emptyTitle}>No entries yet</Text>
      <Text style={styles.emptyHint}>Tap + to log your first sleep</Text>
    </View>
  );
}

export function LogScreen() {
  const { entries, addEntry } = useSleepLog();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Sleep<Text style={styles.titleAccent}>log</Text>
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Mia · 4mo</Text>
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          entries.length ? <Text style={styles.section}>THIS WEEK</Text> : null
        }
        ListEmptyComponent={Empty}
        renderItem={({ item, index }) => (
          <SleepCard entry={item} highlighted={index === 0} />
        )}
      />

      <Pressable
        testID="add-entry-fab"
        style={styles.fab}
        onPress={() => setSheetOpen(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddEntrySheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={addEntry}
      />
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
  titleAccent: { color: colors.indigo },
  badge: {
    backgroundColor: colors.lavender,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: { color: colors.indigo, fontSize: font.label },
  list: { padding: spacing.lg, flexGrow: 1 },
  section: {
    fontSize: font.label,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyMoon: { fontSize: 24 },
  emptyTitle: { fontSize: font.heading, color: colors.ink },
  emptyHint: { fontSize: 13, color: colors.muted, marginTop: spacing.xs },
  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.indigo,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: { color: colors.bg, fontSize: 28, lineHeight: 32 },
});
