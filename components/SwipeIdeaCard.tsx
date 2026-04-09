import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Theme } from '@/constants/theme';
import type { Idea } from '@/types/idea';
import { TagChip } from './TagChip';

type Props = {
  idea: Idea;
  dimmed?: boolean;
  intent?: 'neutral' | 'save' | 'skip';
};

const INTENT_GRADIENTS: Record<NonNullable<Props['intent']>, [string, string, string]> = {
  neutral: ['#F8FAFC', '#EEF2F7', '#E2E8F0'],
  save: ['#DCFCE7', '#BBF7D0', '#86EFAC'],
  skip: ['#FEE2E2', '#FECACA', '#FCA5A5'],
};

const INTENT_BORDER_COLORS: Record<NonNullable<Props['intent']>, string> = {
  neutral: 'rgba(148, 163, 184, 0.42)',
  save: 'rgba(22, 163, 74, 0.45)',
  skip: 'rgba(220, 38, 38, 0.4)',
};

const INTENT_SHADOW_COLORS: Record<NonNullable<Props['intent']>, string> = {
  neutral: '#334155',
  save: '#16A34A',
  skip: '#DC2626',
};

export const SwipeIdeaCard = ({ idea, dimmed = false, intent = 'neutral' }: Props) => (
  <View style={[styles.cardWrap, dimmed && styles.cardDimmed]}>
    <LinearGradient
      colors={INTENT_GRADIENTS[intent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    />
    <View style={styles.glossLayer} />

    <View
      style={[
        styles.card,
        {
          borderColor: INTENT_BORDER_COLORS[intent],
          shadowColor: INTENT_SHADOW_COLORS[intent],
        },
      ]}>
      <View style={styles.top}>
        <TagChip text={idea.category} />
        <TagChip text={idea.difficulty} />
      </View>

      <Text style={styles.title}>{idea.title}</Text>
      <Text style={styles.description}>{idea.description}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        {idea.techStack.slice(0, 3).map((tech) => (
          <TagChip key={tech} text={tech} />
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  glossLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  card: {
    margin: 1,
    borderRadius: Theme.radius.lg - 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    padding: Theme.spacing.lg,
    minHeight: 340,
    gap: 14,
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardDimmed: {
    opacity: 0.62,
  },
  top: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
