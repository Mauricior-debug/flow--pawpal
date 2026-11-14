import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Button, Field, Sheet } from '../components/ui';
import { useStore } from '../store';
import { colors, font } from '../theme';

export default function MomentScreen() {
  const store = useStore();
  const [note, setNote] = useState('');
  const [uri, setUri] = useState<string | undefined>();
  const [error, setError] = useState('');

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo access is off. You can still save a note.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setUri(result.assets[0].uri);
      setError('');
    }
  }

  function save() {
    if (store.walk.status === 'idle') {
      setError('Start the walk before saving a moment.');
      return;
    }
    if (!note.trim() && !uri) {
      setError('Add a note or a photo.');
      return;
    }
    store.addMoment(note.trim(), uri);
    router.back();
  }

  return (
    <Sheet title="Save a moment">
      <Field label="Note" value={note} onChangeText={setNote} placeholder="Shady spot on the path" multiline error={error} />
      {uri ? <Image source={{ uri }} style={styles.photo} contentFit="cover" accessibilityLabel="Chosen photo" /> : null}
      <Button label={uri ? 'Choose a different photo' : 'Choose a photo'} tone="outline" onPress={choosePhoto} />
      <ViewGap />
      <Button label="Save moment" tone="orange" onPress={save} />
    </Sheet>
  );
}

function ViewGap() {
  return <Text style={styles.gap}> </Text>;
}

const styles = StyleSheet.create({
  photo: { width: '100%', height: 160, borderRadius: 16, marginBottom: 12 },
  gap: { height: 10, fontFamily: font.regular },
});
