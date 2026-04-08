// Mobile app -> backend -> OpenAI API.
// Never place real OpenAI API keys in the Expo app.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// TODO: connect backend and securely store OpenAI API key server-side.
export const GENERATE_IDEAS_ENDPOINT = '/generate-ideas';
