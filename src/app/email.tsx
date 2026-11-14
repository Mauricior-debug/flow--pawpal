import { useState } from 'react';
import { Button, Field, Sheet } from '../components/ui';
import { celebrate } from '../haptics';
import { enterApp } from '../navigation';

export default function EmailScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter an email like you@email.com.');
      return;
    }
    setError('');
    setBusy(true);
    await celebrate();
    enterApp();
  }

  return (
    <Sheet title="Continue with Email">
      <Field
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError('');
        }}
        error={error}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="you@email.com"
        textContentType="emailAddress"
      />
      <Button label={busy ? 'Continuing…' : 'Continue'} onPress={submit} disabled={busy} />
    </Sheet>
  );
}
