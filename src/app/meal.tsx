import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Field, Sheet } from '../components/ui';
import { celebrate } from '../haptics';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function MealScreen() {
  const store = useStore();
  const params = useLocalSearchParams<{ mode?: string }>();
  const adding = params.mode === 'add' || !store.nextMeal;
  const [time, setTime] = useState('6:00 PM');
  const [food, setFood] = useState('Royal Canin Puppy');
  const [error, setError] = useState('');

  async function markFed() {
    if (!store.nextMeal) return;
    store.markMealFed(store.nextMeal.id);
    await celebrate();
    router.back();
  }

  function saveMeal() {
    if (!time.trim() || !food.trim()) {
      setError('Add a time and the food.');
      return;
    }
    store.addMeal(time.trim(), food.trim());
    router.back();
  }

  if (!adding && store.nextMeal) {
    return (
      <Sheet title="Next meal">
        <Text style={styles.time}>{store.nextMeal.time}</Text>
        <Text style={styles.food}>{store.nextMeal.food}</Text>
        <Text style={styles.note}>Mark it when the bowl is empty. The next unfed meal moves up.</Text>
        <Button label="Mark as fed" tone="orange" onPress={markFed} />
      </Sheet>
    );
  }

  return (
    <Sheet title="Add a meal">
      <Field label="Time" value={time} onChangeText={setTime} placeholder="6:00 PM" error={error && !time.trim() ? error : undefined} />
      <Field label="Food" value={food} onChangeText={setFood} placeholder="Royal Canin Puppy" error={error && !food.trim() ? error : undefined} />
      {error && time.trim() && food.trim() ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Save meal" onPress={saveMeal} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  time: { fontFamily: font.extra, fontSize: 32, color: colors.orange },
  food: { fontFamily: font.bold, fontSize: 18, color: colors.teal, marginTop: 6, marginBottom: 12 },
  note: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22, color: colors.ink, marginBottom: 18 },
  error: { color: colors.orangeDark, fontFamily: font.bold, marginBottom: 8 },
});
