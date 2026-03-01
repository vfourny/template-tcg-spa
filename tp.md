# TP — TCG SPA : Single Page Application Vue 3

## Présentation du projet

Dans ce TP, vous allez construire une **Single Page Application** pour un jeu de cartes Pokemon en ligne. L'objectif est d'implémenter le frontend complet qui s'appuie sur une API REST et un serveur Socket.io déjà fournis et fonctionnels.

L'application permet à un utilisateur de :

- Créer un compte et se connecter
- Gérer des decks de 10 cartes Pokemon
- Rejoindre un lobby de matchmaking en ligne
- Jouer une partie en temps réel contre un autre joueur

**L'API est disponible sur `http://localhost:3001`.** Assurez-vous qu'elle tourne avant de démarrer.

## Ce qui est fourni

Le projet démarre avec les éléments suivants déjà en place :

| Fichier | Description |
|---------|-------------|
| `src/main.ts` | Point d'entrée de l'application (Vue, Pinia, Naive UI configurés) |
| `src/App.vue` | Composant racine avec layout global |
| `src/router.ts` | Router avec les routes définies (guards de navigation à implémenter) |
| `src/types/` | Toutes les interfaces TypeScript (`User`, `Card`, `Deck`, `GameState`, etc.) |
| `src/composables/useApi.ts` | Client HTTP prêt à l'emploi (auth, cards, decks) |
| `src/composables/useColors.ts` | Utilitaires de couleurs pour les types Pokemon et les HP |
| `src/composables/useStorage.ts` | Wrapper pour le localStorage |
| `src/components/layout/HeaderBar.vue` | Barre de navigation (affichage conditionnel selon auth) |
| Page d'accueil | Page vide fournie — à enrichir au fil du TP |

> **Conseil général** : Lisez les fichiers fournis avant de commencer. Les types, le composable `useApi` et le router vous donnent une vue d'ensemble de l'architecture attendue.

## Rappels techniques

### Vue 3 `<script setup>`

Tout le code Vue utilisera la syntaxe `<script setup lang="ts">`. Les composants sont enregistrés automatiquement dès qu'ils sont importés.

### Naive UI

L'ensemble des composants Naive UI (`NButton`, `NForm`, `NInput`, `NGrid`, `NCard`, etc.) est enregistré **globalement** — vous pouvez les utiliser directement dans les templates sans les importer.

### Pinia

Les stores se définissent avec `defineStore`. Importez et utilisez-les dans vos composants avec `useXxxStore()`.

### useApi

Le composable `useApi()` expose toutes les méthodes HTTP nécessaires :

```ts
const api = useApi()

// Auth
await api.signIn({ email, password })
await api.signUp({ email, password, username })

// Cards
await api.getCards()             // → Card[]

// Decks
await api.getMyDecks()           // → Deck[]
await api.getDeck(id)            // → Deck
await api.createDeck({ name, cards })
await api.updateDeck(id, { name, cards })
await api.deleteDeck(id)
```

Le token JWT est injecté automatiquement dans les requêtes depuis le localStorage.

---

## Partie 1 — Authentification

L'objectif de cette partie est de mettre en place le parcours d'authentification complet : store, page de connexion et page d'inscription.

### 1.1 — Store d'authentification

Créez un **store Pinia** qui centralise l'état d'authentification.

**Ce que le store doit gérer :**

- Le token JWT de l'utilisateur connecté
- Les informations de l'utilisateur (`id`, `email`, `username`)
- Un **computed** `isAuthenticated` pour savoir si un utilisateur est connecté
- Les actions `login`, `register` et `logout`

**Indications :**

- Utilisez `useStorage` pour persister le token et l'utilisateur dans le localStorage — l'utilisateur ne doit pas être déconnecté au rechargement de la page
- Les actions `login` et `register` doivent appeler `useApi` et mettre à jour l'état
- `logout` doit vider l'état et le localStorage, puis rediriger vers la page de connexion

Une fois le store en place, implémentez les **guards de navigation** dans `router.ts` :

- Les routes protégées (`requiresAuth`) redirigent vers la page de connexion si l'utilisateur n'est pas authentifié
- Les routes publiques (`guestOnly`) redirigent vers `/` si l'utilisateur est déjà connecté

