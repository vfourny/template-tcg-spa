[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/XXXXXXXX)

# TCG SPA — Trading Card Game

Ce projet est une **Single Page Application** Vue 3 pour jouer à un jeu de cartes Pokemon en ligne. Elle se connecte à une API REST et un serveur Socket.io déjà fournis.

Ce README vous guidera à travers l'installation du projet et les fonctionnalités à implémenter. L'énoncé complet est dans [tp.md](./tp.md).

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Node.js (v18 ou supérieur) et npm

| Système | Lien |
|---------|------|
| Windows / macOS / Linux | [nodejs.org](https://nodejs.org/) |

**Via nvm (recommandé)**

| Système | Lien |
|---------|------|
| macOS / Linux | [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) |
| Windows | [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) |

### API TCG (backend)

L'API doit être démarrée séparément avant de lancer la SPA. Elle expose :

- **REST** : `http://localhost:3001/api`
- **Socket.io** : `http://localhost:3001`

Référez-vous au README de l'API pour le démarrage.

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

Créez un fichier `.env` à la racine du projet en copiant le fichier `.env.example` :

```bash
cp .env.example .env
```

Le fichier `.env` contient :

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur **http://localhost:5173** avec hot-reload automatique.

## Commandes disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run lint         # Linter ESLint
npm run lint:fix     # ESLint avec correction automatique
npm run format       # Formater avec Prettier
npm run format:check # Vérifier le formatage
```

## Structure du projet fourni

Voici ce qui est déjà configuré dans le projet :

```
src/
├── main.ts                        # Point d'entrée (Vue + Pinia + Naive UI)
├── App.vue                        # Composant racine
├── router.ts                      # Router Vue avec routes et guards
├── vite-env.d.ts                  # Types des variables d'environnement
│
├── types/                         # Interfaces TypeScript (fourni)
│   ├── index.ts
│   ├── auth.ts                    # User, AuthResponse
│   ├── card.ts                    # Card, GameCard, DeckCard, PokemonType
│   ├── deck.ts                    # Deck
│   └── game.ts                    # GameState, PlayerBoard, Room, GameOver
│
├── composables/                   # Logique réutilisable (fourni)
│   ├── useApi.ts                  # Client HTTP (auth, cards, decks)
│   ├── useColors.ts               # Couleurs par type Pokemon et HP
│   └── useStorage.ts             # Wrapper localStorage
│
└── components/
    └── layout/
        └── HeaderBar.vue          # Barre de navigation (fourni)
```

## Ce que vous devez implémenter

```
src/
├── store/
│   ├── auth.ts                    # Store Pinia authentification
│   └── game.ts                    # Store Pinia jeu + Socket.io
│
├── pages/
│   ├── HomePage.vue               # Page d'accueil
│   ├── auth/
│   │   ├── LoginPage.vue
│   │   └── RegisterPage.vue
│   ├── decks/
│   │   ├── DeckFormPage.vue       # Création et édition
│   │   └── DeckDetailPage.vue
│   └── game/
│       └── GamePage.vue
│
└── components/
    ├── card/
    │   ├── PokemonCard.vue        # Affichage d'une carte
    │   └── PokemonCardsList.vue   # Grille de cartes sélectionnables
    ├── deck/
    │   └── DeckList.vue           # Liste des decks de l'utilisateur
    └── game/
        ├── GameLobby.vue          # Lobby de matchmaking
        ├── GameActionBar.vue      # Barre d'actions en jeu
        ├── GameOverModal.vue      # Modal de fin de partie
        ├── PlayerHand.vue         # Main du joueur
        └── PlayerZone.vue         # Zone de jeu d'un joueur
```

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
