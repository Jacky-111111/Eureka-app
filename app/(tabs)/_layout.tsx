import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Theme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        sceneStyle: styles.scene,
        tabBarBackground: () => <View style={styles.glassBackground} />,
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

const styles = StyleSheet.create({
  scene: {
    backgroundColor: Theme.colors.background,
    paddingBottom: 78,
  },
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 72,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 0,
    borderRadius: 26,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
  },
  tabItem: {
    borderRadius: 18,
    marginHorizontal: 8,
  },
  tabLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
});