**Indications :**

- Utilisez `router.beforeEach` et consultez le store auth pour vérifier `isAuthenticated`
- Les métadonnées de route (`meta`) sont déjà définies dans `router.ts` pour indiquer si une route est protégée ou publique

**Exigences**

- [ ] `isAuthenticated` retourne `true` si un token est présent
- [ ] `login(email, password)` connecte l'utilisateur et persiste token + user
- [ ] `register(email, password, username)` inscrit et connecte l'utilisateur
- [ ] `logout()` vide l'état et redirige vers la page de connexion
- [ ] L'état est restauré depuis le localStorage au rechargement
- [ ] Guard `requiresAuth` : redirige vers la connexion si non authentifié
- [ ] Guard `guestOnly` : redirige vers `/` si déjà authentifié

---

### 1.2 — Page de connexion

Créez une **page de connexion** avec un formulaire.

**Ce que la page doit faire :**

- Afficher un formulaire avec les champs email et mot de passe
- Appeler l'action `login` du store au submit
- Rediriger vers `/` après une connexion réussie
- Afficher un message d'erreur si la connexion échoue
- Proposer un lien vers la page d'inscription

**Indications :**

- Utilisez les composants Naive UI `NForm`, `NFormItem`, `NInput`, `NButton` pour construire le formulaire
- Pensez à gérer un `ref` local `loading` pour désactiver le bouton pendant la requête
- Le router est accessible via `useRouter()` de Vue Router

**Exigences**

- [ ] Formulaire avec champ email et mot de passe
- [ ] Bouton de soumission avec état `loading`
- [ ] Affichage d'une erreur si les identifiants sont incorrects
- [ ] Redirection vers `/` après connexion réussie
- [ ] Lien vers la page d'inscription

---

### 1.3 — Page d'inscription

Créez une **page d'inscription** avec un formulaire.

**Ce que la page doit faire :**

- Afficher un formulaire avec les champs username, email et mot de passe
- Appeler l'action `register` du store au submit
- Rediriger vers `/` après une inscription réussie
- Afficher un message d'erreur si l'inscription échoue (ex. email déjà utilisé)
- Proposer un lien vers la page de connexion

**Indications :**

- La structure est similaire à la page de connexion, factorisez si vous le souhaitez

**Exigences**

- [ ] Formulaire avec champs username, email et mot de passe
- [ ] Bouton de soumission avec état `loading`
- [ ] Affichage d'une erreur en cas d'échec
- [ ] Redirection vers `/` après inscription réussie
- [ ] Lien vers la page de connexion

---

## Partie 2 — Gestion des decks

Cette partie couvre la création, la consultation et la modification des decks de l'utilisateur. Un deck contient **exactement 10 cartes**.

> **Important** : Les endpoints de l'API retournent les decks avec des `DeckCard` (table de jonction) et non directement les objets `Card`. Pour afficher les détails d'une carte, vous devrez croiser les données avec la liste complète des cartes récupérée via `getCards()`.

### 2.1 — Composant d'affichage d'une carte

Créez un **composant** pour afficher une carte Pokemon individuelle.

**Ce que le composant doit afficher :**

- L'image de la carte (`imgUrl`)
- Le numéro de Pokédex et le nom
- Le type avec une couleur distincte (utilisez `useColors`)
- Les points de vie (HP) et l'attaque
- Optionnellement : une barre de HP colorée si des HP actuels (`currentHp`) sont passés en prop

**Indications :**

- Définissez des props claires : `card`, `size` ('sm' | 'md'), `selectable`, `selected`, `disabled`, `currentHp`
- `useColors` expose `getTypeColor(type)` et `hpColor(percent)` — exploitez-les
- Le composant peut émettre un événement au clic quand il est sélectionnable

**Exigences**

- [ ] Affichage de l'image, du nom, du type, des HP et de l'attaque
- [ ] Couleur du type via `getTypeColor`
- [ ] Deux tailles disponibles (`sm` et `md`)
- [ ] État visuel distinct quand `selected` ou `disabled`
- [ ] Barre de HP visible si `currentHp` est fourni

---

