import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { Theme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: Theme.colors.primary,
      }}>
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'My Ideas',
          tabBarLabel: 'My Ideas',
          tabBarIcon: ({ color, size }) => <Ionicons name="albums-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="new-ideas"
        options={{
          title: 'New Ideas',
          tabBarLabel: 'New Ideas',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
