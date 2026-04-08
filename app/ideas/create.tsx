import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text } from 'react-native';

import { IdeaForm } from '@/components/IdeaForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Theme } from '@/constants/theme';
import { useIdeas } from '@/hooks/useIdeas';
import type { CreateIdeaInput } from '@/types/idea';

export default function CreateIdeaScreen() {
  const router = useRouter();
  const { createIdea } = useIdeas();

  const handleSubmit = async (value: CreateIdeaInput) => {
    await createIdea(value);
    Alert.alert('Saved', 'Your idea was added.');
    router.replace('/ideas');
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Capture a new idea</Text>
      <IdeaForm submitLabel="Save Idea" onSubmit={handleSubmit} />
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
