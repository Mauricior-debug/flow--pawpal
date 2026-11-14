import { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useChrome } from '../../chrome';
import { Press } from '../../components/ui';
import { monthGrid, remainLabel } from '../../format';
import { images } from '../../images';
import { registerScroll } from '../../scroll';
import { useStore } from '../../store';
import { colors, font, space } from '../../theme';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function TrainingScreen() {
  const chrome = useChrome();
  const store = useStore();
  const scroll = useRef<ScrollViewInstance>(null);
  const [now, setNow] = useState(Date.now());
  const grid = monthGrid();
  const remain = remainLabel(store.lesson.nextLessonAt, now);
  const paws = store.streakDays > 0 ? Math.min(5, store.streakDays) : 0;

  useEffect(() => {
    registerScroll('training', {
      scrollToOffset: ({ offset, animated }) => scroll.current?.scrollTo({ y: offset, animated }),
    });
    return () => registerScroll('training', null);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const selectedNote = store.practicedDays.includes(store.selectedDay)
    ? `${grid.label} ${store.selectedDay} · practice logged`
    : `${grid.label} ${store.selectedDay} · no practice logged`;

  return (
    <ScrollView
      ref={scroll}
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: chrome.top,
        paddingBottom: chrome.bottom,
        paddingHorizontal: space.screen,
        width: '100%',
        maxWidth: chrome.maxWidth,
        alignSelf: 'center',
      }}
    >
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Training
        </Text>
        <Image
          source={images.header}
          style={styles.headerDog}
          contentFit="contain"
          accessibilityLabel="Biscuit sitting"
        />
      </View>

      <View style={styles.lessonCard}>
        <View style={styles.lessonTop}>
          <View style={styles.lessonCopy}>
            <Text style={styles.lessonKicker}>Daily Trick Lesson</Text>
            <Text style={styles.lessonTitle}>
              {store.lesson.title} - Day {store.lesson.day}
            </Text>
          </View>
          <Image
            source={images.lesson}
            style={styles.lessonDog}
            contentFit="contain"
            accessibilityLabel="Biscuit with a dumbbell"
          />
        </View>
        <ProgressTrack progress={store.lesson.progress} />
        <Text style={styles.next}>
          {remain ? `Next lesson in ${remain}` : 'Ready when you are'}
        </Text>
        <Press
          accessibilityLabel={store.lesson.completed ? "Review today's lesson" : "Start today's lesson"}
          onPress={() => router.push('/lesson')}
          style={styles.start}
          pressedStyle={{ backgroundColor: colors.orangeDark }}
        >
          <Text style={styles.startLabel}>
            {store.lesson.completed ? "Review today's lesson" : "Start Today's Lesson"}
          </Text>
        </Press>
      </View>

      <View style={styles.trickRow}>
        {store.tricks.map((trick) => (
          <Press
            key={trick.id}
            accessibilityLabel={trick.name}
            onPress={() => router.push({ pathname: '/trick', params: { id: trick.id } })}
            style={styles.trick}
          >
            <Text style={styles.trickName}>{trick.name}</Text>
            <View style={styles.trickTrack}>
              <View style={[styles.trickFill, { width: `${Math.round(trick.progress * 100)}%` }]} />
              <View style={[styles.trickEnd, trick.done && styles.trickDone]}>
                {trick.done ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
              </View>
            </View>
          </Press>
        ))}
      </View>

      <Text style={styles.section}>Progress & Streaks</Text>
      <View style={styles.streakCard}>
        <View style={styles.streakTop}>
          <View style={styles.paws}>
            {Array.from({ length: 5 }, (_, index) => (
              <MaterialCommunityIcons
                key={index}
                name="paw"
                size={18}
                color={colors.teal}
                style={{ opacity: index < paws ? 1 : 0.25 }}
              />
            ))}
            <Text style={styles.streakLabel}>{store.streakDays}-Day Streak</Text>
          </View>
          <View style={styles.calendar}>
            <View style={styles.weekBar}>
              {WEEKDAYS.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekLetter}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.days}>
              {grid.cells.map((day, index) => {
                if (!day) return <View key={`e-${index}`} style={styles.day} />;
                const selected = day === store.selectedDay;
                const practiced = store.practicedDays.includes(day);
                return (
                  <Press
                    key={day}
                    accessibilityLabel={`${grid.label} ${day}`}
                    onPress={() => store.selectDay(day)}
                    style={styles.day}
                  >
                    <View style={[styles.dayBubble, selected && styles.daySelected]}>
                      <Text style={[styles.dayText, practiced && styles.dayPracticed]}>{day}</Text>
                    </View>
                  </Press>
                );
              })}
            </View>
          </View>
        </View>
        <Text style={styles.note}>{selectedNote}</Text>
        <Text style={styles.overall}>Overall Progress: {store.tricksMastered} Tricks Mastered</Text>
      </View>

      <Text style={styles.section}>How Sit & Stay works</Text>
      <Text style={styles.help}>
        Ask {store.dog.name} to sit, take one step back, and wait. Reward the stay. Day {store.lesson.day} is the lesson on the card above.
      </Text>
    </ScrollView>
  );
}

