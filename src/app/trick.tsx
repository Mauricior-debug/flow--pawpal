import { Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Sheet } from '../components/ui';
import { celebrate } from '../haptics';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function TrickScreen() {
  const store = useStore();
  const params = useLocalSearchParams<{ id?: string }>();
  const trick = store.tricks.find((item) => item.id === params.id);

  if (!trick) {
    return (
      <Sheet title="Trick">
        <Text style={styles.body}>That trick is not on the list.</Text>
        <Button label="Close" onPress={() => router.back()} />
      </Sheet>
    );
  }

  function practice() {
    if (!trick || trick.done) return;
    const mastered = store.practiceTrick(trick.id);
    if (mastered) celebrate();
  }

  return (
    <Sheet title={trick.name}>
      <Text style={styles.body}>
        {trick.done
          ? `${store.dog.name} has this one. It counts toward the ${store.tricksMastered} tricks mastered.`
          : `${Math.round(trick.progress * 100)}% of the way there. Practice once to move the bar.`}
      </Text>
      {trick.done ? (
        <Button label="Back to training" onPress={() => router.back()} />
      ) : (
        <Button label={`Practice ${trick.name}`} tone="orange" onPress={practice} />
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: font.semibold, fontSize: 17, lineHeight: 24, color: colors.ink, marginBottom: 18 },
});
