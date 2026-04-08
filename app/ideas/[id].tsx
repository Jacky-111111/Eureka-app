import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { IdeaCard } from '@/components/IdeaCard';
import { LoadingState } from '@/components/LoadingState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';
import { formatDate } from '@/utils/formatDate';

export default function IdeaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { ideas, loading, refresh, archiveIdea, deleteIdea } = useIdeas();
  const [submitting, setSubmitting] = useState(false);

  const idea = useMemo(() => ideas.find((item) => item.id === params.id), [ideas, params.id]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleArchive = async () => {
    if (!idea) {
      return;
    }
    setSubmitting(true);
    try {
      await archiveIdea(idea.id);
      Alert.alert('Archived', 'Idea moved to Archived.');
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!idea) {
      return;
    }
    Alert.alert('Delete Idea', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setSubmitting(true);
          try {
            await deleteIdea(idea.id);
            router.back();
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
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
        <EmptyState title="Idea not found" message="The selected idea no longer exists." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <IdeaCard idea={idea} />
      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Created</Text>
        <Text style={styles.metaValue}>{formatDate(idea.createdAt)}</Text>
        <Text style={styles.metaLabel}>Updated</Text>
        <Text style={styles.metaValue}>{formatDate(idea.updatedAt)}</Text>
      </View>

      <PrimaryButton label="Edit Idea" onPress={() => router.push(`/ideas/edit?id=${idea.id}`)} />
      <PrimaryButton
        label={submitting ? 'Archiving...' : 'Archive Idea'}
        variant="secondary"
        onPress={handleArchive}
        disabled={submitting}
      />
      <PrimaryButton
        label={submitting ? 'Deleting...' : 'Delete Idea'}
        variant="danger"
        onPress={handleDelete}
        disabled={submitting}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  metaCard: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: Theme.colors.textSecondary,
    fontWeight: '700',
    marginTop: 6,
  },
  metaValue: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: '600',
  },
});
