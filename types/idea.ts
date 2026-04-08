export type IdeaCategory =
  | 'Mobile App'
  | 'Website'
  | 'AI Tool'
  | 'Productivity Tool'
  | 'Education'
  | 'Social'
  | 'Other';

export type IdeaDifficulty = 'Easy' | 'Medium' | 'Hard';

export type IdeaStatus = 'New' | 'Exploring' | 'Building' | 'Archived';

export type IdeaSource = 'manual' | 'ai';

export type Idea = {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  techStack: string[];
  difficulty: IdeaDifficulty;
  status: IdeaStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  source?: IdeaSource;
};

export type IdeaGenerationRequest = {
  prompt?: string;
  category?: IdeaCategory | 'Any';
  difficulty?: IdeaDifficulty | 'Any';
  count?: number;
};

export type GeneratedIdeaResponse = {
  ideas: Idea[];
};

export type CreateIdeaInput = Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateIdeaInput = Partial<Omit<Idea, 'id' | 'createdAt'>>;

export type IdeaAiReview = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
};

export type IdeaAiChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
