[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/XXXXXXXX)

# TCG SPA — Trading Card Game

Dans ce TP, vous allez construire une **Single Page Application** Vue 3 pour un jeu de cartes Pokemon en ligne. L'objectif est d'implémenter le frontend complet qui s'appuie sur une API REST et un serveur Socket.io déjà fournis.

L'application permet à un utilisateur de :

- Créer un compte et se connecter
- Gérer des decks de 10 cartes Pokemon
- Rejoindre un lobby de matchmaking en ligne
- Jouer une partie en temps réel contre un autre joueur

> **L'API doit tourner sur `http://localhost:3001` avant de démarrer le projet.**
> Utilisez Docker pour démarrer l'API et la base de données (voir section [Lancer le backend](#lancer-le-backend-avec-docker)).

## Prérequis

### Node.js (v18 ou supérieur)

| Système                 | Lien                              |
| ----------------------- | --------------------------------- |
| Windows / macOS / Linux | [nodejs.org](https://nodejs.org/) |

**Via nvm (recommandé)**

| Système       | Lien                                                               |
| ------------- | ------------------------------------------------------------------ |
| macOS / Linux | [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)       |
| Windows       | [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) |

### Docker (pour le backend)

| Système                 | Lien                                                          |
| ----------------------- | ------------------------------------------------------------- |
| Windows / macOS / Linux | [docker.com](https://www.docker.com/products/docker-desktop/) |

### Outils recommandés

- **Éditeur** : [VS Code](https://code.visualstudio.com/) ou [WebStorm](https://www.jetbrains.com/webstorm/)
- **Extension Vue** : [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) pour VS Code
- **Extension navigateur** : [Vue DevTools](https://devtools.vuejs.org/)

## Lancer le backend avec Docker

Un `docker-compose.yml` est fourni pour démarrer l'API et PostgreSQL en une seule commande.

```bash
npm run api:start   # Démarrer l'API et la base de données (logs en direct)
npm run api:stop    # Arrêter les services
```

Cela démarre :

- **PostgreSQL** sur le port `5432` avec les données de seed (cartes Pokémon + comptes de test)
- **L'API REST + Socket.io** sur `http://localhost:3001`

**Comptes de test disponibles après le seed :**

| Utilisateur | Email            | Mot de passe |
| ----------- | ---------------- | ------------ |
| red         | red@example.com  | password123  |
| blue        | blue@example.com | password123  |

> Les données PostgreSQL sont persistées dans un volume Docker (`postgres_data`). Pour repartir de zéro : `docker-compose down -v`.

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

Ces variables pointent vers le backend Docker local. Ne modifiez pas ces valeurs pour le développement.

> **Déploiement Vercel** : renseignez `VITE_API_BASE_URL` et `VITE_SOCKET_URL` dans les variables d'environnement du projet Vercel (Settings → Environment Variables) avec l'URL du backend hébergé. Le fichier `.env` local n'est jamais déployé.

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
npm run api:start    # Démarrer l'API + base de données (logs en direct)
npm run api:stop     # Arrêter l'API + base de données
```

## Ce qui est fourni

| Fichier                               | Description                                                                                                                |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts`                         | Point d'entrée (Vue, Pinia, Naive UI configurés)                                                                           |
| `src/App.vue`                         | Composant racine avec layout global                                                                                        |
| `src/router.ts`                       | Router avec les routes définies (guards à implémenter)                                                                     |
| `src/types/`                          | Interfaces de base : `PokemonType`, `Card`, `User`, `AuthResponse`, `Deck`, `DeckCard` — les types du jeu sont à compléter |
| `src/composables/useApi.ts`           | Client HTTP prêt à l'emploi (auth, cards, decks)                                                                           |
| `src/composables/useColors.ts`        | Utilitaires de couleurs pour les types Pokemon et les HP                                                                   |
| `src/composables/useStorage.ts`       | Wrapper localStorage                                                                                                       |
| `src/components/layout/HeaderBar.vue` | Barre de navigation (sans logique d'affichage conditionnel)                                                                |
| Page d'accueil                        | Page vide fournie — à enrichir au fil du TP                                                                                |

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

await api.signIn({ email, password }) // → AuthResponse
await api.signUp({ email, password, username })

await api.getCards() // → Card[]

await api.getMyDecks() // → Deck[]
await api.getDeck(id) // → Deck
await api.createDeck({ name, cards }) // cards : number[] (IDs)
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

| Outil                              | Rôle                          |
| ---------------------------------- | ----------------------------- |
| Vue 3 + `<script setup lang="ts">` | Framework UI                  |
| Vite                               | Build tool et dev server      |
| Vue Router 4                       | Routing côté client           |
| Pinia                              | Gestion d'état                |
| Naive UI                           | Bibliothèque de composants UI |
| Socket.io-client                   | Communication temps réel      |
| TypeScript                         | Typage statique               |

---

# Comment réaliser ce TP

## 0. Initialisation — à faire une seule fois

### Créer un Personal Access Token (PAT)

Le workflow de setup a besoin d'un PAT pour configurer les branch protection rules (le `GITHUB_TOKEN` par défaut ne dispose pas des droits suffisants).

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens) → **"Generate new token (classic)"**
2. Donnez-lui un nom (ex: `tcg-spa-admin`), une expiration suffisante
3. Cochez le scope **`repo`** (accès complet au dépôt)
4. Cliquez **"Generate token"** et copiez la valeur

Ajoutez ensuite ce token comme secret dans votre dépôt :

1. Settings → Secrets and variables → Actions → **"New repository secret"**
2. Nom : `ADMIN_TOKEN` — Valeur : le token copié

### Initialiser le dépôt

Une fois le secret ajouté, lancez le workflow de setup :

1. Allez sur l'onglet **Actions** de votre dépôt GitHub
2. Sélectionnez le workflow **"Setup repo"**
3. Cliquez sur **"Run workflow"** puis confirmez

Le workflow crée les **14 issues** du TP et configure automatiquement les branch protection rules sur `main` (les checks `build` et `check` devront passer avant tout merge).

### Connecter Vercel

Chaque Pull Request déclenche automatiquement un déploiement de preview sur Vercel et poste l'URL en commentaire. Pour activer ce pipeline, vous devez relier votre dépôt à un projet Vercel.

**1. Créer le projet Vercel**

Importez votre dépôt sur [vercel.com](https://vercel.com) et laissez Vercel détecter le projet Vite automatiquement.

**2. Configurer les variables d'environnement sur Vercel**

Dans les settings du projet Vercel (Settings → Environment Variables), ajoutez :

| Variable            | Valeur                                                  |
| ------------------- | ------------------------------------------------------- |
| `VITE_API_BASE_URL` | URL de l'API hébergée (ex: `https://votre-api.com/api`) |
| `VITE_SOCKET_URL`   | URL du serveur Socket.io (ex: `https://votre-api.com`)  |

**3. Récupérer les identifiants Vercel**

```bash
npm install -g vercel
vercel login
vercel link   # Lier le projet local → génère .vercel/project.json
```

Ouvrez `.vercel/project.json` — vous y trouverez `orgId` et `projectId`.

Pour le token : [vercel.com/account/tokens](https://vercel.com/account/tokens) → créer un token.

**4. Ajouter les secrets GitHub**

Dans votre dépôt GitHub (Settings → Secrets and variables → Actions) :

| Secret              | Valeur                                            |
| ------------------- | ------------------------------------------------- |
| `VERCEL_TOKEN`      | Token généré à l'étape précédente                 |
| `VERCEL_ORG_ID`     | Valeur de `orgId` dans `.vercel/project.json`     |
| `VERCEL_PROJECT_ID` | Valeur de `projectId` dans `.vercel/project.json` |

> `.vercel/` est gitignored — ne commitez pas ce dossier.

## Workflow de travail

Pour chaque ticket :

### 1. Récupérer l'issue

Les issues GitHub contiennent l'objectif, les conseils et les exigences de chaque ticket.

### 2. Créer une branche

Depuis l'issue GitHub, utilisez le bouton **"Create a branch"** pour créer une branche dédiée :

```bash
git checkout -b 1-store-authentification
```

### 3. Développer et commiter

```bash
git add .
git commit -m "feat: store d'authentification et guards"
git push origin 1-store-authentification
```

### 4. Ouvrir une Pull Request

1. Créez une PR vers `main` depuis votre branche
2. Liez-la à l'issue avec `Closes #1` dans la description
3. Le pipeline déploie automatiquement une **preview Vercel** et poste l'URL en commentaire

> ⚠️ **GitHub Classroom** : vérifiez que la PR cible bien **votre dépôt** et non le dépôt template d'origine.

### 5. Demander une review

Assignez **@vfourny** comme reviewer. Le professeur vérifie les exigences du ticket, la qualité du code et le bon fonctionnement de la preview.

### 6. Merge et notation

Après validation, la PR est mergée dans `main`, l'issue se ferme automatiquement et le ticket est noté.

## Barème

| #         | Ticket                                                         | Points |
| --------- | -------------------------------------------------------------- | ------ |
| 1         | Store d'authentification + guards + HeaderBar conditionnel     | 1      |
| 2         | Page de connexion                                              | 1      |
| 3         | Page d'inscription                                             | 1      |
| 4         | Composants d'affichage des cartes                              | 1      |
| 5         | Composant de liste des decks                                   | 1      |
| 6         | Page de création de deck                                       | 1,5    |
| 7         | Page de détail et édition d'un deck                            | 1,5    |
| 8         | Store de jeu et composant lobby                                | 2      |
| 9         | Complétion du store de jeu                                     | 1      |
| 10        | Page de jeu et composant de zone                               | 2      |
| 11        | Composants de jeu — main, barre d'actions, modal fin de partie | 2      |
| 12        | Barre de recherche                                             | 1      |
| 13        | Responsive design                                              | 3      |
| 14        | Aperçu des cartes dans la liste des decks                      | 1      |
| **Total** |                                                                | **20** |