### 2.2 — Composant de grille de cartes sélectionnables

Créez un **composant** pour afficher une grille de cartes avec sélection multiple.

**Ce que le composant doit faire :**

- Afficher une liste de cartes en grille
- Permettre la sélection de cartes avec un maximum configurable
- Désactiver les cartes non sélectionnées quand le maximum est atteint

**Indications :**

- Props : `cards`, `selectable`, `selectedIds`, `maxSelected`
- Émettez un événement `toggle(cardId)` quand une carte est cliquée
- Utilisez `NGrid` et `NGridItem` de Naive UI pour la mise en page

**Exigences**

- [ ] Affichage en grille des cartes via le composant de carte
- [ ] Sélection toggleable avec émission d'événement
- [ ] Cartes désactivées quand `maxSelected` est atteint

---

### 2.3 — Composant de liste des decks

Créez un **composant** qui affiche les decks de l'utilisateur connecté.

**Ce que le composant doit faire :**

- Charger et afficher les decks dans `onMounted`
- Permettre de naviguer vers le détail ou l'édition d'un deck
- Permettre de supprimer un deck
- Proposer un bouton de création de deck

**Indications :**

- Utilisez `useApi` pour charger les decks et gérer la suppression
- `NCard`, `NSpace`, `NButton` de Naive UI faciliteront la mise en page
- La navigation se fait avec `useRouter()` depuis Vue Router

**Exigences**

- [ ] Liste des decks chargée dans `onMounted`
- [ ] Bouton de création de deck
- [ ] Actions : voir le détail, éditer, supprimer
- [ ] Rafraîchissement de la liste après suppression

---

### 2.4 — Page de création de deck

Créez une **page de formulaire** pour créer un deck.

**Ce que la page doit faire :**

- Afficher un champ pour le nom du deck
- Afficher la liste complète des cartes disponibles avec sélection multiple
- Limiter la sélection à exactement 10 cartes
- Créer le deck via l'API au submit, puis rediriger vers `/`

**Indications :**

- Chargez les cartes disponibles dans `onMounted`
- Utilisez le composant de grille de cartes avec `selectable`, `selectedIds` et `maxSelected=10`
- Désactivez le bouton de soumission si le nom est vide ou si le nombre de cartes sélectionnées ≠ 10

**Exigences**

- [ ] Champ de nom du deck
- [ ] Grille de toutes les cartes disponibles avec sélection
- [ ] Compteur du nombre de cartes sélectionnées (ex. "7 / 10")
- [ ] Soumission bloquée si ≠ 10 cartes ou nom vide
- [ ] Appel `createDeck` puis redirection après succès

---

### 2.5 — Page de détail et édition d'un deck

Créez une **page de détail** pour consulter les cartes d'un deck.

**Ce que la page doit faire :**

- Charger le deck par son `id` (récupéré depuis les paramètres de route)
- Afficher les 10 cartes du deck en mode lecture seule
- Proposer un bouton pour accéder à l'édition

> N'oubliez pas que l'API retourne des `DeckCard` (avec `cardId`) et non des `Card` directement. Vous devrez charger les cartes séparément et les associer.

**Puis**, adaptez le formulaire de deck pour gérer également le **mode édition** :

- Si la route est `/decks/:id/edit`, pré-remplir le formulaire avec les données existantes
- Appeler `updateDeck` au lieu de `createDeck`

**Indications :**

- `useRoute()` de Vue Router expose les `params` et la `name` de la route courante
- Chargez deck ET cartes en parallèle avec `Promise.all`

**Exigences**

- [ ] Affichage des 10 cartes du deck en lecture seule
- [ ] Bouton vers le formulaire d'édition
- [ ] Mode édition du formulaire pré-rempli avec le deck existant
- [ ] Appel `updateDeck` en mode édition, `createDeck` en mode création

---

### 2.6 — Intégration sur la page d'accueil

Intégrez le composant de liste des decks dans la **page d'accueil** fournie.

**Exigences**

- [ ] La liste des decks est visible sur la page d'accueil

---

## Partie 3 — Lobby de jeu

Cette partie introduit le lobby de matchmaking avec Socket.io. La connexion temps réel sera mise en place ici, et le composant de lobby viendra s'intégrer sur la page d'accueil existante.

