import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { IdeaForm } from '@/components/IdeaForm';
import { LoadingState } from '@/components/LoadingState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';
import type { CreateIdeaInput } from '@/types/idea';

export default function EditIdeaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ideas, loading, refresh, updateIdea } = useIdeas();

  const idea = useMemo(() => ideas.find((item) => item.id === id), [ideas, id]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleSubmit = async (value: CreateIdeaInput) => {
    if (!id) {
      return;
    }
    await updateIdea(id, value);
    Alert.alert('Updated', 'Your idea changes are saved.');
    router.replace(`/ideas/${id}`);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading idea..." />
      </ScreenContainer>
    );
  }

  if (!idea) {
    return (
      <ScreenContainer>
        <EmptyState title="Idea not found" message="Could not load this idea for editing." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Edit your idea</Text>
      <IdeaForm initialValue={idea} submitLabel="Save Changes" onSubmit={handleSubmit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
  },
});
