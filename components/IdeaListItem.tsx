import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import type { Idea } from '@/types/idea';
import { TagChip } from './TagChip';

type Props = {
  idea: Idea;
  onPress: () => void;
};

export const IdeaListItem = ({ idea, onPress }: Props) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{idea.title}</Text>
    <Text style={styles.description} numberOfLines={2}>
      {idea.description}
    </Text>
    <View style={styles.row}>
      <TagChip text={idea.category} />
      <TagChip text={idea.difficulty} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  description: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
});
