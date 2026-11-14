import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useChrome } from '../../chrome';
import { Press } from '../../components/ui';
import { ageLabel } from '../../format';
import { images } from '../../images';
import { leaveApp } from '../../navigation';
import { registerScroll } from '../../scroll';
import { useStore } from '../../store';
import { colors, font, space } from '../../theme';

export default function ProfileScreen() {
  const chrome = useChrome();
  const store = useStore();
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    registerScroll('profile', {
      scrollToOffset: ({ offset, animated }) => scroll.current?.scrollTo({ y: offset, animated }),
    });
    return () => registerScroll('profile', null);
  }, []);

  return (
    <ScrollView
      ref={scroll}
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: chrome.top,
        paddingBottom: chrome.bottom,
        paddingHorizontal: space.screen,
        width: '100%',
        maxWidth: chrome.maxWidth,
        alignSelf: 'center',
      }}
    >
      <Text accessibilityRole="header" style={styles.brand}>
        PawPal
      </Text>
      <Image
        source={images.profile}
        style={styles.photo}
        contentFit="contain"
        accessibilityLabel={`${store.dog.name}, a cartoon corgi`}
      />
      <Text style={styles.name}>{store.dog.name}</Text>
      <Text style={styles.meta}>
        {store.dog.breed} · {ageLabel(store.dog.ageYears)}
      </Text>

      <View style={styles.columns}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Row icon="person-outline" label="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <Row icon="checkmark-circle-outline" label="Notifications" onPress={() => router.push('/notifications')} />
          <Row icon="mail-outline" label="App Preferences" onPress={() => router.push('/preferences')} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Press accessibilityLabel="Logout" onPress={leaveApp} style={styles.accountRow}>
            <Ionicons name="time-outline" size={20} color={colors.orange} />
            <Text style={styles.logout}>Logout</Text>
          </Press>
          <Press
            accessibilityLabel="Delete Account"
            onPress={() => router.push('/delete-account')}
            style={styles.accountRow}
          >
            <Text style={styles.delete}>Delete Account</Text>
          </Press>
        </View>
      </View>
    </ScrollView>
  );
}

function Row({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Press accessibilityLabel={label} onPress={onPress} style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.teal} />
      <Text style={styles.rowLabel}>{label}</Text>
    </Press>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  brand: { fontFamily: font.extra, fontSize: 42, color: colors.teal, textAlign: 'center' },
  photo: { width: 230, height: 220, alignSelf: 'center', marginTop: 8 },
  name: { fontFamily: font.extra, fontSize: 34, color: colors.teal, textAlign: 'center', marginTop: 4 },
  meta: { fontFamily: font.bold, fontSize: 18, color: colors.orange, textAlign: 'center', marginTop: 4, marginBottom: 18 },
  columns: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  card: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: '#FFF6E4',
  },
  cardTitle: { fontFamily: font.extra, fontSize: 20, color: colors.teal, textAlign: 'center', marginBottom: 6 },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  rowLabel: { fontFamily: font.bold, color: colors.teal, fontSize: 14, flex: 1 },
  accountRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  logout: { fontFamily: font.bold, color: colors.orange, fontSize: 16 },
  delete: { fontFamily: font.extra, color: colors.orange, fontSize: 16 },
});
