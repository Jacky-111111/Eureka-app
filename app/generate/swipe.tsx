import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SwipeIdeaCard } from '@/components/SwipeIdeaCard';
import { Theme } from '@/constants/theme';
import { useGeneratedIdeas } from '@/hooks/useGeneratedIdeas';
import { useIdeas } from '@/hooks/useIdeas';

const SWIPE_THRESHOLD = 110;

export default function SwipeDeckScreen() {
  const router = useRouter();
  const { generatedIdeas, clearSession } = useGeneratedIdeas();
  const { createIdea } = useIdeas();
  const [index, setIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const currentIdea = generatedIdeas[index];
  const total = generatedIdeas.length;
  const isComplete = index >= total && total > 0;

  const resetCard = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [position]);

  const moveNext = useCallback(() => {
    position.setValue({ x: 0, y: 0 });
    setIndex((prev) => prev + 1);
  }, [position]);

  const handleSave = useCallback(async () => {
    if (!currentIdea) {
      return;
    }
    await createIdea({
      title: currentIdea.title,
      description: currentIdea.description,
      category: currentIdea.category,
      techStack: currentIdea.techStack,
      difficulty: currentIdea.difficulty,
      status: 'New',
      tags: currentIdea.tags,
      source: 'ai',
    });
    setSavedCount((prev) => prev + 1);
    moveNext();
  }, [createIdea, currentIdea, moveNext]);

  const handleSkip = useCallback(() => {
    setSkippedCount((prev) => prev + 1);
    moveNext();
  }, [moveNext]);

  const finishSession = () => {
    const count = savedCount;
    clearSession();
    router.replace(`/generate/summary?saved=${count}&total=${total}`);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            void handleSave();
            return;
          }
          if (gestureState.dx < -SWIPE_THRESHOLD) {
            handleSkip();
            return;
          }
          resetCard();
        },
      }),
    [handleSave, handleSkip, position, resetCard],
  );

  if (generatedIdeas.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          title="No generated ideas"
          message="Run idea generation first to start swiping."
          actionLabel="Back to Generator"
          onAction={() => router.replace('/generate')}
        />
      </ScreenContainer>
    );
  }

  if (isComplete) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Deck complete"
          message={`Saved ${savedCount} and skipped ${skippedCount} ideas.`}
          actionLabel="View Summary"
          onAction={finishSession}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.counter}>
          Idea {index + 1} / {total}
        </Text>
        <Text style={styles.tip}>Swipe right to save, left to skip</Text>
      </View>

      <Animated.View
        style={[styles.deckCard, { transform: [...position.getTranslateTransform()] }]}
        {...panResponder.panHandlers}>
        {currentIdea ? <SwipeIdeaCard idea={currentIdea} /> : null}
      </Animated.View>

      <View style={styles.actions}>
        <PrimaryButton label="Skip" variant="secondary" onPress={handleSkip} style={styles.action} />
        <PrimaryButton label="Save" onPress={() => void handleSave()} style={styles.action} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  counter: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  tip: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  deckCard: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  action: {
    flex: 1,
  },
});
