import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: '700' },
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ideas/create" options={{ title: 'Create Idea' }} />
        <Stack.Screen name="ideas/edit" options={{ title: 'Edit Idea' }} />
        <Stack.Screen name="ideas/[id]" options={{ title: 'Idea Detail' }} />
        <Stack.Screen name="generate/swipe" options={{ title: 'Swipe New Ideas' }} />
        <Stack.Screen name="generate/summary" options={{ title: 'Session Summary' }} />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
