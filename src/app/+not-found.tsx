import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/ui';
import { colors, font } from '../theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>
        That screen is missing
      </Text>
      <Text style={styles.body}>PawPal couldn't find this page. Head back to the welcome screen.</Text>
      <Button label="Back to PawPal" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: { fontFamily: font.extra, fontSize: 32, color: colors.teal },
  body: { fontFamily: font.semibold, fontSize: 16, color: colors.ink, lineHeight: 22, marginBottom: 8 },
});
