import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterBar } from '@/components/FilterBar';
import { IdeaListItem } from '@/components/IdeaListItem';
import { LoadingState } from '@/components/LoadingState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';
import type { Idea } from '@/types/idea';

export default function MyIdeasTabScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const {
    displayedIdeas,
    loading,
    error,
    categoryFilter,
    sortOption,
    setCategoryFilter,
    setSortOption,
    refresh,
  } = useIdeas();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const searchedIdeas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return displayedIdeas;
    }

    return displayedIdeas.filter((idea) => {
      const tags = idea.tags?.join(' ').toLowerCase() ?? '';
      const techStack = idea.techStack.join(' ').toLowerCase();
      return (
        idea.title.toLowerCase().includes(query) ||
        idea.description.toLowerCase().includes(query) ||
        tags.includes(query) ||
        techStack.includes(query)
      );
    });
  }, [displayedIdeas, searchQuery]);

  return (
    <ScreenContainer>
      <TextInput
        style={styles.searchInput}
        placeholder="Search ideas, tags, tech stack..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FilterBar
        selectedCategory={categoryFilter}
        selectedSort={sortOption}
        onCategoryChange={setCategoryFilter}
        onSortChange={setSortOption}
      />

      <View style={styles.viewToggle}>
        <Pressable
          style={[styles.viewToggleItem, viewMode === 'list' && styles.viewToggleItemActive]}
          onPress={() => setViewMode('list')}>
          <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>
            List
          </Text>
        </Pressable>
        <Pressable
          style={[styles.viewToggleItem, viewMode === 'grid' && styles.viewToggleItemActive]}
          onPress={() => setViewMode('grid')}>
          <Text style={[styles.viewToggleText, viewMode === 'grid' && styles.viewToggleTextActive]}>
            Grid
          </Text>
        </Pressable>
      </View>

      {loading ? <LoadingState message="Loading ideas..." /> : null}
      {!loading && error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && displayedIdeas.length === 0 ? (
        <EmptyState
          title="No saved ideas yet"
          message="Create your first idea manually to start building your library."
          actionLabel="Create New Idea"
          onAction={() => router.push('/ideas/create')}
        />
      ) : null}

      {!loading && !error && displayedIdeas.length > 0 && searchedIdeas.length === 0 ? (
        <EmptyState
          title="No matching ideas"
          message="Try a different keyword or clear search."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : null}

      {!loading && !error && searchedIdeas.length > 0 ? (
        <FlatList
          key={viewMode}
          data={searchedIdeas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          numColumns={viewMode === 'grid' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          renderItem={({ item }) =>
            viewMode === 'grid' ? (
              <GridIdeaItem idea={item} onPress={() => router.push(`/ideas/${item.id}`)} />
            ) : (
              <IdeaListItem idea={item} onPress={() => router.push(`/ideas/${item.id}`)} />
            )
          }
        />
      ) : null}

      <PrimaryButton label="Create New Idea" onPress={() => router.push('/ideas/create')} />
    </ScreenContainer>
  );
}

type GridIdeaItemProps = {
  idea: Idea;
  onPress: () => void;
};

const GridIdeaItem = ({ idea, onPress }: GridIdeaItemProps) => (
  <Pressable style={styles.gridCard} onPress={onPress}>
    <Text style={styles.gridTitle} numberOfLines={2}>
      {idea.title}
    </Text>
    <Text style={styles.gridDescription} numberOfLines={3}>
      {idea.description}
    </Text>
    <View style={styles.gridTagRow}>
      <View style={styles.gridTag}>
        <Text style={styles.gridTagText}>{idea.category}</Text>
      </View>
      <View style={styles.gridTag}>
        <Text style={styles.gridTagText}>{idea.difficulty}</Text>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  list: {
    gap: 10,
    paddingVertical: 12,
  },
  gridRow: {
    gap: 10,
  },
  searchInput: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  viewToggle: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    flexDirection: 'row',
    gap: 4,
  },
  viewToggleItem: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggleItemActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  viewToggleTextActive: {
    color: Theme.colors.text,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 12,
    minHeight: 176,
    gap: 8,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
    lineHeight: 23,
  },
  gridDescription: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  gridTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 'auto',
  },
  gridTag: {
    backgroundColor: Theme.colors.chipBg,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  gridTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  error: {
    color: Theme.colors.danger,
    fontWeight: '600',
  },
});
