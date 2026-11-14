import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { useChrome } from '../../chrome';
import { Press, ScreenTitle } from '../../components/ui';
import { clock, formatDistance } from '../../format';
import { celebrate } from '../../haptics';
import { images } from '../../images';
import { registerScroll } from '../../scroll';
import { useStore } from '../../store';
import { colors, font, space } from '../../theme';

export default function WalkScreen() {
  const chrome = useChrome();
  const store = useStore();
  const scroll = useRef<ScrollViewInstance>(null);
  const distance = formatDistance(store.walk.distanceKm, store.units);
  const running = store.walk.status === 'active';
  const paused = store.walk.status === 'paused';
  const idle = store.walk.status === 'idle';

  useEffect(() => {
    registerScroll('walk', {
      scrollToOffset: ({ offset, animated }) => scroll.current?.scrollTo({ y: offset, animated }),
    });
    return () => registerScroll('walk', null);
  }, []);

  function onStop() {
    const summary = store.stopWalk();
    if (!summary) return;
    celebrate();
    router.push({
      pathname: '/walk-done',
      params: { seconds: String(summary.seconds), km: String(summary.km) },
    });
  }

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
      <ScreenTitle>Walk Tracker</ScreenTitle>
      <Image
        source={images.map}
        style={styles.map}
        contentFit="contain"
        accessibilityLabel="Live walk map with Biscuit on the path"
      />
      {idle ? (
        <Text style={styles.idle}>No walk in progress. Start one and the timer runs from here.</Text>
      ) : null}
      <View style={styles.stats}>
        <View style={[styles.stat, styles.timerCard]}>
          <Text style={styles.statLabel}>Timer</Text>
          <Text style={styles.timerValue} numberOfLines={1} adjustsFontSizeToFit>
            {clock(store.walk.elapsedSec)}
          </Text>
        </View>
        <View style={[styles.stat, styles.distanceCard]}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.distanceValue} numberOfLines={1} adjustsFontSizeToFit>
            {distance.text} <Text style={styles.unit}>{distance.unit}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.controls}>
        <Press
          accessibilityLabel="Save a moment"
          disabled={idle}
          onPress={() => router.push('/moment')}
          style={[styles.side, idle && styles.disabled]}
          pressedStyle={styles.sidePressed}
        >
          <Ionicons name="camera" size={28} color={colors.orange} />
        </Press>
        <Press
          accessibilityLabel={idle ? 'Start walk' : paused ? 'Resume walk' : 'Pause walk'}
          onPress={() => {
            if (idle) store.startWalk();
            else if (paused) store.resumeWalk();
            else store.pauseWalk();
          }}
          style={styles.pause}
          pressedStyle={{ backgroundColor: colors.tealDark }}
        >
          {paused || idle ? (
            <Ionicons name="play" size={34} color={colors.white} />
          ) : (
            <View style={styles.bars}>
              <View style={styles.bar} />
              <View style={styles.bar} />
            </View>
          )}
          <Text style={styles.pauseLabel}>{idle ? 'START' : paused ? 'RESUME' : 'PAUSE'}</Text>
        </Press>
        <Press
          accessibilityLabel="Stop walk"
          disabled={idle}
          onPress={onStop}
          style={[styles.side, styles.stop, idle && styles.disabled]}
          pressedStyle={styles.sidePressed}
        >
          <Svg width={28} height={22} viewBox="0 0 28 22">
            <Path
              d="M2 5h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm20 0h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM7 9.5h14v3H7v-3z"
              fill={colors.orange}
            />
          </Svg>
          <Text style={styles.stopLabel}>STOP</Text>
        </Press>
      </View>
      {store.walk.moments.length > 0 ? (
        <View style={styles.moments}>
          <Text style={styles.momentsTitle}>Moments</Text>
          {store.walk.moments.map((moment) => (
            <View key={moment.id} style={styles.moment}>
              {moment.uri ? (
                <Image source={{ uri: moment.uri }} style={styles.momentPhoto} contentFit="cover" accessibilityLabel="Walk photo" />
              ) : null}
              <Text style={styles.momentNote}>{moment.note || 'Photo from the walk'}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  map: { width: '100%', aspectRatio: 696 / 530 },
  idle: {
    fontFamily: font.semibold,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 12,
  },
  stats: { flexDirection: 'row', gap: 12, marginTop: 16 },
  stat: {
    flex: 1,
    minHeight: 108,
    borderRadius: 22,
    borderWidth: 3,
    backgroundColor: colors.creamCard,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  timerCard: { borderColor: colors.teal },
  distanceCard: { borderColor: colors.orange },
  statLabel: { fontFamily: font.extra, fontSize: 18, color: colors.teal },
  timerValue: { fontFamily: font.extra, fontSize: 28, color: colors.teal, marginTop: 4 },
  distanceValue: { fontFamily: font.extra, fontSize: 32, color: colors.orange, marginTop: 4 },
  unit: { fontSize: 18 },
  controls: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  side: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidePressed: { backgroundColor: colors.tealDark },
  stop: { borderWidth: 4, borderColor: colors.orange },
  stopLabel: { fontFamily: font.extra, color: colors.orange, fontSize: 12, marginTop: 2 },
  pause: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: colors.teal,
    borderWidth: 5,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: { flexDirection: 'row', gap: 8 },
  bar: { width: 8, height: 28, borderRadius: 3, backgroundColor: colors.white },
  pauseLabel: { fontFamily: font.extra, color: colors.white, fontSize: 16, marginTop: 6, letterSpacing: 0.5 },
  disabled: { opacity: 0.4 },
  moments: { marginTop: 28, gap: 10 },
  momentsTitle: { fontFamily: font.extra, fontSize: 20, color: colors.teal },
  moment: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  momentPhoto: { width: '100%', height: 160, borderRadius: 12 },
  momentNote: { fontFamily: font.semibold, color: colors.ink, fontSize: 16 },
});
