# Mise en Place — Complete Build Guide

A step-by-step guide to replicate this project from scratch on Windows.
Built as a learning resource for anyone wanting real full-stack SDE experience.

## What you'll build

An AI-powered cooking companion that imports recipes from any URL,
scales servings, suggests ingredient substitutions, and guides you
through cooking step by step.

## Tech stack

- React + Vite (frontend)
- Supabase (database + auth)
- Groq API with Llama 3 (AI — free)
- Vercel (deployment — optional)

## Prerequisites

- Windows PC
- A GitHub account
- A Groq account (free) → https://console.groq.com

---

## Phase 1 — Environment Setup

### Install Windows Terminal

1. Open Microsoft Store
2. Search "Windows Terminal" and install

### Install Git

1. Download from https://git-scm.com/download/win
2. During install: select VS Code as default editor,
   "Git from command line and 3rd-party software" for PATH

### Install Node.js

1. Download LTS from https://nodejs.org
2. Verify: `node --version` and `npm --version`

### Install VS Code

1. Download from https://code.visualstudio.com
2. During install: check "Add to PATH"
3. Install extensions: ESLint, Prettier, Tailwind CSS IntelliSense, GitLens

### Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global init.defaultBranch main
```

### Connect to GitHub via SSH

```bash
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub
# Copy output → GitHub Settings → SSH Keys → New SSH Key
ssh -T git@github.com  # verify it works
```

### Create the project

```bash
cd ~
mkdir projects && cd projects
npm create vite@latest mise-en-place -- --template react
cd mise-en-place
npm install
npm install --save-dev prettier eslint-config-prettier
code .
```

### Environment variables

Create `.env` in project root:
VITE_GROQ_API_KEY=your_groq_api_key_here

### Folder structure

```bash
mkdir src/components src/pages src/hooks src/lib src/context src/assets
```

---

## Phase 2 — Database Design + Supabase

### Create Supabase project

1. Go to https://supabase.com, sign up with GitHub
2. Create new project, save your database password

### Install Supabase client

```bash
npm install @supabase/supabase-js
```

### Add to .env

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Create src/lib/supabase.js

```javascript
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Run SQL migrations in Supabase SQL Editor

- Create tables: recipes, ingredients, steps, fridge_items
- Enable RLS on all tables
- Add security policies per table
- Add updated_at trigger on recipes

### Concepts learned

- SQL schema design + foreign keys
- UUID primary keys
- Row Level Security (RLS)
- Database triggers
- Environment variables for credentials

---

## Phase 3 — Authentication

### Install React Router

```bash
npm install react-router-dom
```

### Files created

- `src/context/AuthContext.jsx` — global auth state, login/logout functions
- `src/components/ProtectedRoute.jsx` — redirects logged out users
- `src/pages/LandingPage.jsx` — public home page
- `src/pages/LoginPage.jsx` — email + Google login
- `src/pages/SignupPage.jsx` — new account creation
- `src/pages/DashboardPage.jsx` — protected main app page

### Supabase settings

- Authentication → Email → disable "Confirm email" for local dev
- Authentication → Providers → enable Google (requires Google Cloud Console OAuth credentials)

### Common errors

- `Cannot find module ProtectedRoute` — check filename matches exactly, React is case sensitive

### Concepts learned

- React Context for global state
- Custom hooks (useAuth)
- Protected routes with redirects
- JWT session handling
- OAuth 2.0 flow with Google
- Loading states to prevent auth flicker
- Form error handling

---

## Phase 4 — Core CRUD + React Architecture

### Files created

- `src/hooks/useRecipes.js` — fetch, create, update, delete recipes
- `src/hooks/useRecipe.js` — single recipe with ingredients + steps
- `src/components/RecipeCard.jsx` — recipe card with delete
- `src/components/AddRecipeModal.jsx` — modal form to add recipe
- `src/pages/RecipePage.jsx` — recipe detail page

### New route added

- `/recipe/:id` — dynamic route using URL params

### Common errors

- `Cannot find module` — always check filename spelling, React imports are case sensitive
- Rename files with `mv oldname.js newname.js` in Git Bash

### Concepts learned

- Custom hooks for database logic
- useCallback to prevent infinite loops
- Promise.all for parallel requests
- Optimistic UI updates
- URL parameters with useParams
- Event bubbling and stopPropagation
- Loading, error, and empty states

---

## Phase 5 — AI Recipe Importer

### Install and setup Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase secrets set GROQ_API_KEY=your_groq_key
```

### Create and deploy Edge Function

```bash
supabase functions new import-recipe
supabase functions deploy import-recipe
```

### Architecture

- Frontend fetches URL HTML via allorigins.win proxy (bypasses CORS)
- Cleans HTML — strips scripts, styles, tags
- Sends clean text to Supabase Edge Function
- Edge Function calls Groq API and returns structured JSON
- Frontend saves recipe + ingredients + steps to Supabase

### Files created

- `supabase/functions/import-recipe/index.ts` — serverless function, calls Groq
- `src/lib/groq.js` — fetches URL, cleans HTML, calls edge function
- `src/lib/recipeImporter.js` — saves full recipe with ingredients + steps
- `src/components/ImportRecipeModal.jsx` — UI for URL import

### Common errors

- `Could not fetch that URL` — Supabase free tier blocks outbound requests, solution is to fetch from frontend instead
- Deploy error with backticks — avoid template literals in Edge Functions, use string concatenation
- Docker warning on deploy — harmless, Docker only needed for local testing

### Concepts learned

- CORS and why browsers block cross-origin requests
- Supabase Edge Functions (serverless backend)
- Deno runtime vs Node.js
- Why we fetch from frontend not server (free tier network restrictions)
- Sequential DB inserts for dependency chains
- Structured JSON prompting
- Server-side secrets with Deno.env.get()

---

## Phase 6 — Smart Scaling + Substitution

### Files created

- `src/lib/scaler.js` — GCD algorithm, decimal to fraction, ingredient scaling
- `src/lib/substitution.js` — builds prompt, calls edge function
- `src/hooks/useFridge.js` — fridge items CRUD
- `supabase/functions/get-substitutions/index.ts` — Groq AI substitution function

### Deploy new edge function

```bash
supabase functions new get-substitutions
supabase functions deploy get-substitutions
```

### Concepts learned

- GCD algorithm for fraction simplification
- Floating point precision handling
- Pure utility functions
- Derived state computed from servings
- Multiple Edge Functions in one project
