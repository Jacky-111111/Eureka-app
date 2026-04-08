import { OPENAI_API_KEY, OPENAI_MODEL } from '@/config/env';
import type { Idea, IdeaAiChatMessage, IdeaAiReview } from '@/types/idea';

type OpenAIInputMessage = {
  role: 'system' | 'user' | 'assistant';
  content: Array<{ type: 'input_text'; text: string }>;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const MAX_CHAT_HISTORY = 8;

const createIdeaContext = (idea: Idea) =>
  `Idea title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Difficulty: ${idea.difficulty}
Status: ${idea.status}
Tech stack: ${idea.techStack.join(', ') || 'N/A'}
Tags: ${idea.tags?.join(', ') || 'N/A'}`;

const ensureApiKey = () => {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY. Please add it in your local .env file.');
  }
};

const extractResponseText = (data: OpenAIResponse): string => {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const fallbackText =
    data.output
      ?.flatMap((item) => item.content ?? [])
      .filter((content) => content.type === 'output_text' || content.type === 'text')
      .map((content) => content.text ?? '')
      .join('\n')
      .trim() ?? '';

  if (fallbackText) {
    return fallbackText;
  }

  return '';
};

const requestOpenAI = async (messages: OpenAIInputMessage[]): Promise<string> => {
  ensureApiKey();

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const text = extractResponseText(data);
  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }

  return text;
};

const parseReviewJson = (raw: string): IdeaAiReview => {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? jsonMatch[0] : raw;
  const parsed = JSON.parse(jsonText) as Partial<IdeaAiReview>;

  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
  const strengths = Array.isArray(parsed.strengths)
    ? parsed.strengths.filter((item): item is string => typeof item === 'string').map((item) => item.trim())
    : [];
  const weaknesses = Array.isArray(parsed.weaknesses)
    ? parsed.weaknesses
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
    : [];
  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
    : [];
  const score = typeof parsed.score === 'number' ? Math.min(Math.max(parsed.score, 1), 10) : 6;

  if (!summary || strengths.length === 0 || weaknesses.length === 0 || suggestions.length === 0) {
    throw new Error('AI review format was invalid. Please try again.');
  }

  return {
    summary,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
    score,
  };
};

export const ideaAssistantService = {
  async generateReview(idea: Idea): Promise<IdeaAiReview> {
    const systemPrompt =
      'You are a product mentor. You evaluate startup/app ideas with practical, concise feedback.';
    const userPrompt = `Evaluate this idea and return JSON only.

Return exactly this shape:
{
  "summary": "1-2 sentence summary",
  "score": 1-10 number,
  "strengths": ["point 1", "point 2", "point 3"],
  "weaknesses": ["point 1", "point 2", "point 3"],
  "suggestions": ["next step 1", "next step 2", "next step 3"]
}

Use clear, specific points. No markdown. No extra keys.

${createIdeaContext(idea)}`;

    const result = await requestOpenAI([
      {
        role: 'system',
        content: [{ type: 'input_text', text: systemPrompt }],
      },
      {
        role: 'user',
        content: [{ type: 'input_text', text: userPrompt }],
      },
    ]);

    return parseReviewJson(result);
  },

  async chatAboutIdea(params: {
    idea: Idea;
    message: string;
    history: IdeaAiChatMessage[];
  }): Promise<string> {
    const { idea, message, history } = params;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      throw new Error('Message cannot be empty.');
    }

    const systemPrompt = `You are an expert product mentor.
Answer in concise, actionable language and stay focused on this idea:

${createIdeaContext(idea)}`;

    const recentHistory = history.slice(-MAX_CHAT_HISTORY);
    const historyMessages: OpenAIInputMessage[] = recentHistory.map((item) => ({
      role: item.role,
      content: [{ type: 'input_text', text: item.content }],
    }));

    const result = await requestOpenAI([
      {
        role: 'system',
        content: [{ type: 'input_text', text: systemPrompt }],
      },
      ...historyMessages,
      {
        role: 'user',
        content: [{ type: 'input_text', text: trimmedMessage }],
      },
    ]);

    return result;
  },
};
