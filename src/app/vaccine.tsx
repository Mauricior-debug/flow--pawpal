import { useState } from 'react';
import { router } from 'expo-router';
import { Button, Field, Sheet } from '../components/ui';
import { useStore } from '../store';

export default function VaccineScreen() {
  const store = useStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  function save() {
    if (!title.trim() || !date.trim()) {
      setError('Add the vaccine and the date.');
      return;
    }
    store.addVaccine(title.trim(), date.trim());
    router.back();
  }

  return (
    <Sheet title="Add a vaccine">
      <Field label="Vaccine" value={title} onChangeText={setTitle} placeholder="Bordetetr" error={error && !title.trim() ? error : undefined} />
      <Field label="Date" value={date} onChangeText={setDate} placeholder="May 20, 2024" error={error && !date.trim() ? error : undefined} />
      <Button label="Save vaccine" onPress={save} />
    </Sheet>
  );
}
