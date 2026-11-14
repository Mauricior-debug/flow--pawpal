import { useState } from 'react';
import { router } from 'expo-router';
import { Button, Field, Sheet } from '../components/ui';
import { useStore } from '../store';

export default function VetVisitScreen() {
  const store = useStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  function save() {
    if (!title.trim() || !date.trim()) {
      setError('Add the visit and the date.');
      return;
    }
    store.addVisit(title.trim(), date.trim());
    router.back();
  }

  return (
    <Sheet title="Add a vet visit">
      <Field label="Visit" value={title} onChangeText={setTitle} placeholder="Yearly Check-up" error={error && !title.trim() ? error : undefined} />
      <Field label="Date" value={date} onChangeText={setDate} placeholder="Nov 15, 2023" error={error && !date.trim() ? error : undefined} />
      <Button label="Save visit" onPress={save} />
    </Sheet>
  );
}
