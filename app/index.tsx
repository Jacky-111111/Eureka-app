import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>IdeaSwipe</Text>
        <Text style={styles.subtitle}>
          Save your product ideas, generate new ones with AI, and swipe through opportunities.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="View My Ideas" onPress={() => router.push('/ideas')} />
        <PrimaryButton
          label="Generate Ideas"
          variant="secondary"
          onPress={() => router.push('/generate')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: Theme.spacing.sm,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: Theme.colors.textSecondary,
    maxWidth: '90%',
  },
  actions: {
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
});
