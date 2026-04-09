import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { Theme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        sceneStyle: styles.scene,
        tabBarBackground: () => (
          <View style={styles.glassBackground}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 100 : 45}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(255,255,255,0.42)', 'rgba(255,255,255,0.16)', 'rgba(255,255,255,0.08)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.glassTopHighlight} />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'My Ideas',
          tabBarLabel: 'My Ideas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'albums' : 'albums-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-ideas"
        options={{
          title: 'New Ideas',
          tabBarLabel: 'New Ideas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: Theme.colors.background,
    paddingBottom: 70,
  },
  tabBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopWidth: 0,
    borderRadius: 22,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 0,
  },
  tabItem: {
    borderRadius: 12,
    marginHorizontal: 2,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 1,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.58)',
  },
  glassTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth + 1,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
});
