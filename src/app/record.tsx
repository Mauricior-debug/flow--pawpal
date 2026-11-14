import { Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Sheet } from '../components/ui';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function RecordScreen() {
  const store = useStore();
  const params = useLocalSearchParams<{ kind?: string; id?: string }>();
  const kind = params.kind === 'vaccine' ? 'vaccine' : 'visit';
  const list = kind === 'vaccine' ? store.vaccines : store.visits;
  const record = list.find((item) => item.id === params.id);

  if (!record) {
    return (
      <Sheet title="Missing record">
        <Text style={styles.body}>That record is no longer on this phone.</Text>
        <Button label="Close" onPress={() => router.back()} />
      </Sheet>
    );
  }

  return (
    <Sheet title={record.title}>
      <Text style={styles.date}>{record.date}</Text>
      <Text style={styles.body}>
        {kind === 'vaccine' ? 'Vaccine on file for' : 'Visit on file for'} {store.dog.name}. Removing it only clears it from this phone.
      </Text>
      <Button
        label={kind === 'vaccine' ? 'Remove vaccine' : 'Remove visit'}
        tone="orange"
        onPress={() => {
          store.removeRecord(kind, record.id);
          router.back();
        }}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  date: { fontFamily: font.extra, fontSize: 22, color: colors.orange, marginBottom: 8 },
  body: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22, color: colors.ink, marginBottom: 18 },
});
