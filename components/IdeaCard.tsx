import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import type { Idea } from '@/types/idea';
import { TagChip } from './TagChip';

type Props = {
  idea: Idea;
};

export const IdeaCard = ({ idea }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>{idea.title}</Text>
    <Text style={styles.description}>{idea.description}</Text>

    <View style={styles.row}>
      <TagChip text={idea.category} />
      <TagChip text={idea.difficulty} />
      <TagChip text={idea.status} />
    </View>

    <View style={styles.row}>
      {idea.techStack.map((tech) => (
        <TagChip key={tech} text={tech} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  description: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
