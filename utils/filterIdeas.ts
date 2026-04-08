import type { Idea, IdeaCategory } from '@/types/idea';

export const filterIdeasByCategory = (
  ideas: Idea[],
  category: IdeaCategory | 'All',
): Idea[] => {
  if (category === 'All') {
    return ideas;
  }

  return ideas.filter((idea) => idea.category === category);
};
