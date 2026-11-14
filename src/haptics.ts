import * as Haptics from 'expo-haptics';

export async function celebrate() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics are unavailable on some devices and on web.
  }
}
