import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({ title, message, actionLabel, onAction }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onAction ? <PrimaryButton label={actionLabel} onPress={onAction} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  message: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
