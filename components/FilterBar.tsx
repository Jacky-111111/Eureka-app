import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IDEA_CATEGORIES } from '@/constants/categories';
import { Theme } from '@/constants/theme';
import type { Idea, IdeaCategory } from '@/types/idea';
import type { IdeaSortOption } from '@/utils/sortIdeas';

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
}: Props) => {
  const categories = ['All', ...IDEA_CATEGORIES] as (Idea['category'] | 'All')[];

  return (
    <View style={styles.container}>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Category</Text>
        {selectedCategory !== 'All' ? (
          <Pressable onPress={() => onCategoryChange('All')}>
            <Text style={styles.resetText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}>
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => onCategoryChange(category)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Sort</Text>
      <View style={styles.segment}>
        <Pressable
          onPress={() => onSortChange('recent')}
          style={[styles.segmentItem, selectedSort === 'recent' && styles.segmentItemActive]}>
          <Text style={[styles.segmentText, selectedSort === 'recent' && styles.segmentTextActive]}>
            Newest
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onSortChange('difficulty')}
          style={[styles.segmentItem, selectedSort === 'difficulty' && styles.segmentItemActive]}>
          <Text
            style={[styles.segmentText, selectedSort === 'difficulty' && styles.segmentTextActive]}>
            Easy to Hard
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 10,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  categoriesRow: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#F8FAFC',
  },
  chipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  segment: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    flexDirection: 'row',
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  segmentTextActive: {
    color: Theme.colors.text,
  },
});
