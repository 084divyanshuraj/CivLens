# Implementation Tasks

## Phase 1: Foundation
- [ ] Task 1: Initialize Next.js 15 project with TypeScript and TailwindCSS.
- [ ] Task 2: Configure shadcn/ui and install base components (Button, Card, Input).
- [ ] Task 3: Set up Firebase project (Auth, Firestore, Storage) and initialize in `lib/firebase.ts`.

## Phase 2: AI Core
- [ ] Task 4: Get Gemini API key and set up `lib/gemini/client.ts`.
- [ ] Task 5: Implement `POST /api/issues/analyze` route with the monolithic JSON prompt.
- [ ] Task 6: Create the logical Agent transformers in `lib/agents/`.

## Phase 3: Citizen Flow
- [ ] Task 7: Build the Image Upload component (integrating Firebase Storage).
- [ ] Task 8: Build the Google Maps location picker component.
- [ ] Task 9: Connect the Upload flow to the `/api/issues/analyze` endpoint.
- [ ] Task 10: Build the "AI Processing" loading animation sequence.

## Phase 4: Admin Dashboard
- [ ] Task 11: Create the Admin Layout and KPI Cards.
- [ ] Task 12: Integrate Google Maps for the admin heatmap/pin view.
- [ ] Task 13: Build the Priority Queue list fetching from Firestore.
- [ ] Task 14: Build the Issue Detail Modal displaying the AI recommendations.

## Phase 5: Polish & Deploy
- [ ] Task 15: Implement Community Validation (Upvote button on public feed).
- [ ] Task 16: Final UI polish, glassmorphism effects, and responsive checks.
- [ ] Task 17: Deploy to Vercel and test the live environment.
