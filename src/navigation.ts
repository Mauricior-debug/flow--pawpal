import { router } from 'expo-router';

export function enterApp() {
  router.dismissTo('/home');
}

export function leaveApp() {
  router.dismissTo('/');
}
