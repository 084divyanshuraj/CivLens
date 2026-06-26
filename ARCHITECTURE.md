# Architecture Blueprint

## Overview
CivLens is a Next.js 15 application utilizing the App Router. The frontend uses TailwindCSS and shadcn/ui. The backend consists of Next.js Route Handlers interacting with Firebase (Auth, Firestore, Storage) and the Gemini API.

## Folder Structure
```text
src/
├── app/
│   ├── (auth)/         # Login flows
│   ├── admin/          # Municipality Dashboard
│   ├── report/         # Citizen reporting flow
│   ├── api/            # Route Handlers
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/             # shadcn components
│   ├── maps/           # Google Maps components
│   └── shared/         # Reusable app components
├── lib/
│   ├── firebase/       # Firebase config and utils
│   ├── gemini/         # Gemini API client and prompts
│   ├── agents/         # Logical agent data transformers
│   └── utils.ts
└── types/              # TypeScript interfaces
```

## Data Flow
1. **Upload Flow**: User uploads image -> Uploaded to Firebase Storage -> URL generated.
2. **AI Workflow**: Next.js API Route receives image URL & location -> Calls Gemini API with structured prompt -> Receives monolithic JSON response.
3. **Agent Distribution**: The backend parses the JSON and passes the respective data chunks to logical agent modules (Vision, Context, Priority, Recommendation).
4. **Database Write**: The enriched issue document is saved to Firestore.
5. **Dashboard Flow**: Admin dashboard listens to Firestore (real-time or fetched) to display issues on the map and feed.

## Module Responsibilities
- **Frontend**: UI rendering, state management, Maps integration.
- **API Routes**: Secure environment for Gemini API calls, Firebase Admin SDK operations.
- **Agent Modules (lib/agents)**: Pure functions that take the monolithic Gemini JSON and transform it into the required shapes for the database and UI.
