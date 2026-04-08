import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CreateIdeaInput, Idea, UpdateIdeaInput } from '@/types/idea';

const IDEAS_STORAGE_KEY = '@eureka/ideas';

const generateIdeaId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const parseIdeas = (value: string | null): Idea[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Idea[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistIdeas = async (ideas: Idea[]) => {
  await AsyncStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
};

export const ideaStorageService = {
  async getIdeas(): Promise<Idea[]> {
    const raw = await AsyncStorage.getItem(IDEAS_STORAGE_KEY);
    return parseIdeas(raw);
  },

  async getIdeaById(id: string): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    return ideas.find((idea) => idea.id === id) ?? null;
  },

  async createIdea(input: CreateIdeaInput): Promise<Idea> {
    const ideas = await this.getIdeas();
    const now = new Date().toISOString();
    const next: Idea = {
      id: generateIdeaId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    await persistIdeas([next, ...ideas]);
    return next;
  },

  async updateIdea(id: string, input: UpdateIdeaInput): Promise<Idea | null> {
    const ideas = await this.getIdeas();
    let updated: Idea | null = null;

    const next = ideas.map((idea) => {
      if (idea.id !== id) {
        return idea;
      }

      updated = {
        ...idea,
        ...input,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });

    await persistIdeas(next);
    return updated;
  },

  async archiveIdea(id: string): Promise<Idea | null> {
    return this.updateIdea(id, { status: 'Archived' });
  },

  async deleteIdea(id: string): Promise<void> {
    const ideas = await this.getIdeas();
    const next = ideas.filter((idea) => idea.id !== id);
    await persistIdeas(next);
  },
};
