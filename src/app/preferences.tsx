import { StyleSheet, Text, View } from 'react-native';
import { Press, Sheet } from '../components/ui';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function PreferencesScreen() {
  const store = useStore();
  return (
    <Sheet title="App preferences">
      <Text style={styles.label}>Distance</Text>
      <View style={styles.row}>
        <Choice label="Kilometers" selected={store.units === 'km'} onPress={() => store.setUnits('km')} />
        <Choice label="Miles" selected={store.units === 'mi'} onPress={() => store.setUnits('mi')} />
      </View>
      <Text style={styles.label}>Weight</Text>
      <View style={styles.row}>
        <Choice label="Pounds" selected={store.weightUnit === 'lbs'} onPress={() => store.setWeightUnit('lbs')} />
        <Choice label="Kilograms" selected={store.weightUnit === 'kg'} onPress={() => store.setWeightUnit('kg')} />
      </View>
      <Text style={styles.note}>Walks, the home ring, and the weight chart use this choice right away.</Text>
    </Sheet>
  );
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Press
      accessibilityLabel={label}
      accessibilityHint={selected ? 'Selected' : undefined}
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceOn]}
      pressedStyle={{ opacity: 0.8 }}
    >
      <Text style={[styles.choiceText, selected && styles.choiceTextOn]}>{label}</Text>
    </Press>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: font.extra, color: colors.teal, fontSize: 16, marginBottom: 8, marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  choice: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  choiceOn: { backgroundColor: colors.teal },
  choiceText: { fontFamily: font.bold, color: colors.teal, fontSize: 15 },
  choiceTextOn: { color: colors.white },
  note: { fontFamily: font.semibold, color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 4 },
});
