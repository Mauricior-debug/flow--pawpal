import * as Haptics from 'expo-haptics';

export function celebrate() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}
