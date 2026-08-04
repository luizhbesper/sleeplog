import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  formatDate,
  formatTime,
  type SleepEntryInput,
  sleepEntrySchema,
  toDateString,
  toTimeString,
} from "@/domain/sleepEntry";
import { colors, font, radius, spacing } from "@/presentation/theme";

type Field = "date" | "sleepStart" | "wakeTime";

const defaults = (): SleepEntryInput => ({
  date: toDateString(new Date()),
  sleepStart: "20:00",
  wakeTime: "06:00",
  notes: "",
});

const toDate = (value: string, field: Field) => {
  if (field === "date") {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const [h, min] = value.split(":").map(Number);
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d;
};

export function AddEntrySheet({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (entry: SleepEntryInput) => void;
}) {
  const [picking, setPicking] = useState<Field | null>(null);
  const { control, handleSubmit, reset } = useForm<SleepEntryInput>({
    resolver: zodResolver(sleepEntrySchema),
    defaultValues: defaults(),
  });

  const close = () => {
    setPicking(null);
    reset(defaults());
    onClose();
  };

  const save = handleSubmit((values) => {
    onSubmit({ ...values, notes: values.notes?.trim() || undefined });
    close();
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={styles.backdrop}
          onPress={close}
          accessibilityLabel="Close"
          accessibilityRole="button"
        />
        <ScrollView style={styles.sheet} keyboardShouldPersistTaps="handled">
          <View style={styles.grabber} />
          <Text style={styles.title}>Add Sleep Entry</Text>

          {(
            [
              ["DATE", "date"],
              ["SLEEP TIME", "sleepStart"],
              ["WAKE TIME", "wakeTime"],
            ] as const
          ).map(([label, field]) => (
            <Controller
              key={field}
              control={control}
              name={field}
              render={({ field: { value, onChange }, fieldState }) => (
                <View>
                  <Text style={styles.label}>{label}</Text>
                  <Pressable
                    testID={`picker-${field}`}
                    style={[styles.input, picking === field && styles.active]}
                    onPress={() => setPicking(picking === field ? null : field)}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}: ${
                      field === "date" ? formatDate(value) : formatTime(value)
                    }`}
                  >
                    <Text style={styles.inputText}>
                      {field === "date" ? formatDate(value) : formatTime(value)}
                    </Text>
                  </Pressable>
                  {!!fieldState.error && (
                    <Text style={styles.error}>{fieldState.error.message}</Text>
                  )}
                  {picking === field && (
                    <DateTimePicker
                      value={toDate(value, field)}
                      mode={field === "date" ? "date" : "time"}
                      maximumDate={field === "date" ? new Date() : undefined}
                      display="spinner"
                      themeVariant="light"
                      textColor={colors.ink}
                      style={styles.picker}
                      onChange={(_, selected) => {
                        if (!selected) return;
                        onChange(
                          field === "date"
                            ? toDateString(selected)
                            : toTimeString(selected),
                        );
                      }}
                    />
                  )}
                </View>
              )}
            />
          ))}

          <Text style={styles.label}>NOTES (OPTIONAL)</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { value, onChange } }) => (
              <TextInput
                testID="notes-input"
                style={styles.input}
                placeholder="e.g. woke once at 3am…"
                placeholderTextColor={colors.muted}
                value={value}
                onChangeText={onChange}
                accessibilityLabel="Notes, optional"
              />
            )}
          />

          <Pressable
            testID="save-entry"
            style={styles.save}
            onPress={save}
            accessibilityRole="button"
            accessibilityLabel="Save entry"
          >
            <Text style={styles.saveText}>Save Entry</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    maxHeight: "85%",
    flexGrow: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: font.heading,
    color: colors.ink,
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: font.label,
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: font.body,
    color: colors.ink,
  },
  active: { borderColor: colors.indigo, backgroundColor: colors.lavender },
  picker: { height: 140 },
  inputText: { fontSize: font.body, color: colors.ink },
  error: { color: colors.danger, fontSize: font.label, marginTop: spacing.xs },
  save: {
    backgroundColor: colors.indigo,
    borderRadius: radius.sm,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  saveText: { color: colors.bg, fontSize: font.body, fontWeight: "600" },
});
