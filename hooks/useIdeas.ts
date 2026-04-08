import { useCallback, useEffect, useMemo, useState } from 'react';

import { ideaStorageService } from '@/services/ideaStorageService';
import type { CreateIdeaInput, Idea, UpdateIdeaInput } from '@/types/idea';
import { filterIdeasByCategory } from '@/utils/filterIdeas';
import { sortIdeas, type IdeaSortOption } from '@/utils/sortIdeas';

type CategoryFilter = Idea['category'] | 'All';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [sortOption, setSortOption] = useState<IdeaSortOption>('recent');

  const loadIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ideaStorageService.getIdeas();
      setIdeas(data);
      setError(null);
    } catch (loadError) {
      setError('Failed to load ideas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIdeas();
  }, [loadIdeas]);

  const createIdea = useCallback(async (payload: CreateIdeaInput) => {
    const idea = await ideaStorageService.createIdea(payload);
    setIdeas((previous) => [idea, ...previous]);
    return idea;
  }, []);

  const updateIdea = useCallback(async (id: string, payload: UpdateIdeaInput) => {
    const updated = await ideaStorageService.updateIdea(id, payload);
    if (!updated) {
      return null;
    }

    setIdeas((previous) => previous.map((idea) => (idea.id === id ? updated : idea)));
    return updated;
  }, []);

  const archiveIdea = useCallback(async (id: string) => {
    const archived = await ideaStorageService.archiveIdea(id);
    if (!archived) {
      return null;
    }

    setIdeas((previous) => previous.map((idea) => (idea.id === id ? archived : idea)));
    return archived;
  }, []);

  const deleteIdea = useCallback(async (id: string) => {
    await ideaStorageService.deleteIdea(id);
    setIdeas((previous) => previous.filter((idea) => idea.id !== id));
  }, []);

  const displayedIdeas = useMemo(() => {
    const filtered = filterIdeasByCategory(ideas, categoryFilter);
    return sortIdeas(filtered, sortOption);
  }, [ideas, categoryFilter, sortOption]);

  return {
    ideas,
    displayedIdeas,
    loading,
    error,
    categoryFilter,
    sortOption,
    setCategoryFilter,
    setSortOption,
    refresh: loadIdeas,
    createIdea,
    updateIdea,
    archiveIdea,
    deleteIdea,
  };
};
