import type {
  IdeaGenerationCategoryPreference,
  IdeaSocialThemePreference,
  IdeaTechStackPreference,
} from '@/types/idea';

export const IDEA_GENERATION_CATEGORY_PREFERENCES: IdeaGenerationCategoryPreference[] = [
  'Any',
  'Mobile App',
  'Website',
  'AI Tool',
  'Productivity Tool',
  'Education',
  'Social',
  'FinTech',
  'Healthcare',
  'E-commerce',
  'Creator Economy',
  'SaaS',
  'Marketplace',
  'Gaming',
  'Climate',
];

export const IDEA_TECH_STACK_PREFERENCES: IdeaTechStackPreference[] = [
  'Any',
  'Mobile',
  'Web',
  'Python',
  'JavaScript/TypeScript',
  'Firebase',
  'AI/API',
  'Node.js',
  'SQL/Database',
  'Cloud',
  'No-code',
  'Data/ML',
];

export const IDEA_SOCIAL_THEME_PREFERENCES: IdeaSocialThemePreference[] = [
  'Any',
  'Students',
  'Health',
  'Family',
  'Community',
  'Travel',
  'Sustainability',
  'Accessibility',
  'Mental Health',
  'Local Business',
  'Remote Work',
  'Elderly Care',
];
