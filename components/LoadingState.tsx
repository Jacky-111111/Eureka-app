import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';

type Props = {
  message?: string;
};

export const LoadingState = ({ message = 'Loading...' }: Props) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={Theme.colors.primary} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  message: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
  },
});
