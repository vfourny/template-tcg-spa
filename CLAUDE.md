# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Template for a Trading Card Game Single Page Application (tcg-spa). This is a web project using npm as the package manager, with ESLint and Prettier configured for linting and formatting.

## Tooling

- **Package manager:** npm
- **Linting:** ESLint (fix on save)
- **Formatting:** Prettier (format on save)

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with autofix
npm run format       # Run Prettier
npm run format:check # Check Prettier
```

## Conventions

### Versions de packages

**Toujours fixer les versions exactes** dans `package.json` — pas de `^` ni de `~`.
Avant d'écrire la version, lire la version réellement installée dans `package-lock.json` :

```bash
node -e "const l=JSON.parse(require('fs').readFileSync('package-lock.json','utf8')); console.log(l.packages['node_modules/<pkg>']?.version)"
```

### Stack

- Vue 3 + `<script setup lang="ts">`
- Vite
- Vue Router 4 (`src/routes/`)
- Pinia (`src/store/`)
- Naive UI (enregistrement global `app.use(naive)`)
- Socket.io-client (`src/store/game.ts`)
- TypeScript strict (`src/types/index.ts` pour les interfaces)

### Structure

```
src/
  components/   ← composants réutilisables
  composables/  ← logique réutilisable (useCards, etc.)
  routes/       ← router + navigation guards
  store/        ← stores Pinia
  types/        ← interfaces TypeScript
  utils/        ← utilitaires (api, typeColors)
  views/        ← une vue par route
```

### Style

- CSS via `<style scoped>` uniquement quand Naive UI ne suffit pas
- Layouts avec composants Naive UI (`NSpace`, `NGrid`, etc.)
- Zéro Tailwind
