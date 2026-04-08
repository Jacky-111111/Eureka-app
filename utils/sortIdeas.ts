import type { Idea } from '@/types/idea';

export type IdeaSortOption = 'recent' | 'difficulty';

const DIFFICULTY_WEIGHT: Record<Idea['difficulty'], number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export const sortIdeas = (ideas: Idea[], sort: IdeaSortOption): Idea[] => {
  const next = [...ideas];

  if (sort === 'difficulty') {
    return next.sort((a, b) => DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty]);
  }

  return next.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
