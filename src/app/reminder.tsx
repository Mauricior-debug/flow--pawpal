import { Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Sheet } from '../components/ui';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function ReminderScreen() {
  const store = useStore();
  const reminder = store.reminder;
  return (
    <Sheet title="Vet reminder">
      {reminder ? (
        <Text style={styles.body}>
          {reminder.title} {reminder.body} The yearly check-up on file is Nov 15, 2023.
        </Text>
      ) : (
        <Text style={styles.body}>Nothing is booked. Add a vet visit from Health when you have a date.</Text>
      )}
      <Button
        label="See vet visits"
        onPress={() => {
          router.back();
          router.navigate('/health');
        }}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: font.semibold,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
    marginBottom: 18,
  },
});
