import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';

type Props = {
  text: string;
};

export const TagChip = ({ text }: Props) => (
  <View style={styles.chip}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Theme.colors.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: Theme.colors.text,
    fontWeight: '600',
    fontSize: 12,
  },
});
