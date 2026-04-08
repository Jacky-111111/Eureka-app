import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerTitleStyle: { fontWeight: '700' } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ideas/index" options={{ title: 'My Ideas' }} />
        <Stack.Screen name="ideas/create" options={{ title: 'Create Idea' }} />
        <Stack.Screen name="ideas/edit" options={{ title: 'Edit Idea' }} />
        <Stack.Screen name="ideas/[id]" options={{ title: 'Idea Detail' }} />
        <Stack.Screen name="generate/index" options={{ title: 'Generate Ideas' }} />
        <Stack.Screen name="generate/swipe" options={{ title: 'Swipe Ideas' }} />
        <Stack.Screen name="generate/summary" options={{ title: 'Session Summary' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
