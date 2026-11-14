import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { celebrate } from '../haptics';
import { images } from '../images';
import { useStore } from '../store';
import { colors, font, space } from '../theme';

export default function LessonScreen() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(store.lesson.completed);
  const steps = [
    `Ask ${store.dog.name} to sit, and wait until his bottom is on the floor.`,
    'Say "stay" once, then take one step back.',
    'Count to three. If he holds the stay, walk back to him.',
    'Reward him and end the lesson. Keep the party short.',
  ];

  async function advance() {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    if (!store.lesson.completed) {
      store.finishLesson();
      await celebrate();
    }
    setFinished(true);
  }

  if (finished) {
    return (
      <View style={[styles.screen, { paddingBottom: insets.bottom + 16 }]}>
        <ScrollView contentContainerStyle={styles.done}>
          <Image source={images.lesson} style={styles.dog} contentFit="contain" accessibilityLabel="Biscuit after the lesson" />
          <Text accessibilityRole="header" style={styles.doneTitle}>
            Day {store.lesson.day} complete
          </Text>
          <Text style={styles.body}>{store.dog.name} held the stay. The next lesson opens after the countdown on Training.</Text>
        </ScrollView>
        <View style={styles.footer}>
          <Button label="Back to training" tone="orange" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom + 16 }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>
          {store.lesson.title} · Day {store.lesson.day}
        </Text>
        {steps.map((text, index) => {
          const state = index < step ? 'done' : index === step ? 'now' : 'later';
          return (
            <View key={text} style={[styles.step, state === 'now' && styles.stepNow]}>
              <View style={[styles.badge, state === 'done' && styles.badgeDone, state === 'now' && styles.badgeNow]}>
                {state === 'done' ? (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                ) : (
                  <Text style={[styles.badgeText, state === 'now' && styles.badgeTextNow]}>{index + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepText, state === 'later' && styles.later]}>{text}</Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label={step === steps.length - 1 ? 'Finish lesson' : 'We did this'}
          tone="orange"
          onPress={advance}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: space.screen, paddingBottom: 24 },
  kicker: { fontFamily: font.extra, fontSize: 22, color: colors.teal, marginBottom: 16 },
  step: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  stepNow: { backgroundColor: colors.creamCard },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNow: { backgroundColor: colors.orange },
  badgeDone: { backgroundColor: colors.teal },
  badgeText: { fontFamily: font.extra, color: colors.teal },
  badgeTextNow: { color: colors.white },
  stepText: { flex: 1, fontFamily: font.semibold, fontSize: 17, lineHeight: 23, color: colors.ink },
  later: { color: colors.muted },
  footer: { paddingHorizontal: space.screen },
  done: { padding: space.screen, alignItems: 'center' },
  dog: { width: 200, height: 200 },
  doneTitle: { fontFamily: font.extra, fontSize: 30, color: colors.teal, textAlign: 'center', marginTop: 8 },
  body: { fontFamily: font.semibold, fontSize: 17, lineHeight: 24, color: colors.ink, textAlign: 'center', marginTop: 10 },
});
