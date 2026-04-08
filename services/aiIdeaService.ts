import { API_BASE_URL, GENERATE_IDEAS_ENDPOINT } from '@/config/env';
import { mockIdeaGenerator } from '@/services/mockIdeaGenerator';
import type { GeneratedIdeaResponse, IdeaGenerationRequest } from '@/types/idea';

const USE_MOCK_GENERATOR = true;

export const aiIdeaService = {
  async generateIdeas(request: IdeaGenerationRequest): Promise<GeneratedIdeaResponse> {
    if (USE_MOCK_GENERATOR) {
      return mockIdeaGenerator.generateIdeas(request);
    }

    // TODO: connect this call to your backend endpoint.
    // OpenAI API key must be stored server-side, never in this Expo app.
    const response = await fetch(`${API_BASE_URL}${GENERATE_IDEAS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate ideas from backend');
    }

    return (await response.json()) as GeneratedIdeaResponse;
  },
};