### 3.1 — Composant de lobby et store de jeu

Créez un **composant de lobby** et le **store de jeu** associé.

#### Store de jeu

Le store gère la connexion Socket.io et l'état du lobby/jeu.

**État à gérer :**

- La connexion Socket.io (`socket`, `socketId`)
- La liste des rooms disponibles (`rooms`)
- L'identifiant de la room rejointe (`roomId`)
- L'état de jeu (`gameState`) — sera utilisé en Partie 4
- Les messages et erreurs temps réel

**Actions à implémenter pour le lobby :**

- `connect(token)` : initialise la connexion Socket.io avec authentification JWT
- `disconnect()` : ferme la connexion proprement
- `getRooms()` : émet l'événement `getRooms` vers le serveur
- `createRoom(deckId)` : émet `createRoom` avec l'id du deck choisi
- `joinRoom(roomId, deckId)` : émet `joinRoom` pour rejoindre une room

**Indications :**

- Socket.io client s'initialise avec `io(url, { auth: { token } })`
- Écoutez les événements retour : `roomCreated`, `roomsList`, `roomsListUpdated`, `gameStarted`
- Quand `gameStarted` est reçu, naviguez vers `/game`
- Le token est disponible dans le store auth

#### Composant de lobby

- Afficher un sélecteur de deck et un bouton "Créer une partie"
- Afficher la liste des rooms disponibles, chacune avec un sélecteur de deck et un bouton "Rejoindre"
- Se connecter au socket dans `onMounted` (si token présent) et appeler `getRooms()`

**Exigences**

- [ ] Connexion Socket.io établie avec le token JWT
- [ ] `createRoom(deckId)` émet l'événement et attend la confirmation
- [ ] `getRooms()` charge et affiche les rooms disponibles
- [ ] `joinRoom(roomId, deckId)` rejoint une room
- [ ] Redirection automatique vers `/game` à la réception de `gameStarted`
- [ ] La liste des rooms se met à jour en temps réel (`roomsListUpdated`)
- [ ] Le composant de lobby est intégré sur la page d'accueil aux côtés de la liste des decks

---

## Partie 4 — Le jeu en temps réel

Cette dernière partie implémente l'interface de jeu complète. Le store de jeu est déjà partiellement construit en Partie 3 — il faut maintenant le compléter avec les actions de jeu.

### 4.1 — Complétion du store de jeu

**Complétez les computed :**

- `isMyTurn` : vrai si le `socketId` courant correspond au `currentPlayerSocketId` dans `gameState`
- `myRole` : retourne `'host'` ou `'guest'` selon quel slot occupe le joueur
- `myBoard` / `opponentBoard` : les objets `PlayerBoard` pour chaque joueur

**Ajoutez les actions de jeu :**

- `drawCards(roomId)` : pioche des cartes
- `playCard(roomId, cardIndex)` : joue une carte depuis la main
- `attack(roomId)` : attaque la carte adverse
- `endTurn(roomId)` : passe le tour

**Indications :**

- Ces actions émettent simplement l'événement Socket.io correspondant
- Écoutez `gameStateUpdated` pour mettre à jour `gameState`
- Écoutez `gameEnded` pour stocker le résultat (`gameOver`)
- Écoutez `opponentDisconnected` pour notifier l'utilisateur

**Exigences**

- [ ] `isMyTurn`, `myRole`, `myBoard`, `opponentBoard` correctement calculés
- [ ] Actions `drawCards`, `playCard`, `attack`, `endTurn` émettent les bons événements
- [ ] `gameState` mis à jour à chaque `gameStateUpdated`
- [ ] `gameOver` renseigné à la réception de `gameEnded`

---

### 4.2 — Page de jeu

Créez la **page de jeu** qui orchestre tous les composants de jeu.

**Layout attendu (de haut en bas) :**

1. Zone adversaire
2. Barre d'actions
3. Zone joueur avec la main à l'intérieur

**Exigences**

- [ ] Les trois zones sont affichées
- [ ] Les données viennent du store (`myBoard`, `opponentBoard`)

---

### 4.3 — Composants de jeu

