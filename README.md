[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/XXXXXXXX)

# TCG SPA — Trading Card Game

Dans ce TP, vous allez construire une **Single Page Application** Vue 3 pour un jeu de cartes Pokemon en ligne. L'objectif est d'implémenter le frontend complet qui s'appuie sur une API REST et un serveur Socket.io déjà fournis.

L'application permet à un utilisateur de :

- Créer un compte et se connecter
- Gérer des decks de 10 cartes Pokemon
- Rejoindre un lobby de matchmaking en ligne
- Jouer une partie en temps réel contre un autre joueur

> **L'API doit tourner sur `http://localhost:3001` avant de démarrer le projet.**

## Prérequis

### Node.js (v18 ou supérieur)

| Système | Lien |
|---------|------|
| Windows / macOS / Linux | [nodejs.org](https://nodejs.org/) |

**Via nvm (recommandé)**

| Système | Lien |
|---------|------|
| macOS / Linux | [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) |
| Windows | [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) |

### Outils recommandés

- **Éditeur** : [VS Code](https://code.visualstudio.com/) ou [WebStorm](https://www.jetbrains.com/webstorm/)
- **Extension Vue** : [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) pour VS Code
- **Extension navigateur** : [Vue DevTools](https://devtools.vuejs.org/)

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur **http://localhost:5173**.

## Commandes disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run lint         # Linter ESLint
npm run lint:fix     # ESLint avec correction automatique
npm run format       # Formater avec Prettier
npm run format:check # Vérifier le formatage
```

## Ce qui est fourni

| Fichier | Description |
|---------|-------------|
| `src/main.ts` | Point d'entrée (Vue, Pinia, Naive UI configurés) |
| `src/App.vue` | Composant racine avec layout global |
| `src/router.ts` | Router avec les routes définies (guards à implémenter) |
| `src/types/` | Interfaces de base : `PokemonType`, `Card`, `User`, `AuthResponse`, `Deck`, `DeckCard` — les types du jeu sont à compléter |
| `src/composables/useApi.ts` | Client HTTP prêt à l'emploi (auth, cards, decks) |
| `src/composables/useColors.ts` | Utilitaires de couleurs pour les types Pokemon et les HP |
| `src/composables/useStorage.ts` | Wrapper localStorage |
| `src/components/layout/HeaderBar.vue` | Barre de navigation (sans logique d'affichage conditionnel) |
| Page d'accueil | Page vide fournie — à enrichir au fil du TP |

## Rappels techniques

### Vue 3 `<script setup lang="ts">`

Tout le code Vue utilisera cette syntaxe. Les composants sont enregistrés automatiquement dès qu'ils sont importés.

### Naive UI

Tous les composants Naive UI (`NButton`, `NForm`, `NInput`, `NGrid`, `NCard`, `NModal`, etc.) sont enregistrés **globalement** — utilisez-les directement dans les templates sans import.

### TypeScript

Le typage est un **prérequis attendu** tout au long du TP. Typez vos props, vos `ref`, et les données reçues de l'API ou des événements Socket.io. Les types de base sont fournis, complétez-les au fur et à mesure.

### Pinia

Les stores se définissent avec `defineStore` et s'utilisent dans les composants avec `useXxxStore()`.

### useApi

Le composable `useApi()` expose toutes les méthodes HTTP. Le token JWT est injecté automatiquement.

```ts
const api = useApi()

await api.signIn({ email, password })       // → AuthResponse
await api.signUp({ email, password, username })

await api.getCards()                        // → Card[]

await api.getMyDecks()                      // → Deck[]
await api.getDeck(id)                       // → Deck
await api.createDeck({ name, cards })       // cards : number[] (IDs)
await api.updateDeck(id, { name, cards })
await api.deleteDeck(id)
```

> **Important** : les endpoints decks retournent des `DeckCard` (`{ id, deckId, cardId }`) et non des `Card` directement. Pour afficher les détails d'une carte, chargez `getCards()` séparément et croisez les données par `cardId`.

## Structure à implémenter

```
src/
├── store/
│   ├── auth.ts          # Store d'authentification
│   └── game.ts          # Store de jeu + Socket.io
│
├── pages/
│   ├── HomePage.vue     # Fournie — à enrichir
│   ├── auth/
│   │   ├── LoginPage.vue
│   │   └── RegisterPage.vue
│   ├── decks/
│   │   ├── DeckFormPage.vue
│   │   └── DeckDetailPage.vue
│   └── game/
│       └── GamePage.vue
│
└── components/
    ├── card/            # Composant carte + grille
    ├── deck/            # Liste des decks
    └── game/            # Lobby, zones de jeu, actions, modal
```

## Conseils généraux

- **Avancez dans l'ordre des tickets** : chaque partie s'appuie sur la précédente
- **Lisez les types fournis** avant d'implémenter — ils décrivent les structures de données attendues
- **Consultez `useApi`** pour connaître les signatures exactes des méthodes disponibles
- **Utilisez les Vue DevTools** dans le navigateur pour inspecter l'état des stores en temps réel
- **Naive UI** couvre la plupart des besoins UI — documentation sur [naiveui.com](https://www.naiveui.com/)
- La mise en page exacte est libre — l'important est que les fonctionnalités soient présentes et correctes

## Stack technique

| Outil | Rôle |
|-------|------|
| Vue 3 + `<script setup lang="ts">` | Framework UI |
| Vite | Build tool et dev server |
| Vue Router 4 | Routing côté client |
| Pinia | Gestion d'état |
| Naive UI | Bibliothèque de composants UI |
| Socket.io-client | Communication temps réel |
| TypeScript | Typage statique |
