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
