import { ReactNode } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, space } from '../theme';

type PressProps = {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function Press({
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  style,
  pressedStyle,
  children,
}: PressProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        style,
        pressed && !disabled ? { opacity: 0.86, transform: [{ scale: 0.985 }] } : null,
        pressed && !disabled ? pressedStyle : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'teal' | 'orange' | 'outline';
  disabled?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
};

export function Button({ label, onPress, tone = 'teal', disabled, icon, trailing }: ButtonProps) {
  const filled = tone !== 'outline';
  const backgroundColor = tone === 'orange' ? colors.orange : tone === 'teal' ? colors.teal : colors.white;
  const pressedBackground = tone === 'orange' ? colors.orangeDark : tone === 'teal' ? colors.tealDark : colors.creamCard;
  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[
        styles.button,
        {
          backgroundColor,
          borderWidth: filled ? 0 : 2,
          borderColor: colors.teal,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
      pressedStyle={{ backgroundColor: pressedBackground }}
    >
      <View style={styles.buttonInner}>
        {icon}
        <Text style={[styles.buttonLabel, { color: filled ? colors.white : colors.teal }]}>{label}</Text>
        {trailing}
      </View>
    </Press>
  );
}

export function Field({
  label,
  error,
  ...input
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        {...input}
        style={[styles.input, input.multiline ? styles.inputMulti : null, input.style]}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function Sheet({ title, children }: { title: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.sheet}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.sheetBody,
          { paddingBottom: Math.max(insets.bottom, 16) + 28, minHeight: 520 },
        ]}
      >
        <View style={styles.sheetHead}>
          <Text accessibilityRole="header" style={styles.sheetTitle}>
            {title}
          </Text>
          <Press accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Text style={styles.closeLabel}>Close</Text>
          </Press>
        </View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function ScreenTitle({ children }: { children: string }) {
  return (
    <Text accessibilityRole="header" style={styles.screenTitle}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonLabel: {
    fontFamily: font.extra,
    fontSize: 18,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: font.bold,
    color: colors.teal,
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontFamily: font.semibold,
    fontSize: 17,
    color: colors.ink,
  },
  inputMulti: {
    minHeight: 96,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: 6,
    color: colors.orangeDark,
    fontFamily: font.bold,
    fontSize: 14,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  sheetBody: {
    paddingHorizontal: space.screen,
    paddingTop: 18,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  sheetTitle: {
    flex: 1,
    fontFamily: font.extra,
    fontSize: 28,
    color: colors.teal,
  },
  close: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  closeLabel: {
    fontFamily: font.bold,
    color: colors.orange,
    fontSize: 16,
  },
  screenTitle: {
    fontFamily: font.extra,
    fontSize: 36,
    color: colors.teal,
    textAlign: 'center',
    marginBottom: 16,
  },
});
