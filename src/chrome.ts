import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useChrome() {
  const insets = useSafeAreaInsets();
  const web = Platform.OS === 'web';
  return {
    top: insets.top + (web ? 64 : 10),
    bottom: insets.bottom + (web ? 28 : 108),
    maxWidth: 480,
  };
}