function ProgressTrack({ progress }: { progress: number }) {
  const width = `${Math.round(Math.max(0.08, Math.min(1, progress)) * 100)}%`;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
      <View style={[styles.knob, { left: width }]} />
      <View style={styles.end} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontFamily: font.extra, fontSize: 40, color: colors.teal },
  headerDog: { width: 72, height: 72, position: 'absolute', right: 0 },
  lessonCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 28,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  lessonTop: { flexDirection: 'row', alignItems: 'flex-start' },
  lessonCopy: { flex: 1, paddingRight: 8 },
  lessonKicker: { fontFamily: font.extra, fontSize: 22, color: colors.teal },
  lessonTitle: { fontFamily: font.extra, fontSize: 20, color: colors.teal, marginTop: 4 },
  lessonDog: { width: 128, height: 148 },
  track: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F4E4C4',
    marginTop: 8,
    justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, top: 4, bottom: 4, backgroundColor: colors.orange, borderRadius: 6 },
  knob: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: -9,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.orange,
  },
  end: {
    position: 'absolute',
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.orange,
    backgroundColor: colors.creamCard,
  },
  next: { fontFamily: font.bold, color: colors.ink, fontSize: 16, marginTop: 14 },
  start: {
    marginTop: 16,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startLabel: { fontFamily: font.extra, color: colors.white, fontSize: 18 },
  trickRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  trick: {
    flex: 1,
    backgroundColor: colors.creamCard,
    borderRadius: 22,
    padding: 16,
    minHeight: 110,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  trickName: { fontFamily: font.extra, fontSize: 20, color: colors.teal, textAlign: 'center' },
  trickTrack: {
    marginTop: 18,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F4E4C4',
    justifyContent: 'center',
  },
  trickFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.orange, borderRadius: 5 },
  trickEnd: {
    position: 'absolute',
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.orange,
    backgroundColor: colors.creamCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trickDone: { backgroundColor: colors.orange },
  section: { fontFamily: font.extra, fontSize: 24, color: colors.teal, textAlign: 'center', marginTop: 26, marginBottom: 12 },
  streakCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 24,
    padding: 16,
  },
  streakTop: { flexDirection: 'row', gap: 8 },
  paws: { width: 118, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 2 },
  streakLabel: { fontFamily: font.extra, color: colors.teal, fontSize: 16, marginTop: 8, width: '100%' },
  calendar: { flex: 1 },
  weekBar: {
    flexDirection: 'row',
    backgroundColor: colors.orange,
    borderRadius: 10,
    paddingVertical: 4,
  },
  weekLetter: { flex: 1, textAlign: 'center', color: colors.white, fontFamily: font.extra, fontSize: 12 },
  days: { flexDirection: 'row', flexWrap: 'wrap' },
  day: { width: '14.28%', minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  dayBubble: { minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  daySelected: { borderWidth: 2, borderColor: colors.orange },
  dayText: { fontFamily: font.bold, color: colors.ink, fontSize: 12 },
  dayPracticed: { color: colors.orange },
  note: { fontFamily: font.semibold, color: colors.muted, marginTop: 8, fontSize: 14 },
  overall: { fontFamily: font.extra, color: colors.teal, fontSize: 16, marginTop: 8 },
  help: { fontFamily: font.semibold, color: colors.ink, fontSize: 16, lineHeight: 23 },
});
