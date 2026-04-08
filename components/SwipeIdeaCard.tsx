import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import type { Idea } from '@/types/idea';
import { TagChip } from './TagChip';

type Props = {
  idea: Idea;
};

export const SwipeIdeaCard = ({ idea }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>{idea.title}</Text>
    <Text style={styles.description}>{idea.description}</Text>

    <View style={styles.row}>
      <TagChip text={idea.category} />
      <TagChip text={idea.difficulty} />
    </View>

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
    minHeight: 320,
    justifyContent: 'space-between',
    gap: Theme.spacing.md,
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
