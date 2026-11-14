import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useChrome } from '../../chrome';
import { WeightChart } from '../../components/charts';
import { Press } from '../../components/ui';
import { formatWeight } from '../../format';
import { images } from '../../images';
import { registerScroll } from '../../scroll';
import { useStore } from '../../store';
import { colors, font, space } from '../../theme';

export default function HealthScreen() {
  const chrome = useChrome();
  const store = useStore();
  const scroll = useRef<ScrollViewInstance>(null);
  const unitLabel = store.weightUnit;

  useEffect(() => {
    registerScroll('health', {
      scrollToOffset: ({ offset, animated }) => scroll.current?.scrollTo({ y: offset, animated }),
    });
    return () => registerScroll('health', null);
  }, []);

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
      <Text accessibilityRole="header" style={styles.brand}>
        PawPal
      </Text>
      <Text style={styles.sub}>Health</Text>
      <Image
        source={images.nurse}
        style={styles.nurse}
        contentFit="contain"
        accessibilityLabel="Biscuit wearing a nurse hat"
      />

      <RecordCard
        title="Vet Visits"
        empty={`No visits yet. Add ${store.dog.name}'s next checkup.`}
        onAdd={() => router.push('/vet-visit')}
        addLabel="Add vet visit"
        rows={store.visits.map((visit) => ({
          id: visit.id,
          label: `${visit.title}: ${visit.date}`,
          onPress: () => router.push({ pathname: '/record', params: { kind: 'visit', id: visit.id } }),
        }))}
      />
      <RecordCard
        title="Vaccines"
        empty="No vaccines yet. Add one when the clinic sends the record."
        onAdd={() => router.push('/vaccine')}
        addLabel="Add vaccine"
        rows={store.vaccines.map((item) => ({
          id: item.id,
          label: `${item.title}: ${item.date}`,
          onPress: () => router.push({ pathname: '/record', params: { kind: 'vaccine', id: item.id } }),
        }))}
      />

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>Weight Chart ({unitLabel})</Text>
          <Press
            accessibilityLabel="Log weight"
            onPress={() => router.push('/weight')}
            style={styles.plus}
            pressedStyle={{ backgroundColor: colors.tealDark }}
          >
            <Ionicons name="add" size={26} color={colors.white} />
          </Press>
        </View>
        <WeightChart points={store.weights} unit={store.weightUnit} />
        {store.weights.length > 0 ? (
          <Text style={styles.latest}>
            Latest {formatWeight(store.weights[store.weights.length - 1].lbs, store.weightUnit).text}{' '}
            {unitLabel}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

function RecordCard({
  title,
  rows,
  empty,
  onAdd,
  addLabel,
}: {
  title: string;
  rows: Array<{ id: string; label: string; onPress: () => void }>;
  empty: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.cardMain}>
          <Text style={styles.cardTitle}>{title}</Text>
          {rows.length === 0 ? <Text style={styles.empty}>{empty}</Text> : null}
          {rows.map((row) => (
            <Press key={row.id} accessibilityLabel={row.label} onPress={row.onPress} style={styles.line}>
              <Text style={styles.lineText}>{row.label}</Text>
            </Press>
          ))}
        </View>
        <Press
          accessibilityLabel={addLabel}
          onPress={onAdd}
          style={styles.plus}
          pressedStyle={{ backgroundColor: colors.tealDark }}
        >
          <Ionicons name="add" size={26} color={colors.white} />
        </Press>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  brand: { fontFamily: font.extra, fontSize: 42, color: colors.teal, textAlign: 'center' },
  sub: { fontFamily: font.extra, fontSize: 28, color: colors.teal, textAlign: 'center', marginTop: 4 },
  nurse: { width: 220, height: 210, alignSelf: 'center', marginVertical: 8 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: 16,
    marginBottom: 14,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardMain: { flex: 1 },
  cardTitle: { fontFamily: font.extra, fontSize: 22, color: colors.teal, marginBottom: 6 },
  line: { minHeight: 44, justifyContent: 'center' },
  lineText: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  empty: { fontFamily: font.semibold, fontSize: 15, color: colors.muted, lineHeight: 21 },
  plus: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  latest: { fontFamily: font.bold, color: colors.muted, marginTop: 8, fontSize: 13 },
});
