import type { GeneratedIdeaResponse, Idea, IdeaGenerationRequest } from '@/types/idea';

const MOCK_IDEAS: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'AI study planner for high school students',
    description:
      'Builds weekly study plans around exams and assignments, then adapts with progress check-ins.',
    category: 'Education',
    techStack: ['React Native', 'Supabase', 'OpenAI'],
    difficulty: 'Medium',
    status: 'New',
    tags: ['students', 'planning', 'ai'],
    source: 'ai',
  },
  {
    title: 'Travel menu translator with food image previews',
    description:
      'Scans menu text and translates dishes with likely ingredient callouts and visual references.',
    category: 'Mobile App',
    techStack: ['Expo Camera', 'Vision API', 'TypeScript'],
    difficulty: 'Hard',
    status: 'New',
    tags: ['travel', 'translation'],
    source: 'ai',
  },
  {
    title: 'Focus app rewarding face-down phone placement',
    description:
      'Uses phone sensors to detect focus sessions and rewards streaks with points and unlockables.',
    category: 'Productivity Tool',
    techStack: ['Expo Sensors', 'SQLite', 'React Native'],
    difficulty: 'Medium',
    status: 'New',
    tags: ['focus', 'habit'],
    source: 'ai',
  },
  {
    title: 'Habit tracker with RPG progression',
    description:
      'Turns daily habits into quests, with character progression and social accountability features.',
    category: 'Social',
    techStack: ['React Native', 'Firebase', 'Node.js'],
    difficulty: 'Easy',
    status: 'New',
    tags: ['gamification', 'habit'],
    source: 'ai',
  },
  {
    title: 'Developer portfolio analyzer',
    description:
      'Analyzes GitHub repos and portfolio pages, then suggests project gaps and resume-ready highlights.',
    category: 'AI Tool',
    techStack: ['Next.js', 'Python', 'OpenAI'],
    difficulty: 'Hard',
    status: 'New',
    tags: ['developer-tools', 'portfolio'],
    source: 'ai',
  },
  {
    title: 'Voice meeting notes to task board',
    description:
      'Converts meeting recordings into structured action items and auto-groups tasks by owner.',
    category: 'Productivity Tool',
    techStack: ['React Native', 'Whisper', 'Supabase'],
    difficulty: 'Medium',
    status: 'New',
    tags: ['meetings', 'tasks'],
    source: 'ai',
  },
  {
    title: 'Campus event social map',
    description:
      'Shows student events on a live map, with check-ins and interest-based recommendations.',
    category: 'Social',
    techStack: ['Expo Maps', 'Firebase', 'TypeScript'],
    difficulty: 'Easy',
    status: 'New',
    tags: ['students', 'events'],
    source: 'ai',
  },
  {
    title: 'AI landing page copy improver',
    description:
      'Analyzes product positioning and rewrites hero/CTA copy with tone and audience presets.',
    category: 'AI Tool',
    techStack: ['Next.js', 'OpenAI', 'Node.js'],
    difficulty: 'Easy',
    status: 'New',
    tags: ['marketing', 'copywriting'],
    source: 'ai',
  },
  {
    title: 'Parent-child reading streak app',
    description:
      'Tracks shared reading sessions with fun badges and weekly progress for families.',
    category: 'Education',
    techStack: ['React Native', 'SQLite', 'Notifications'],
    difficulty: 'Medium',
    status: 'New',
    tags: ['family', 'reading'],
    source: 'ai',
  },
  {
    title: 'Restaurant prep planner dashboard',
    description:
      'Helps small restaurants forecast prep needs from upcoming reservations and order history.',
    category: 'Website',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    difficulty: 'Hard',
    status: 'New',
    tags: ['restaurant', 'operations'],
    source: 'ai',
  },
];

const enrichIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>): Idea => {
  const now = new Date().toISOString();
  return {
    ...idea,
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
};

const normalize = (value: string) => value.toLowerCase();

const matchesTechStackPreference = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>, preference: string) => {
  const tech = idea.techStack.map(normalize).join(' ');

  switch (preference) {
    case 'Mobile':
      return tech.includes('react native') || tech.includes('expo');
    case 'Web':
      return tech.includes('react') || tech.includes('next.js') || tech.includes('node.js');
    case 'Python':
      return tech.includes('python');
    case 'JavaScript/TypeScript':
      return tech.includes('javascript') || tech.includes('typescript') || tech.includes('node.js');
    case 'Firebase':
      return tech.includes('firebase');
    case 'AI/API':
      return (
        tech.includes('openai') ||
        tech.includes('vision api') ||
        tech.includes('whisper') ||
        tech.includes('api')
      );
    default:
      return true;
  }
};

const matchesSocialTheme = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>, theme: string) => {
  const searchableText = `${idea.title} ${idea.description} ${(idea.tags ?? []).join(' ')}`.toLowerCase();

  switch (theme) {
    case 'Students':
      return searchableText.includes('student') || searchableText.includes('campus') || searchableText.includes('school');
    case 'Health':
      return searchableText.includes('health') || searchableText.includes('habit') || searchableText.includes('focus');
    case 'Family':
      return searchableText.includes('family') || searchableText.includes('parent') || searchableText.includes('child');
    case 'Community':
      return searchableText.includes('community') || searchableText.includes('social') || searchableText.includes('events');
    case 'Travel':
      return searchableText.includes('travel') || searchableText.includes('menu') || searchableText.includes('translator');
    case 'Sustainability':
      return searchableText.includes('sustain') || searchableText.includes('climate') || searchableText.includes('carbon');
    default:
      return true;
  }
};

export const mockIdeaGenerator = {
  async generateIdeas(request: IdeaGenerationRequest): Promise<GeneratedIdeaResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let pool = [...MOCK_IDEAS];

    if (request.category && request.category !== 'Any') {
      pool = pool.filter((idea) => idea.category === request.category);
    }

    if (request.difficulty && request.difficulty !== 'Any') {
      pool = pool.filter((idea) => idea.difficulty === request.difficulty);
    }

    if (request.techStack && request.techStack !== 'Any') {
      pool = pool.filter((idea) => matchesTechStackPreference(idea, request.techStack as string));
    }

    if (request.socialTheme && request.socialTheme !== 'Any') {
      pool = pool.filter((idea) => matchesSocialTheme(idea, request.socialTheme as string));
    }

    if (pool.length === 0) {
      pool = [...MOCK_IDEAS];
    }

    const desiredCount = Math.min(Math.max(request.count ?? 5, 1), 10);
    const ideas = Array.from({ length: desiredCount }, (_, index) =>
      enrichIdea(pool[index % pool.length]),
    );
    return { ideas };
  },
};
