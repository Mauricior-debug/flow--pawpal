import { NativeTabs } from 'expo-router/native-tabs';
import { usePathname } from 'expo-router';
import { colors } from '../../theme';
import { scrollToTop } from '../../scroll';

const tabs = [
  { name: 'home', label: 'Home', sf: 'house.fill' as const, md: 'home' as const, path: '/home' },
  { name: 'walk', label: 'Walk', sf: 'pawprint.fill' as const, md: 'pets' as const, path: '/walk' },
  { name: 'health', label: 'Health', sf: 'plus.circle' as const, md: 'add_circle' as const, path: '/health' },
  { name: 'training', label: 'Training', sf: 'dumbbell.fill' as const, md: 'fitness_center' as const, path: '/training' },
  { name: 'profile', label: 'Profile', sf: 'person.fill' as const, md: 'person' as const, path: '/profile' },
];

export default function TabsLayout() {
  const pathname = usePathname();
  return (
    <NativeTabs
      tintColor={colors.orange}
      backgroundColor={colors.cream}
      indicatorColor={colors.orange}
      iconColor={{ default: colors.teal, selected: colors.orange }}
      labelStyle={{
        default: { color: colors.teal, fontSize: 11 },
        selected: { color: colors.orange, fontSize: 11, fontWeight: '700' },
      }}
      minimizeBehavior="never"
      disableTransparentOnScrollEdge
    >
      {tabs.map((tab) => (
        <NativeTabs.Trigger
          key={tab.name}
          name={tab.name}
          disableAutomaticContentInsets
          disableScrollToTop={false}
          listeners={{
            tabPress: () => {
              if (pathname === tab.path) scrollToTop(tab.name);
            },
          }}
        >
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
