import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { IDEA_CATEGORIES } from '@/constants/categories';
import { Theme } from '@/constants/theme';
import type { Idea, IdeaCategory } from '@/types/idea';
import type { IdeaSortOption } from '@/utils/sortIdeas';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  selectedCategory: IdeaCategory | 'All';
  selectedSort: IdeaSortOption;
  onCategoryChange: (category: IdeaCategory | 'All') => void;
  onSortChange: (sort: IdeaSortOption) => void;
};

export const FilterBar = ({
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}: Props) => (
  <View style={styles.container}>
    <Text style={styles.label}>Category</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {(['All', ...IDEA_CATEGORIES] as (Idea['category'] | 'All')[]).map((category) => (
        <PrimaryButton
          key={category}
          label={category}
          onPress={() => onCategoryChange(category)}
          variant={selectedCategory === category ? 'primary' : 'secondary'}
          style={styles.chipButton}
        />
      ))}
    </ScrollView>

    <Text style={styles.label}>Sort</Text>
    <View style={styles.row}>
      <PrimaryButton
        label="Recent"
        onPress={() => onSortChange('recent')}
        variant={selectedSort === 'recent' ? 'primary' : 'secondary'}
        style={styles.sortButton}
      />
      <PrimaryButton
        label="Difficulty"
        onPress={() => onSortChange('difficulty')}
        variant={selectedSort === 'difficulty' ? 'primary' : 'secondary'}
        style={styles.sortButton}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.sm,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chipButton: {
    paddingVertical: 10,
  },
  sortButton: {
    flex: 1,
  },
});
