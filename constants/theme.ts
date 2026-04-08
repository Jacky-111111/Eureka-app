export const Theme = {
  colors: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    primary: '#3B82F6',
    primaryMuted: '#DBEAFE',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    chipBg: '#EEF2FF',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
  },
};

// Backward-compatible tokens for default Expo starter components.
export const Colors = {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: Theme.colors.primary,
    icon: Theme.colors.textSecondary,
    tabIconDefault: Theme.colors.textSecondary,
    tabIconSelected: Theme.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};
