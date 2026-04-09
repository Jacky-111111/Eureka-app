# Eureka App

This is an AI-assisted idea management iOS app built with Expo + React Native. I came up with this idea becasue I found it hard to come up with practical and creative ideas this time, and I realized it would be helpful to have AI provide inspiration, evaluation, and improvement throughout this process.

## Main Navigation tabs

- **Left tab: `My Ideas`**
  - Search saved ideas by title, tags, and tech stack.
  - Filter and sort stored ideas.
  - Switch between list view and grid view.
  - Open idea detail, edit/delete ideas, and use AI review/chat.
- **Right tab: `New Ideas`**
  - Set generation filters (category, difficulty, count, etc.).
  - Generate new ideas.
  - Swipe through generated cards and choose `Save` or `Skip`.
  - Saved ideas are stored locally and will appear in `My Ideas`.

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

   - `EXPO_PUBLIC_OPENAI_API_KEY` is required for local AI generation/review/chat.
   - If `EXPO_PUBLIC_OPENAI_MODEL` is not provided, the app defaults to `gpt-4.1-mini`.

3. Start the app:

   ```bash
   npx expo run:ios
   ```

## AI Integration Notes

- `Idea Detail` AI features are implemented in:
  - `services/ideaAssistantService.ts`
  - `app/ideas/[id].tsx`
- Current implementation calls OpenAI directly from app env vars for local development.
- For production, move API key to your backend and proxy requests securely.

## Things I learned about mobile developments that surprised me (for 15-113):

- I was surprised by how many exisitng packages are there for iOS developers, and most of them are quite useful.
- It was unexpected for me that camera functions and testing are poorly supported in the simulator, which pushed me to give up on an idea that relied on camera.
