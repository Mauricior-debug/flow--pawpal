import { useState } from 'react';
import { router } from 'expo-router';
import { Button, Field, Sheet } from '../components/ui';
import { useStore } from '../store';

export default function WeightScreen() {
  const store = useStore();
  const [label, setLabel] = useState('Nov');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function save() {
    const lbs = Number(value);
    if (!label.trim() || !Number.isFinite(lbs) || lbs <= 0 || lbs > 250) {
      setError('Use a label and a weight between 1 and 250 lbs.');
      return;
    }
    const stored = store.weightUnit === 'kg' ? lbs / 0.453592 : lbs;
    store.addWeight(label.trim(), stored);
    router.back();
  }

  return (
    <Sheet title="Log weight">
      <Field label="Label" value={label} onChangeText={setLabel} placeholder="Nov" />
      <Field
        label={store.weightUnit === 'kg' ? 'Weight (kg)' : 'Weight (lbs)'}
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        placeholder="29.5"
        error={error}
      />
      <Button label="Save weight" onPress={save} />
    </Sheet>
  );
}
