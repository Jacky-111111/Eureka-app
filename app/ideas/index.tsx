import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterBar } from '@/components/FilterBar';
import { IdeaListItem } from '@/components/IdeaListItem';
import { LoadingState } from '@/components/LoadingState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';

export default function MyIdeasScreen() {
  const router = useRouter();
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

      {loading ? <LoadingState message="Loading ideas..." /> : null}
      {!loading && error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && displayedIdeas.length === 0 ? (
        <EmptyState
          title="No saved ideas yet"
          message="Create one manually or save ideas from the swipe deck."
          actionLabel="Create Idea"
          onAction={() => router.push('/ideas/create')}
        />
      ) : null}

      {!loading && !error && displayedIdeas.length > 0 ? (
        <FlatList
          data={displayedIdeas}
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
  error: {
    color: Theme.colors.danger,
    fontWeight: '600',
  },
});
