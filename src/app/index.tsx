import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { celebrate } from '../haptics';
import { enterApp } from '../navigation';
import { useStore } from '../store';
import { images } from '../images';
import { colors, font, space } from '../theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [busy, setBusy] = useState(false);

  function continueWithApple() {
    if (busy) return;
    setBusy(true);
    store.ensureSample();
    celebrate();
    enterApp();
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 28 },
      ]}
    >
      <Text accessibilityRole="header" style={styles.brand}>
        PawPal
      </Text>
      <Image
        source={images.wave}
        style={styles.hero}
        contentFit="contain"
        accessibilityLabel="Biscuit the corgi waving hello"
      />
      <Text style={styles.headline}>Welcome to PawPal!</Text>
      <Text style={styles.tagline}>Your furry friend's best friend.</Text>
      <View style={styles.actions}>
        <Button
          label={busy ? 'Signing in…' : 'Continue with Apple'}
          onPress={continueWithApple}
          disabled={busy}
          icon={<Ionicons name="logo-apple" size={22} color={colors.white} />}
        />
        <Button
          label="Continue with Email"
          tone="outline"
          onPress={() => router.push('/email')}
          icon={<Ionicons name="mail-outline" size={22} color={colors.teal} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.screen,
    alignItems: 'center',
  },
  brand: {
    fontFamily: font.extra,
    fontSize: 48,
    color: colors.teal,
    textAlign: 'center',
  },
  hero: {
    width: 280,
    height: 280,
    marginTop: 12,
  },
  headline: {
    fontFamily: font.extra,
    fontSize: 30,
    color: colors.teal,
    textAlign: 'center',
    marginTop: 8,
  },
  tagline: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.orange,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    alignSelf: 'stretch',
    gap: 14,
    marginTop: 'auto',
    paddingTop: 28,
  },
});
