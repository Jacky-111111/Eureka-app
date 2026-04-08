import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

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
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const currentIdea = generatedIdeas[index];
  const nextIdea = generatedIdeas[index + 1];
  const total = generatedIdeas.length;
  const isComplete = index >= total && total > 0;
  const progress = total === 0 ? 0 : (index + 1) / total;

  const resetCard = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 6,
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

  const animateOut = useCallback(
    (direction: 'save' | 'skip', velocityY = 0) => {
      const x = direction === 'save' ? width * 0.95 : -width * 0.95;
      Animated.timing(position, {
        toValue: { x, y: velocityY * 0.25 },
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        if (direction === 'save') {
          void handleSave();
          return;
        }
        handleSkip();
      });
    },
    [handleSave, handleSkip, position, width],
  );

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
            animateOut('save', gestureState.dy);
            return;
          }
          if (gestureState.dx < -SWIPE_THRESHOLD) {
            animateOut('skip', gestureState.dy);
            return;
          }
          resetCard();
        },
      }),
    [animateOut, position, resetCard],
  );

  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const saveBadgeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.6, SWIPE_THRESHOLD],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  const skipBadgeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.6, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  if (generatedIdeas.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          title="No generated ideas"
          message="Run idea generation first to start swiping."
          actionLabel="Back to Generator"
          onAction={() => router.replace('/new-ideas')}
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
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 8)}%` }]} />
        </View>
      </View>

      <View style={styles.deckCard}>
        {nextIdea ? (
          <View style={styles.backCard}>
            <SwipeIdeaCard idea={nextIdea} dimmed />
          </View>
        ) : null}

        <Animated.View
          style={[
            styles.frontCard,
            { transform: [...position.getTranslateTransform(), { rotate }] },
          ]}
          {...panResponder.panHandlers}>
          {currentIdea ? <SwipeIdeaCard idea={currentIdea} /> : null}

          <Animated.View style={[styles.intentBadgeLeft, { opacity: skipBadgeOpacity }]}>
            <Text style={styles.intentTextSkip}>SKIP</Text>
          </Animated.View>
          <Animated.View style={[styles.intentBadgeRight, { opacity: saveBadgeOpacity }]}>
            <Text style={styles.intentTextSave}>SAVE</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.actionsWrap}>
        <View style={styles.actions}>
          <PrimaryButton
            label="Skip"
            variant="secondary"
            onPress={() => animateOut('skip')}
            style={styles.action}
          />
          <PrimaryButton label="Save" onPress={() => animateOut('save')} style={styles.action} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 2,
  },
  counter: {
    fontSize: 31,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  tip: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Theme.colors.primary,
  },
  deckCard: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    marginTop: 4,
  },
  backCard: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    transform: [{ scale: 0.97 }],
  },
  frontCard: {
    zIndex: 2,
  },
  intentBadgeLeft: {
    position: 'absolute',
    top: 24,
    left: 20,
    borderWidth: 2,
    borderColor: Theme.colors.danger,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '-12deg' }],
    backgroundColor: '#FFFFFFEE',
  },
  intentBadgeRight: {
    position: 'absolute',
    top: 24,
    right: 20,
    borderWidth: 2,
    borderColor: Theme.colors.success,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '12deg' }],
    backgroundColor: '#FFFFFFEE',
  },
  intentTextSkip: {
    color: Theme.colors.danger,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  intentTextSave: {
    color: Theme.colors.success,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  actionsWrap: {
    backgroundColor: '#FFFFFFB8',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    flex: 1,
  },
});
