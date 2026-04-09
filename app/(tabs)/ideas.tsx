import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    deleteIdea,
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

  const handleDeleteIdea = useCallback(
    async (id: string) => {
      await deleteIdea(id);
    },
    [deleteIdea],
  );

  return (
    <ScreenContainer>
      <View style={styles.topControls}>
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
            onPress={() => setViewMode('list')}
            accessibilityRole="button"
            accessibilityLabel="List view">
            <Ionicons
              name={viewMode === 'list' ? 'list' : 'list-outline'}
              size={18}
              color={viewMode === 'list' ? Theme.colors.text : Theme.colors.textSecondary}
            />
          </Pressable>
          <Pressable
            style={[styles.viewToggleItem, viewMode === 'grid' && styles.viewToggleItemActive]}
            onPress={() => setViewMode('grid')}
            accessibilityRole="button"
            accessibilityLabel="Grid view">
            <Ionicons
              name={viewMode === 'grid' ? 'grid' : 'grid-outline'}
              size={17}
              color={viewMode === 'grid' ? Theme.colors.text : Theme.colors.textSecondary}
            />
          </Pressable>
        </View>
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
              <SwipeableIdeaItem
                idea={item}
                onPress={() => router.push(`/ideas/${item.id}`)}
                onDelete={handleDeleteIdea}
              />
            )
          }
        />
      ) : null}

      {!loading && !error && displayedIdeas.length > 0 ? (
        <PrimaryButton label="Create New Idea" onPress={() => router.push('/ideas/create')} />
      ) : null}
    </ScreenContainer>
  );
}

type GridIdeaItemProps = {
  idea: Idea;
  onPress: () => void;
};

type SwipeableIdeaItemProps = {
  idea: Idea;
  onPress: () => void;
  onDelete: (id: string) => Promise<void>;
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

const SwipeableIdeaItem = ({ idea, onPress, onDelete }: SwipeableIdeaItemProps) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = async () => {
    swipeableRef.current?.close();
    await onDelete(idea.id);
  };

  return (
    <Swipeable
      ref={swipeableRef}
      overshootRight={false}
      friction={2}
      rightThreshold={32}
      renderRightActions={() => (
        <Pressable style={styles.deleteAction} onPress={() => void handleDelete()}>
          <Text style={styles.deleteActionText}>Delete</Text>
        </Pressable>
      )}>
      <IdeaListItem idea={idea} onPress={onPress} />
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  topControls: {
    gap: 8,
    marginBottom: 6,
  },
  list: {
    gap: 10,
    paddingVertical: 8,
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
    backgroundColor: '#F3F6FA',
    borderWidth: 1,
    borderColor: '#E3E9F1',
    borderRadius: 12,
    padding: 2,
    flexDirection: 'row',
    gap: 2,
    alignSelf: 'flex-end',
    width: 88,
  },
  viewToggleItem: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggleItemActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DEE9',
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
  deleteAction: {
    width: 92,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
