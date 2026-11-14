import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../store';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SystemUI.setBackgroundColorAsync(colors.cream).catch(() => undefined);

const sheet = {
  presentation: 'formSheet' as const,
  headerShown: false,
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.55, 0.92],
  sheetInitialDetentIndex: 1,
  sheetCornerRadius: 28,
  contentStyle: { backgroundColor: colors.cream },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const fontsReady = loaded || !!error;

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => undefined);
    const timeout = setTimeout(() => SplashScreen.hideAsync().catch(() => undefined), 1200);
    return () => clearTimeout(timeout);
  }, [fontsReady]);

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.cream },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Welcome to PawPal' }} />
          <Stack.Screen name="(tabs)" options={{ title: 'PawPal' }} />
          <Stack.Screen
            name="lesson"
            options={{
              title: 'Sit & Stay',
              headerShown: true,
              headerTintColor: colors.teal,
              headerStyle: { backgroundColor: colors.cream },
              headerShadowVisible: false,
              headerTitleStyle: { color: colors.teal, fontFamily: 'Nunito_800ExtraBold' },
              headerBackTitle: 'Training',
            }}
          />
          <Stack.Screen name="email" options={{ ...sheet, title: 'Continue with Email' }} />
          <Stack.Screen name="reminder" options={{ ...sheet, title: 'Vet reminder' }} />
          <Stack.Screen name="meal" options={{ ...sheet, title: 'Next meal' }} />
          <Stack.Screen name="vet-visit" options={{ ...sheet, title: 'Add vet visit', sheetAllowedDetents: [0.62, 0.95] }} />
          <Stack.Screen name="vaccine" options={{ ...sheet, title: 'Add vaccine', sheetAllowedDetents: [0.62, 0.95] }} />
          <Stack.Screen name="weight" options={{ ...sheet, title: 'Log weight' }} />
          <Stack.Screen name="edit-profile" options={{ ...sheet, title: 'Edit profile', sheetAllowedDetents: [0.7, 0.95] }} />
          <Stack.Screen name="preferences" options={{ ...sheet, title: 'App preferences' }} />
          <Stack.Screen name="notifications" options={{ ...sheet, title: 'Notifications' }} />
          <Stack.Screen name="delete-account" options={{ ...sheet, title: 'Delete account', sheetAllowedDetents: [0.42, 0.75] }} />
          <Stack.Screen name="walk-done" options={{ ...sheet, title: 'Walk saved', sheetAllowedDetents: [0.42, 0.75] }} />
          <Stack.Screen name="moment" options={{ ...sheet, title: 'Save a moment', sheetAllowedDetents: [0.62, 0.95] }} />
          <Stack.Screen name="record" options={{ ...sheet, title: 'Record' }} />
          <Stack.Screen name="trick" options={{ ...sheet, title: 'Trick' }} />
        </Stack>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
