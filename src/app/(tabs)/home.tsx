import { useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, type FlatListInstance } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Flame } from '../../components/flame';
import { useChrome } from '../../chrome';
import { router } from 'expo-router';
import { WalkRing } from '../../components/charts';
import { Press, ScreenTitle } from '../../components/ui';
import { formatDistance } from '../../format';
import { images } from '../../images';
import { registerScroll } from '../../scroll';
import { useStore } from '../../store';
import { colors, font, space } from '../../theme';

type Row = { id: string; title: string; detail: string; href: '/walk' | '/health' | '/training' | '/meal' | '/reminder' };

export default function HomeScreen() {
  const chrome = useChrome();
  const store = useStore();
  const list = useRef<FlatListInstance>(null);

  useEffect(() => {
    registerScroll('home', {
      scrollToOffset: ({ offset, animated }) => list.current?.scrollToOffset({ offset, animated }),
    });
    return () => registerScroll('home', null);
  }, []);

  const rows = useMemo(() => buildLog(store), [store]);
  const walked = formatDistance(store.dailyKm, store.units);
  const meal = store.nextMeal;

  return (
    <FlatList
      ref={list}
      style={styles.screen}
      data={rows}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingTop: chrome.top,
        paddingBottom: chrome.bottom,
        paddingHorizontal: space.screen,
        width: '100%',
        maxWidth: chrome.maxWidth,
        alignSelf: 'center',
      }}
      ListHeaderComponent={
        <View>
          <ScreenTitle>Home</ScreenTitle>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <WalkRing walkedKm={store.dailyKm} goalKm={store.goalKm} unit={store.units} />
              <Press
                accessibilityLabel={meal ? `Next meal ${meal.time}` : 'Add a meal'}
                onPress={() => router.push(meal ? '/meal' : { pathname: '/meal', params: { mode: 'add' } })}
                style={styles.meal}
              >
                <Text style={styles.mealLabel}>Next Meal</Text>
                <Text style={styles.mealTime}>{meal ? meal.time : 'None yet'}</Text>
                <Text style={styles.mealFood} numberOfLines={2}>
                  {meal ? meal.food : 'Add the next bowl'}
                </Text>
              </Press>
            </View>
            {store.streakDays > 0 ? (
              <View style={styles.streakRow}>
                <View style={styles.streakBanner}>
                  <Flame />
                  <View style={styles.streakCopy}>
                    <Text style={styles.streakTitle}>{store.streakDays}-Day Streak!</Text>
                    <Text style={styles.streakBody}>Keep it up!</Text>
                  </View>
                </View>
                <Image
                  source={images.streak}
                  style={styles.streakDog}
                  contentFit="contain"
                  accessibilityLabel="Biscuit giving a thumbs up"
                />
              </View>
            ) : (
              <View style={styles.quiet}>
                <Text style={styles.quietTitle}>No streak yet</Text>
                <Text style={styles.quietBody}>Finish today's lesson and the flame shows up here.</Text>
              </View>
            )}
          </View>

          <Press
            accessibilityLabel="Start walk"
            onPress={() => {
              if (store.walk.status === 'idle') store.startWalk();
              router.navigate('/walk');
            }}
            style={styles.start}
            pressedStyle={{ backgroundColor: colors.orangeDark }}
          >
            <View style={styles.pawBadge}>
              <MaterialCommunityIcons name="paw" size={22} color={colors.orange} />
            </View>
            <Text style={styles.startLabel}>Start walk</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.white} />
          </Press>

          {store.reminder ? (
            <View style={styles.reminder}>
              <View style={styles.calendarIcon}>
                <MaterialCommunityIcons name="paw" size={22} color={colors.teal} />
                <View style={styles.checkDot}>
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
              </View>
              <View style={styles.reminderCopy}>
                <Text style={styles.reminderTitle}>Vet reminder</Text>
                <Text style={styles.reminderBody}>
                  {store.reminder.title} {store.reminder.body}
                </Text>
              </View>
              <Press
                accessibilityLabel="View details"
                onPress={() => router.push('/reminder')}
                style={styles.details}
                pressedStyle={{ backgroundColor: '#C5DCCB' }}
              >
                <Text style={styles.detailsLabel}>View details ›</Text>
              </Press>
            </View>
          ) : (
            <View style={styles.reminder}>
              <View style={styles.reminderCopy}>
                <Text style={styles.reminderTitle}>No vet reminder</Text>
                <Text style={styles.reminderBody}>Add a visit when the next checkup is booked.</Text>
              </View>
            </View>
          )}

          <Text style={styles.logTitle}>{store.dog.name}'s log</Text>
          <Text style={styles.logHint}>
            {walked.text} {walked.unit} toward today's goal. Meals, the walk, and training sit below.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Press
          accessibilityLabel={item.title}
          onPress={() => router.push(item.href)}
          style={styles.row}
        >
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowDetail}>{item.detail}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.teal} />
        </Press>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Walks, meals, and lessons will collect here.</Text>
      }
    />
  );
}

