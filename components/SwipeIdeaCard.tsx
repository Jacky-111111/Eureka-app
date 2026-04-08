import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Theme } from '@/constants/theme';
import type { Idea } from '@/types/idea';
import { TagChip } from './TagChip';

type Props = {
  idea: Idea;
  dimmed?: boolean;
};

const CATEGORY_GRADIENTS: Record<Idea['category'], [string, string, string]> = {
  'AI Tool': ['#0B1F5E', '#1D4ED8', '#0EA5E9'],
  Education: ['#0A3B8E', '#2563EB', '#22D3EE'],
  'Mobile App': ['#0F2A6B', '#1E40AF', '#38BDF8'],
  Other: ['#1E293B', '#334155', '#475569'],
  'Productivity Tool': ['#0B3A75', '#0369A1', '#06B6D4'],
  Social: ['#1E3A8A', '#2563EB', '#14B8A6'],
  Website: ['#0C4A6E', '#0369A1', '#0EA5E9'],
};

export const SwipeIdeaCard = ({ idea, dimmed = false }: Props) => (
  <View style={[styles.cardWrap, dimmed && styles.cardDimmed]}>
    <LinearGradient
      colors={CATEGORY_GRADIENTS[idea.category]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    />
    <View style={styles.glossLayer} />

    <View style={styles.card}>
      <View style={styles.top}>
        <TagChip text={idea.category} />
        <TagChip text={idea.difficulty} />
      </View>

      <Text style={styles.title}>{idea.title}</Text>
      <Text style={styles.description}>{idea.description}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        {idea.techStack.slice(0, 3).map((tech) => (
          <TagChip key={tech} text={tech} />
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.38)',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  glossLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  card: {
    margin: 1,
    borderRadius: Theme.radius.lg - 1,
    backgroundColor: 'rgba(255,255,255,0.87)',
    padding: Theme.spacing.lg,
    minHeight: 340,
    gap: 14,
  },
  cardDimmed: {
    opacity: 0.62,
  },
  top: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
