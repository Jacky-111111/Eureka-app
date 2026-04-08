import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { IdeaCard } from '@/components/IdeaCard';
import { LoadingState } from '@/components/LoadingState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';
import { ideaAssistantService } from '@/services/ideaAssistantService';
import type { IdeaAiChatMessage, IdeaAiReview } from '@/types/idea';
import { formatDate } from '@/utils/formatDate';

export default function IdeaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { ideas, loading, refresh, archiveIdea, deleteIdea } = useIdeas();
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState<IdeaAiReview | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<IdeaAiChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

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

  const handleGenerateReview = async () => {
    if (!idea) {
      return;
    }

    setReviewLoading(true);
    setReviewError(null);
    try {
      const response = await ideaAssistantService.generateReview(idea);
      setReview(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate AI review.';
      setReviewError(message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!idea) {
      return;
    }

    const message = chatInput.trim();
    if (!message || chatLoading) {
      return;
    }

    setChatInput('');
    setChatLoading(true);
    setChatError(null);
    const nextHistory = [...chatMessages, { role: 'user' as const, content: message }];
    setChatMessages(nextHistory);

    try {
      const answer = await ideaAssistantService.chatAboutIdea({
        idea,
        message,
        history: chatMessages,
      });
      setChatMessages((previous) => [...previous, { role: 'assistant', content: answer }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get AI reply.';
      setChatError(message);
      setChatMessages(nextHistory);
    } finally {
      setChatLoading(false);
    }
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

      <View style={styles.aiCard}>
        <Text style={styles.sectionTitle}>AI Evaluation</Text>
        <PrimaryButton
          label={reviewLoading ? 'Generating review...' : review ? 'Regenerate Review' : 'Generate AI Review'}
          onPress={handleGenerateReview}
          disabled={reviewLoading}
        />
        {reviewError ? <Text style={styles.errorText}>{reviewError}</Text> : null}
        {review ? (
          <View style={styles.reviewContent}>
            <Text style={styles.reviewScore}>Score: {review.score}/10</Text>
            <Text style={styles.reviewSummary}>{review.summary}</Text>

            <Text style={styles.reviewHeader}>Strengths</Text>
            {review.strengths.map((item, index) => (
              <Text key={`strength-${index}`} style={styles.reviewItem}>
                - {item}
              </Text>
            ))}

            <Text style={styles.reviewHeader}>Weaknesses</Text>
            {review.weaknesses.map((item, index) => (
              <Text key={`weakness-${index}`} style={styles.reviewItem}>
                - {item}
              </Text>
            ))}

            <Text style={styles.reviewHeader}>Suggestions</Text>
            {review.suggestions.map((item, index) => (
              <Text key={`suggestion-${index}`} style={styles.reviewItem}>
                - {item}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.sectionTitle}>Chat with AI about this idea</Text>
        <Text style={styles.chatHint}>Ask about positioning, MVP scope, risks, pricing, or go-to-market.</Text>

        <View style={styles.chatList}>
          {chatMessages.length === 0 ? (
            <Text style={styles.emptyChatText}>No messages yet. Start the conversation below.</Text>
          ) : (
            chatMessages.map((message, index) => (
              <View
                key={`${message.role}-${index}`}
                style={[
                  styles.chatBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}>
                <Text style={styles.chatRole}>{message.role === 'user' ? 'You' : 'AI Mentor'}</Text>
                <Text style={styles.chatText}>{message.content}</Text>
              </View>
            ))
          )}
        </View>

        {chatError ? <Text style={styles.errorText}>{chatError}</Text> : null}

        <View style={styles.chatComposer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Ask AI about this idea..."
            value={chatInput}
            onChangeText={setChatInput}
            multiline
          />
          <Pressable
            onPress={handleSendChat}
            disabled={chatLoading || !chatInput.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              {
                opacity: chatLoading || !chatInput.trim() ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}>
            <Text style={styles.sendButtonLabel}>{chatLoading ? '...' : 'Send'}</Text>
          </Pressable>
        </View>
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
  aiCard: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  reviewContent: {
    gap: 6,
  },
  reviewScore: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  reviewSummary: {
    color: Theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  reviewHeader: {
    marginTop: 6,
    color: Theme.colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  reviewItem: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  chatHint: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  chatList: {
    gap: 8,
  },
  emptyChatText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
  },
  chatBubble: {
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  userBubble: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primaryMuted,
  },
  assistantBubble: {
    borderColor: Theme.colors.border,
    backgroundColor: '#F8FAFC',
  },
  chatRole: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  chatText: {
    fontSize: 14,
    color: Theme.colors.text,
    lineHeight: 20,
  },
  chatComposer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  sendButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: Theme.colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
});
