import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterBar } from '@/components/FilterBar';
import { IdeaListItem } from '@/components/IdeaListItem';
import { LoadingState } from '@/components/LoadingState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';

export default function MyIdeasTabScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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
      <View style={styles.header}>
        <Text style={styles.title}>My Ideas</Text>
        <Text style={styles.subtitle}>Your saved notebook of product and startup ideas.</Text>
      </View>

      <FilterBar
        selectedCategory={categoryFilter}
        selectedSort={sortOption}
        onCategoryChange={setCategoryFilter}
        onSortChange={setSortOption}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Search ideas, tags, tech stack..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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
          data={searchedIdeas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <IdeaListItem idea={item} onPress={() => router.push(`/ideas/${item.id}`)} />
          )}
        />
      ) : null}

      <PrimaryButton label="Create New Idea" onPress={() => router.push('/ideas/create')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
  },
  list: {
    gap: 10,
    paddingVertical: 12,
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
  error: {
    color: Theme.colors.danger,
    fontWeight: '600',
  },
});
