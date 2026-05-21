# Mise en Place 🍳

An AI-powered cooking companion that imports recipes from any URL, scales servings with fraction math, and suggests ingredient substitutions based on what's in your fridge.

## Features

- **AI Recipe Importer** — paste any recipe URL and AI extracts ingredients and steps automatically
- **Smart Scaling** — adjust servings and all quantities recalculate with proper fractions (1 1/2 cups not 1.5)
- **Ingredient Substitution** — tell the app what's in your fridge, AI suggests real cooking substitutions
- **Recipe Management** — full CRUD for recipes, ingredients, and steps
- **Auth** — email and Google OAuth login

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React + Vite                   |
| Database   | Supabase (PostgreSQL)          |
| Auth       | Supabase Auth + Google OAuth   |
| AI         | Groq API (Llama 3)             |
| Serverless | Supabase Edge Functions (Deno) |
| Testing    | Vitest + React Testing Library |

## Screenshots

screenshots/Add Recipe Page.png
screenshots/Dashboard Page.png
screenshots/Import any Recipe From URL.png
screenshots/Individual Recipe Steps.png
screenshots/Individual Recipe.png
screenshots/Login Page.png
screenshots/Substitution Functionality.png

## Video Demo

Demo/Demo Mise-En-Place.mp4

## Architecture

Browser
↓ fetches recipe URL via allorigins proxy
↓ sends clean text to Supabase Edge Function
Edge Function
↓ calls Groq Llama 3
↓ returns structured JSON
Browser
↓ saves recipe + ingredients + steps to Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free)
- Groq API key (free)

### Setup

1. Clone the repo

```bash
git clone https://github.com/Kunald199/mise-en-place.git
cd mise-en-place
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key

4. Set up Supabase

- Create a new Supabase project
- Run the SQL migrations in `GUIDE.md`
- Deploy Edge Functions:

```bash
supabase link --project-ref your-project-ref
supabase secrets set GROQ_API_KEY=your_groq_key
supabase functions deploy import-recipe
supabase functions deploy get-substitutions
```

5. Start the dev server

```bash
npm run dev
```

## Running Tests

```bash
npm run test:run
```

## Project Structure

src/
├── components/ reusable UI components
├── pages/ full page components
├── hooks/ custom React hooks (useRecipes, useRecipe, useFridge)
├── lib/ utilities (supabase client, scaler, storage)
├── context/ React context (AuthContext)
└── test/ unit and component tests
supabase/
└── functions/
├── import-recipe/ AI recipe extraction
└── get-substitutions/ AI ingredient substitution

## Key Technical Decisions

**Why fetch from browser not Edge Function?**
Supabase free tier restricts outbound network requests from Edge Functions. Fetching via `allorigins.win` proxy from the browser and passing clean text to the Edge Function solves this cleanly.

**Why Groq over OpenAI?**
Groq is completely free with generous rate limits. `llama-3.1-8b-instant` is fast and accurate enough for structured recipe extraction.

**Why fraction math for scaling?**
`1 1/2 cups` is more useful to a cook than `1.5 cups`. The GCD algorithm converts decimals to simplified fractions — the same algorithm used in every recipe scaling app.

## What I Learned

- Full-stack React architecture with custom hooks and context
- PostgreSQL schema design with Row Level Security
- OAuth 2.0 with Supabase Auth + Google
- Serverless functions with Deno (Supabase Edge Functions)
- Prompt engineering for structured JSON output
- Unit testing with Vitest and React Testing Library
- CI/CD with GitHub Actions

## Follow the Build

See `GUIDE.md` for a complete step-by-step guide to replicate this project from scratch.
