import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { Theme } from '@/constants/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

export const ScreenContainer = ({ children, scroll = false }: Props) => {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
});
