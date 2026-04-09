import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { IDEA_DIFFICULTIES } from '@/constants/difficulty';
import {
  IDEA_GENERATION_CATEGORY_PREFERENCES,
  IDEA_SOCIAL_THEME_PREFERENCES,
  IDEA_TECH_STACK_PREFERENCES,
} from '@/constants/generationFilters';
import { Theme } from '@/constants/theme';
import { useGeneratedIdeas } from '@/hooks/useGeneratedIdeas';
import type {
  IdeaGenerationCategoryPreference,
  IdeaDifficulty,
  IdeaGenerationRequest,
  IdeaSocialThemePreference,
  IdeaTechStackPreference,
} from '@/types/idea';

const IDEA_COUNT_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1);
const COUNT_ITEM_WIDTH = 56;
const COUNT_ITEM_GAP = 10;
const COUNT_SNAP_INTERVAL = COUNT_ITEM_WIDTH + COUNT_ITEM_GAP;
const COUNT_EDGE_FADE_WIDTH = 42;
const FILTER_CHIP_HEIGHT = 42;

const toggleMultiSelection = <T extends string>(selected: T[], value: T): T[] => {
  if (value === 'Any') {
    return ['Any' as T];
  }

  const next = selected.filter((item) => item !== ('Any' as T));
  if (next.includes(value)) {
    const removed = next.filter((item) => item !== value);
    return removed.length === 0 ? ['Any' as T] : removed;
  }

  return [...next, value];
};

export default function NewIdeasTabScreen() {
  const router = useRouter();
  const { loading, error, generateIdeas } = useGeneratedIdeas();
  const { width } = useWindowDimensions();
  const countScrollRef = useRef<ScrollView | null>(null);

  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<IdeaGenerationRequest['difficulty']>('Any');
  const [categories, setCategories] = useState<IdeaGenerationCategoryPreference[]>(['Any']);
  const [techStacks, setTechStacks] = useState<IdeaTechStackPreference[]>(['Any']);
  const [socialThemes, setSocialThemes] = useState<IdeaSocialThemePreference[]>(['Any']);
  const [count, setCount] = useState<number>(5);
  const countHorizontalPadding = Math.max(0, (width - COUNT_ITEM_WIDTH) / 2 - Theme.spacing.md);

  useEffect(() => {
    const selectedIndex = IDEA_COUNT_OPTIONS.indexOf(count);
    if (selectedIndex < 0) {
      return;
    }

    countScrollRef.current?.scrollTo({
      x: selectedIndex * COUNT_SNAP_INTERVAL,
      animated: false,
    });
  }, [count]);

  const handleGenerate = async () => {
    const ideas = await generateIdeas({
      prompt: prompt.trim() || undefined,
      difficulty,
      categories,
      techStacks,
      socialThemes,
      count,
    });

    if (ideas.length > 0) {
      router.push('/generate/swipe');
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          AI generate new ideas, then use Tinder-style swipe to save or skip.
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {IDEA_GENERATION_CATEGORY_PREFERENCES.map((value) => {
            const active = categories.includes(value);
            return (
              <Pressable
                key={value}
                onPress={() => setCategories((previous) => toggleMultiSelection(previous, value))}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{value}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
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

      <View style={styles.group}>
        <Text style={styles.label}>Tech stack preference</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {IDEA_TECH_STACK_PREFERENCES.map((value) => {
            const active = techStacks.includes(value);
            return (
              <Pressable
                key={value}
                onPress={() => setTechStacks((previous) => toggleMultiSelection(previous, value))}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{value}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Social theme</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {IDEA_SOCIAL_THEME_PREFERENCES.map((value) => {
            const active = socialThemes.includes(value);
            return (
              <Pressable
                key={value}
                onPress={() => setSocialThemes((previous) => toggleMultiSelection(previous, value))}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{value}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Number of ideas</Text>
        <View style={styles.countPickerWrap}>
          <ScrollView
            ref={countScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={COUNT_SNAP_INTERVAL}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={[styles.countRow, { paddingHorizontal: countHorizontalPadding }]}
            onMomentumScrollEnd={(event) => {
              const rawIndex = Math.round(event.nativeEvent.contentOffset.x / COUNT_SNAP_INTERVAL);
              const safeIndex = Math.min(
                Math.max(rawIndex, 0),
                IDEA_COUNT_OPTIONS.length - 1,
              );
              setCount(IDEA_COUNT_OPTIONS[safeIndex]);
            }}>
            {IDEA_COUNT_OPTIONS.map((value, index) => (
              <Pressable
                key={value}
                onPress={() => {
                  setCount(value);
                  countScrollRef.current?.scrollTo({
                    x: index * COUNT_SNAP_INTERVAL,
                    animated: true,
                  });
                }}
                style={[styles.countPill, count === value && styles.countPillActive]}>
                <Text style={[styles.countText, count === value && styles.countTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View pointerEvents="none" style={styles.countCenterIndicator} />
          <View pointerEvents="none" style={styles.leftFadeStrong} />
          <View pointerEvents="none" style={styles.leftFadeSoft} />
          <View pointerEvents="none" style={styles.rightFadeStrong} />
          <View pointerEvents="none" style={styles.rightFadeSoft} />
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label={loading ? 'Generating...' : 'Generate & Start Swiping'}
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
  filterRow: {
    gap: 8,
    paddingRight: Theme.spacing.md,
  },
  filterChip: {
    height: FILTER_CHIP_HEIGHT,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 12,
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  filterChipText: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  countRow: {
    gap: COUNT_ITEM_GAP,
    paddingRight: COUNT_EDGE_FADE_WIDTH,
  },
  countPickerWrap: {
    position: 'relative',
    borderRadius: Theme.radius.md,
    overflow: 'hidden',
  },
  countPill: {
    width: COUNT_ITEM_WIDTH,
    paddingVertical: 10,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  countText: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.text,
    lineHeight: 24,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  countCenterIndicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: '50%',
    marginLeft: -COUNT_ITEM_WIDTH / 2,
    width: COUNT_ITEM_WIDTH,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
  },
  leftFadeStrong: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: COUNT_EDGE_FADE_WIDTH,
    backgroundColor: Theme.colors.background,
    opacity: 0.82,
  },
  leftFadeSoft: {
    position: 'absolute',
    left: COUNT_EDGE_FADE_WIDTH,
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: Theme.colors.background,
    opacity: 0.42,
  },
  rightFadeStrong: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: COUNT_EDGE_FADE_WIDTH,
    backgroundColor: Theme.colors.background,
    opacity: 0.82,
  },
  rightFadeSoft: {
    position: 'absolute',
    right: COUNT_EDGE_FADE_WIDTH,
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: Theme.colors.background,
    opacity: 0.42,
  },
  error: {
    color: Theme.colors.danger,
    fontWeight: '600',
  },
});