function buildLog(store: ReturnType<typeof useStore>): Row[] {
  const rows: Row[] = [];
  if (store.walk.status === 'idle') {
    rows.push({
      id: 'walk',
      title: store.lastWalk ? 'Last walk saved' : 'No walk yet today',
      detail: store.lastWalk ? 'Open the tracker to start another.' : 'Start one when you head out.',
      href: '/walk',
    });
  } else {
    const dist = formatDistance(store.walk.distanceKm, store.units);
    rows.push({
      id: 'walk',
      title: store.walk.status === 'paused' ? 'Walk paused' : 'Walk in progress',
      detail: `${dist.text} ${dist.unit} on this outing`,
      href: '/walk',
    });
  }
  store.meals.forEach((meal) => {
    rows.push({
      id: meal.id,
      title: meal.fed ? `${meal.time} meal logged` : `${meal.time} meal`,
      detail: meal.food,
      href: '/meal',
    });
  });
  rows.push({
    id: 'lesson',
    title: `${store.lesson.title} · Day ${store.lesson.day}`,
    detail: store.lesson.completed ? 'Done for today' : 'Daily trick lesson',
    href: '/training',
  });
  store.tricks.forEach((trick) => {
    rows.push({
      id: trick.id,
      title: trick.name,
      detail: trick.done ? 'Mastered' : 'In progress',
      href: '/training',
    });
  });
  store.visits.forEach((visit) => {
    rows.push({
      id: visit.id,
      title: visit.title,
      detail: visit.date,
      href: '/health',
    });
  });
  store.vaccines.forEach((vaccine) => {
    rows.push({
      id: vaccine.id,
      title: vaccine.title,
      detail: vaccine.date,
      href: '/health',
    });
  });
  if (store.reminder) {
    rows.push({
      id: 'reminder',
      title: 'Vet reminder',
      detail: `${store.reminder.title} ${store.reminder.body}`,
      href: '/reminder',
    });
  }
  return rows;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  hero: {
    backgroundColor: colors.creamCard,
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meal: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'center',
    paddingLeft: 6,
  },
  mealLabel: { fontFamily: font.extra, fontSize: 20, color: colors.teal },
  mealTime: { fontFamily: font.extra, fontSize: 26, color: colors.orange, marginTop: 6 },
  mealFood: { fontFamily: font.bold, fontSize: 16, color: colors.teal, marginTop: 4 },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  streakBanner: {
    flex: 1,
    minHeight: 92,
    backgroundColor: colors.orange,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  streakCopy: { flex: 1, paddingRight: 36 },
  streakTitle: { fontFamily: font.extra, fontSize: 18, color: colors.white },
  streakBody: { fontFamily: font.bold, fontSize: 16, color: colors.white, marginTop: 2 },
  streakDog: { width: 118, height: 150, marginLeft: -48, marginBottom: -6 },
  quiet: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
  },
  quietTitle: { fontFamily: font.extra, color: colors.teal, fontSize: 16 },
  quietBody: { fontFamily: font.semibold, color: colors.muted, fontSize: 15, marginTop: 4 },
  start: {
    minHeight: 64,
    borderRadius: 32,
    backgroundColor: colors.orange,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 14,
  },
  pawBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startLabel: { flex: 1, fontFamily: font.extra, fontSize: 22, color: colors.white },
  reminder: {
    backgroundColor: colors.mint,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },
  calendarIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDot: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderCopy: { flex: 1 },
  reminderTitle: { fontFamily: font.extra, color: colors.teal, fontSize: 16 },
  reminderBody: { fontFamily: font.semibold, color: colors.ink, fontSize: 14, lineHeight: 19, marginTop: 2 },
  details: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.mintChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsLabel: { fontFamily: font.bold, color: colors.teal, fontSize: 13 },
  logTitle: { fontFamily: font.extra, fontSize: 22, color: colors.teal },
  logHint: { fontFamily: font.semibold, color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 8 },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: 12,
  },
  rowCopy: { flex: 1 },
  rowTitle: { fontFamily: font.extra, color: colors.teal, fontSize: 16 },
  rowDetail: { fontFamily: font.semibold, color: colors.muted, fontSize: 14, marginTop: 2 },
  empty: { fontFamily: font.semibold, color: colors.muted, fontSize: 16, marginTop: 8 },
});
