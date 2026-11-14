import { Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Sheet } from '../components/ui';
import { clock, formatDistance } from '../format';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function WalkDoneScreen() {
  const store = useStore();
  const params = useLocalSearchParams<{ seconds?: string; km?: string }>();
  const seconds = Number(params.seconds ?? 0);
  const km = Number(params.km ?? 0);
  const distance = formatDistance(Number.isFinite(km) ? km : 0, store.units);

  return (
    <Sheet title="Walk saved">
      <Text style={styles.time}>{clock(Number.isFinite(seconds) ? seconds : 0)}</Text>
      <Text style={styles.distance}>
        {distance.text} {distance.unit}
      </Text>
      <Text style={styles.body}>The timer is cleared. Today's goal on Home still counts this distance.</Text>
      <Button label="Done" onPress={() => router.back()} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  time: { fontFamily: font.extra, fontSize: 36, color: colors.teal },
  distance: { fontFamily: font.extra, fontSize: 28, color: colors.orange, marginTop: 4, marginBottom: 10 },
  body: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22, color: colors.ink, marginBottom: 18 },
});
