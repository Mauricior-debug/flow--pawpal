import { StyleSheet, Switch, Text, View } from 'react-native';
import { Sheet } from '../components/ui';
import { useStore } from '../store';
import { colors, font } from '../theme';

const rows = [
  { key: 'meals' as const, label: 'Meal reminders' },
  { key: 'walks' as const, label: 'Walk reminders' },
  { key: 'training' as const, label: 'Training reminders' },
];

export default function NotificationsScreen() {
  const store = useStore();
  return (
    <Sheet title="Notifications">
      <Text style={styles.note}>These stay on this phone. PawPal does not send system alerts.</Text>
      {rows.map((row) => (
        <View key={row.key} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Switch
            accessibilityLabel={row.label}
            value={store.notifications[row.key]}
            onValueChange={(value) => store.setNotifications({ ...store.notifications, [row.key]: value })}
            trackColor={{ false: colors.line, true: colors.orange }}
            thumbColor={colors.white}
          />
        </View>
      ))}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  note: { fontFamily: font.semibold, color: colors.ink, fontSize: 16, lineHeight: 22, marginBottom: 12 },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  label: { fontFamily: font.bold, color: colors.teal, fontSize: 17 },
});
