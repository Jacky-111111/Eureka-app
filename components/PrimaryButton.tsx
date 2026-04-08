import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

export const PrimaryButton = ({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}: Props) => {
  const backgroundColor =
    variant === 'primary'
      ? Theme.colors.primary
      : variant === 'danger'
        ? Theme.colors.danger
        : Theme.colors.surface;

  const textColor = variant === 'secondary' ? Theme.colors.text : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: Theme.colors.border,
        },
        style,
      ]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
