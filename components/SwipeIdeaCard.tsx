import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import type { Idea } from '@/types/idea';
import { TagChip } from './TagChip';

type Props = {
  idea: Idea;
  dimmed?: boolean;
};

export const SwipeIdeaCard = ({ idea, dimmed = false }: Props) => (
  <View style={[styles.card, dimmed && styles.cardDimmed]}>
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
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.lg,
    minHeight: 340,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardDimmed: {
    opacity: 0.5,
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
    backgroundColor: Theme.colors.border,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
