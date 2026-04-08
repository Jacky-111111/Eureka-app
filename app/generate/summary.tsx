import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';

export default function SummaryScreen() {
  const router = useRouter();
  const { saved = '0', total = '0' } = useLocalSearchParams<{ saved: string; total: string }>();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Session complete</Text>
        <Text style={styles.stat}>
          Saved <Text style={styles.emphasis}>{saved}</Text> out of{' '}
          <Text style={styles.emphasis}>{total}</Text> ideas
        </Text>
        <Text style={styles.caption}>Your saved ideas are now in your idea library.</Text>
      </View>

      <PrimaryButton label="Go to My Ideas" onPress={() => router.replace('/ideas')} />
      <PrimaryButton
        label="Generate Again"
        variant="secondary"
        onPress={() => router.replace('/new-ideas')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  stat: {
    fontSize: 20,
    color: Theme.colors.textSecondary,
  },
  emphasis: {
    color: Theme.colors.primary,
    fontWeight: '800',
  },
  caption: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
});
