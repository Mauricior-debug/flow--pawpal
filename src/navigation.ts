import { router } from 'expo-router';

export function enterApp() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/home');
}

export function leaveApp() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/');
}
