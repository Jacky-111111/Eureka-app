import { OPENAI_API_KEY, OPENAI_MODEL } from '@/config/env';
import { mockIdeaGenerator } from '@/services/mockIdeaGenerator';
import type { GeneratedIdeaResponse, Idea, IdeaCategory, IdeaGenerationRequest } from '@/types/idea';

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type RawGeneratedIdea = {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  difficulty?: unknown;
  techStack?: unknown;
  tags?: unknown;
};

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const IDEA_CATEGORIES: IdeaCategory[] = [
  'Mobile App',
  'Website',
  'AI Tool',
  'Productivity Tool',
  'Education',
  'Social',
  'Other',
];

const normalizeList = (values?: string[]) =>
  values && values.length > 0 ? values.filter((value) => value !== 'Any') : [];

const extractResponseText = (data: OpenAIResponse): string => {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .filter((content) => content.type === 'output_text' || content.type === 'text')
      .map((content) => content.text ?? '')
      .join('\n')
      .trim() ?? ''
  );
};

const parseJsonIdeas = (raw: string): RawGeneratedIdea[] => {
  const match = raw.match(/\[[\s\S]*\]/);
  const jsonText = match ? match[0] : raw;
  const parsed = JSON.parse(jsonText) as unknown;
  return Array.isArray(parsed) ? (parsed as RawGeneratedIdea[]) : [];
};

const pickCategory = (value: unknown): IdeaCategory => {
  if (typeof value !== 'string') {
    return 'Other';
  }

  const category = IDEA_CATEGORIES.find((item) => item === value);
  return category ?? 'Other';
};

const pickDifficulty = (value: unknown): Idea['difficulty'] => {
  if (value === 'Easy' || value === 'Medium' || value === 'Hard') {
    return value;
  }
  return 'Medium';
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
};

const toIdea = (rawIdea: RawGeneratedIdea): Idea | null => {
  const title = typeof rawIdea.title === 'string' ? rawIdea.title.trim() : '';
  const description = typeof rawIdea.description === 'string' ? rawIdea.description.trim() : '';
  if (!title || !description) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    category: pickCategory(rawIdea.category),
    difficulty: pickDifficulty(rawIdea.difficulty),
    techStack: toStringArray(rawIdea.techStack),
    tags: toStringArray(rawIdea.tags),
    status: 'New',
    source: 'ai',
    createdAt: now,
    updatedAt: now,
  };
};

const buildPrompt = (request: IdeaGenerationRequest, desiredCount: number): string => {
  const categoryPreferences = normalizeList(request.categories);
  const techStackPreferences = normalizeList(request.techStacks);
  const socialThemePreferences = normalizeList(request.socialThemes);

  return `Generate ${desiredCount} startup/app idea candidates as JSON array only.

User selections:
- Prompt: ${request.prompt?.trim() || 'N/A'}
- Categories: ${categoryPreferences.join(', ') || 'Any'}
- Difficulty: ${request.difficulty || 'Any'}
- Tech stack preferences: ${techStackPreferences.join(', ') || 'Any'}
- Social themes: ${socialThemePreferences.join(', ') || 'Any'}

Rules:
1) Every idea must align with the user selections above.
2) Keep ideas concrete and different from each other.
3) Category must be one of: Mobile App, Website, AI Tool, Productivity Tool, Education, Social, Other.
4) Difficulty must be one of: Easy, Medium, Hard.
5) techStack and tags must be arrays of short strings.
6) Return JSON array only, no markdown, no explanation.

Required item shape:
{
  "title": "string",
  "description": "string",
  "category": "Mobile App | Website | AI Tool | Productivity Tool | Education | Social | Other",
  "difficulty": "Easy | Medium | Hard",
  "techStack": ["string", "string"],
  "tags": ["string", "string"]
}`;
};

const generateIdeasFromOpenAI = async (request: IdeaGenerationRequest): Promise<GeneratedIdeaResponse> => {
  const desiredCount = Math.min(Math.max(request.count ?? 5, 1), 10);
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: 'You are a product ideation assistant.' }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: buildPrompt(request, desiredCount) }],
        },
      ],
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to generate ideas from OpenAI (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const text = extractResponseText(data);
  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }

  const parsedIdeas = parseJsonIdeas(text)
    .map(toIdea)
    .filter((idea): idea is Idea => idea !== null)
    .slice(0, desiredCount);

  if (parsedIdeas.length === 0) {
    throw new Error('OpenAI returned invalid idea format.');
  }

  if (parsedIdeas.length < desiredCount) {
    const mockResponse = await mockIdeaGenerator.generateIdeas({ ...request, count: desiredCount - parsedIdeas.length });
    return { ideas: [...parsedIdeas, ...mockResponse.ideas] };
  }

  return { ideas: parsedIdeas };
};

export const aiIdeaService = {
  async generateIdeas(request: IdeaGenerationRequest): Promise<GeneratedIdeaResponse> {
    if (!OPENAI_API_KEY) {
      return mockIdeaGenerator.generateIdeas(request);
    }

    return generateIdeasFromOpenAI(request);
  },
};
