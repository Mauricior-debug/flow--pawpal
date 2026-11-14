import { Text, StyleSheet } from 'react-native';
import { Button, Sheet } from '../components/ui';
import { celebrate } from '../haptics';
import { leaveApp } from '../navigation';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function DeleteAccountScreen() {
  const store = useStore();

  function remove() {
    store.reset();
    celebrate();
    leaveApp();
  }

  return (
    <Sheet title="Delete account">
      <Text style={styles.body}>
        This clears {store.dog.name}'s walks, meals, vet records, and training on this phone. Signing in again brings the sample day back.
      </Text>
      <Button label={`Delete ${store.dog.name}'s records`} tone="orange" onPress={remove} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: font.semibold, fontSize: 16, lineHeight: 23, color: colors.ink, marginBottom: 18 },
});
