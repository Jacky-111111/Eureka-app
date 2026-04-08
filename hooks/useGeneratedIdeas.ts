import { useCallback, useState } from 'react';

import { aiIdeaService } from '@/services/aiIdeaService';
import type { Idea, IdeaGenerationRequest } from '@/types/idea';

let generatedIdeasSession: Idea[] = [];

export const useGeneratedIdeas = () => {
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>(generatedIdeasSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdeas = useCallback(async (request: IdeaGenerationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiIdeaService.generateIdeas(request);
      generatedIdeasSession = response.ideas;
      setGeneratedIdeas(response.ideas);
      return response.ideas;
    } catch {
      setError('Failed to generate ideas.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    generatedIdeasSession = [];
    setGeneratedIdeas([]);
  }, []);

  return {
    generatedIdeas,
    loading,
    error,
    generateIdeas,
    clearSession,
  };
};
