# Eureka App

AI-assisted idea management app built with Expo + React Native.

## Current Features

- Generate idea candidates from AI flow (`New Ideas`) with category, difficulty, and count filters.
- Swipe deck experience (`Save` / `Skip`) for generated ideas.
- Persist idea library locally (create, edit, archive, delete).
- Idea detail page with metadata and management actions.
- **New:** Idea detail AI assistant:
  - Generate structured AI review (score, strengths, weaknesses, suggestions).
  - Continue chatting with AI about the current idea (MVP, risks, positioning, pricing, GTM, etc.).

## Tech Stack

- Expo / React Native / TypeScript
- Expo Router (file-based routing)
- AsyncStorage (local persistence)
- OpenAI Responses API (idea detail AI review + chat)

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in project root (or update it) with:

   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   EXPO_PUBLIC_OPENAI_MODEL=gpt-4.1-mini
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

## AI Integration Notes

- `Idea Detail` AI features are implemented in:
  - `services/ideaAssistantService.ts`
  - `app/ideas/[id].tsx`
- Current implementation calls OpenAI directly from app env vars for local development.
- For production, move API key to your backend and proxy requests securely.

## Scripts

- `npm run start` - start Expo
- `npm run android` - run Android
- `npm run ios` - run iOS
- `npm run web` - run web
- `npm run lint` - run lint