#### Composant de zone de jeu

Affiche la zone d'un joueur (adversaire ou soi-même).

- Props : `role` ('my' | 'opponent'), `label`
- Affiche : le score (nombre de KOs, 0 à 3), la carte active du joueur avec ses HP actuels
- En mode `my`, un slot permet d'insérer la main du joueur en dessous

**Indications :**

- La carte active est un `GameCard` (extends `Card` avec `currentHp`)
- Utilisez le composant de carte avec le prop `currentHp` pour afficher la barre de vie

**Exigences**

- [ ] Score affiché (KOs)
- [ ] Carte active affichée avec barre de HP si présente
- [ ] Slot pour contenu additionnel (main du joueur)

---

#### Composant de main du joueur

Affiche les cartes en main du joueur et le compteur de deck.

- Affiche les cartes de la main (max 5) sous forme de grille
- Affiche le nombre de cartes restantes dans le deck
- Permet de cliquer sur une carte pour la jouer (si c'est son tour et qu'aucune carte n'est active)

**Indications :**

- `canPlayCard` = `isMyTurn && !myBoard.activeCard`
- Émettez un événement vers le parent ou appelez directement le store

**Exigences**

- [ ] Grille des cartes en main
- [ ] Compteur de deck
- [ ] Clic sur une carte jouable appelle `playCard`
- [ ] Cartes non cliquables si ce n'est pas le tour ou si une carte est déjà active

---

#### Composant de barre d'actions

Affiche les actions disponibles pendant le jeu.

- Indicateur de tour ("Votre tour" / "Tour de l'adversaire")
- Bouton **Piocher** : désactivé si la main est pleine (5 cartes) ou le deck vide
- Bouton **Attaquer** : désactivé si l'un des deux joueurs n'a pas de carte active
- Bouton **Fin de tour** : toujours disponible quand c'est son tour
- Zone de message temps réel (feedback des actions)

**Indications :**

- Tous les boutons sont désactivés si `!isMyTurn`
- Les conditions précises (`canDraw`, `canAttack`) viennent du store

**Exigences**

- [ ] Indicateur de tour clair
- [ ] Trois boutons avec états désactivés corrects
- [ ] Affichage du message temps réel

---

#### Modal de fin de partie

Affiche une modal de fin de partie.

- Affiche un message de victoire ou de défaite
- Propose un bouton pour retourner au lobby
- Se déclenche automatiquement quand `gameOver` est défini dans le store

**Indications :**

- Utilisez `NModal` de Naive UI
- Le retour au lobby consiste à appeler `resetGame()` du store et naviguer vers `/`

**Exigences**

- [ ] Modal visible quand `gameOver` est défini
- [ ] Message différent selon victoire ou défaite
- [ ] Bouton retour au lobby fonctionnel

---

## Récapitulatif des points

| Partie | Sous-partie | Points |
|--------|-------------|--------|
| **1 — Auth** | Store d'authentification | 1 |
| | Page de connexion | 1 |
| | Page d'inscription | 1 |
| **2 — Decks** | Composant carte + grille de cartes | 1 |
| | Composant liste des decks + intégration accueil | 1 |
| | Page création de deck | 1.5 |
| | Page détail + mode édition | 1.5 |
| **3 — Lobby** | Store de jeu (lobby) + composant lobby | 2 |
| **4 — Jeu** | Complétion store de jeu | 1.5 |
| | Page de jeu + composant de zone | 1.5 |
| | Main + barre d'actions + modal de fin | 1.5 |
| **Total** | | **15** |

## Conseils généraux

- **Avancez dans l'ordre** : chaque partie s'appuie sur la précédente
- **Lisez les types** dans `src/types/` avant d'implémenter — ils décrivent exactement les structures de données
- **Consultez `useApi`** pour connaître les signatures exactes des méthodes disponibles
- **Testez dans le navigateur** avec les Vue DevTools pour inspecter l'état des stores
- **Utilisez Naive UI** pour la mise en page et les composants de formulaire — la documentation est disponible sur [naiveui.com](https://www.naiveui.com/)
- La mise en page exacte est libre — l'important est que les fonctionnalités soient présentes et correctes
