# maass-ai-starter

A modern web app starter using React, Vite, TypeScript, and Tailwind CSS.

## Features

- ⚡️ Vite for fast development
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🧹 ESLint & Prettier for code quality

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Setup

1. Copy the example env file and fill in values:
   ```bash
   cp .env.example .env.local
   ```
2. Rules:
   - Use `NEXT_PUBLIC_*` only for values safe to expose in the browser (e.g., `NEXT_PUBLIC_SUPABASE_URL`, anon key).
   - Keep secrets server-only (e.g., `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`). Do not log or return them from APIs.
   - Do not add secrets to `next.config.js` `env` – they would be bundled client-side. Read with `process.env` at runtime instead.
3. Git Safety:
   - `.gitignore` is configured to ignore `.env*` files. Never commit real secrets.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code
- `npm run format` — Format code with Prettier
