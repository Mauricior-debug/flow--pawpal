import { useState } from 'react';
import { router } from 'expo-router';
import { Button, Field, Sheet } from '../components/ui';
import { useStore } from '../store';

export default function EditProfileScreen() {
  const store = useStore();
  const [name, setName] = useState(store.dog.name);
  const [breed, setBreed] = useState(store.dog.breed);
  const [age, setAge] = useState(store.dog.ageYears > 0 ? String(store.dog.ageYears) : '');
  const [error, setError] = useState('');

  function save() {
    const years = Number(age);
    if (!name.trim() || !breed.trim() || !Number.isFinite(years) || years < 0 || years > 30) {
      setError('Add a name, a breed, and an age from 0 to 30.');
      return;
    }
    store.updateDog({ name: name.trim(), breed: breed.trim(), ageYears: years });
    router.back();
  }

  return (
    <Sheet title="Edit profile">
      <Field label="Name" value={name} onChangeText={setName} placeholder="Buddy" />
      <Field label="Breed" value={breed} onChangeText={setBreed} placeholder="Corgi" />
      <Field label="Age in years" value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="3" error={error} />
      <Button label="Save profile" onPress={save} />
    </Sheet>
  );
}
