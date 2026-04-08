import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { IDEA_CATEGORIES } from '@/constants/categories';
import { IDEA_DIFFICULTIES } from '@/constants/difficulty';
import { Theme } from '@/constants/theme';
import { useGeneratedIdeas } from '@/hooks/useGeneratedIdeas';
import type { IdeaDifficulty, IdeaGenerationRequest } from '@/types/idea';

export default function GenerateIdeasScreen() {
  const router = useRouter();
  const { loading, error, generateIdeas } = useGeneratedIdeas();

  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<IdeaGenerationRequest['category']>('Any');
  const [difficulty, setDifficulty] = useState<IdeaGenerationRequest['difficulty']>('Any');

  const handleGenerate = async () => {
    const ideas = await generateIdeas({
      prompt: prompt.trim() || undefined,
      category,
      difficulty,
    });

    if (ideas.length > 0) {
      router.push('/generate/swipe');
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Generate AI Ideas</Text>
        <Text style={styles.subtitle}>
          Add an optional prompt and preferences, then swipe through generated ideas.
        </Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Prompt (optional)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Give me AI app ideas for students"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Category preference</Text>
        <View style={styles.row}>
          {(['Any', ...IDEA_CATEGORIES] as const).map((value) => (
            <PrimaryButton
              key={value}
              label={value}
              onPress={() => setCategory(value)}
              variant={category === value ? 'primary' : 'secondary'}
              style={styles.chip}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Difficulty preference</Text>
        <View style={styles.row}>
          {(['Any', ...IDEA_DIFFICULTIES] as ('Any' | IdeaDifficulty)[]).map((value) => (
            <PrimaryButton
              key={value}
              label={value}
              onPress={() => setDifficulty(value)}
              variant={difficulty === value ? 'primary' : 'secondary'}
              style={styles.chip}
            />
          ))}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label={loading ? 'Generating...' : 'Generate Ideas'}
        onPress={handleGenerate}
        disabled={loading}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  group: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Theme.colors.text,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
  },
  error: {
    color: Theme.colors.danger,
    fontWeight: '600',
  },
});
