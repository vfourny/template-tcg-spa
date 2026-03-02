# TCG SPA — Issues du TP

---

# 0. Setup du dépôt (0 pt)

## Objectif

Configurer l'environnement de travail avant de démarrer le TP. Cette issue est la **première PR à créer** — elle valide que le pipeline CI/CD fonctionne correctement.

## Étapes

### 1. Lancer le backend

```bash
npm install
npm run api:start
```

Vérifiez que l'API répond sur `http://localhost:3001/api/health`.

### 2. Renseigner votre identité

Dans `package.json`, remplissez le champ `author` avec votre nom d'utilisateur GitHub :

```json
"author": "votre-username-github"
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

### 4. Connecter Vercel

Chaque Pull Request déclenche automatiquement un déploiement de preview Vercel. Pour activer ce pipeline :

**a. Créer le projet Vercel**

Importez votre dépôt sur [vercel.com](https://vercel.com) et laissez Vercel détecter le projet Vite automatiquement.

**b. Récupérer votre token Vercel**

- [vercel.com/account/tokens](https://vercel.com/account/tokens) → **"Create Token"**

**c. Ajouter le secret GitHub**

Dans votre dépôt GitHub (Settings → Secrets and variables → Actions) :

| Secret         | Valeur                            |
| -------------- | --------------------------------- |
| `VERCEL_TOKEN` | Token généré à l'étape précédente |

### 5. Configurer le Ruleset GitHub

Un fichier de configuration est fourni dans `.github/ruleset.json`. Importez-le pour protéger la branche `main` :

1. Allez dans **Settings** de votre dépôt GitHub
2. Dans le menu gauche : **Rules → Rulesets**
3. Cliquez sur **New ruleset → Import a ruleset**
4. Sélectionnez le fichier `.github/ruleset.json` de votre dépôt
5. Cliquez sur **Create** pour valider

Le ruleset impose que toute modification passe par une PR avec les checks `check` et `build` au vert.

### 6. Créer la PR de validation

Créez une branche depuis cette issue, remplissez le champ `author` dans `package.json`, puis ouvrez une PR.

La PR doit afficher :

- ✅ Le check `check` (fichiers protégés)
- ✅ Le check `build` (lint + build)
- ✅ Un lien de preview Vercel en commentaire

## Exigences

- [ ] Backend accessible sur `http://localhost:3001`
- [ ] Champ `author` renseigné dans `package.json` avec votre username GitHub
- [ ] Secret `VERCEL_TOKEN` ajouté dans GitHub
- [ ] Ruleset configuré sur `main`
- [ ] PR créée avec les checks verts et la preview Vercel

---

# 1. Authentification (3 pts)

## Objectif

Mettre en place le système d'authentification complet : store Pinia, guards de navigation et pages de connexion/inscription.

---

## Ticket 1.1 — Store d'authentification (1 pt)

Créer un **store Pinia d'authentification** qui centralise l'état de connexion, les guards de navigation et l'affichage conditionnel de la barre de navigation.

### Store

Le store doit gérer :

- Le token JWT et les informations utilisateur (`id`, `email`, `username`)
- Un **computed** `isAuthenticated`
- Les actions `login(email, password)`, `register(email, password, username)` et `logout()`

L'état doit survivre à un rechargement de page via `useStorage`.

### Guards de navigation

Une fois le store en place, complétez `router.ts` avec `router.beforeEach` :

- Route avec `meta.requiresAuth` → redirige vers la page de connexion si non authentifié
- Route avec `meta.guestOnly` → redirige vers `/` si déjà connecté

Les métadonnées `meta` sont déjà définies sur chaque route.

### Conseils

- `useStorage` est disponible dans les composables pour lire/écrire dans le localStorage
- Le store auth doit être importé dans `router.ts` pour les guards
- `App.vue` est le bon endroit pour conditionner l'affichage de la `HeaderBar` selon `isAuthenticated`

---

## Ticket 1.2 — Page de connexion (1 pt)

Créer une **page de connexion** avec un formulaire fonctionnel.

### Fonctionnement attendu

- Formulaire avec les champs **email** et **mot de passe**
- Appel de l'action `login` du store au submit
- Redirection vers `/` après succès
- Affichage d'une erreur si les identifiants sont incorrects
- Lien vers la page d'inscription

### Conseils

- Composants Naive UI : `NForm`, `NFormItem`, `NInput`, `NButton`
- Gérez un `ref` local `loading` pour désactiver le bouton pendant la requête
- Attrapez l'erreur dans un `try/catch` pour afficher le message

---

## Ticket 1.3 — Page d'inscription (1 pt)

Créer une **page d'inscription** avec un formulaire fonctionnel.

### Fonctionnement attendu

- Formulaire avec les champs **username**, **email** et **mot de passe**
- Appel de l'action `register` du store au submit
- Redirection vers `/` après succès
- Affichage d'une erreur si l'inscription échoue (ex. email déjà utilisé)
- Lien vers la page de connexion

### Conseils

- La structure est similaire à la page de connexion
- Gérez un `ref` local `loading` pour désactiver le bouton pendant la requête

---

## Exigences

- [ ] `isAuthenticated` retourne `true` si un token est présent
- [ ] `login` et `register` appellent `useApi` et persistent token + user
- [ ] `logout` vide l'état et redirige vers la page de connexion
- [ ] L'état est restauré depuis le localStorage au rechargement
- [ ] Guard `requiresAuth` fonctionnel
- [ ] Guard `guestOnly` fonctionnel
- [ ] La `HeaderBar` n'est visible que si l'utilisateur est authentifié
- [ ] Formulaire de connexion avec champs email et mot de passe
- [ ] Formulaire de connexion : bouton avec état `loading` et message d'erreur
- [ ] Redirection vers `/` après connexion réussie
- [ ] Formulaire d'inscription avec champs username, email et mot de passe
- [ ] Formulaire d'inscription : bouton avec état `loading` et message d'erreur
- [ ] Redirection vers `/` après inscription réussie
- [ ] Liens entre les deux pages fonctionnels

---

# 2. Decks (5 pts)

## Objectif

Implémenter la gestion complète des decks : composants de carte, liste des decks, création et édition.

---

## Ticket 2.1 — Composants d'affichage des cartes (1 pt)

Créer les deux composants de base pour l'affichage des cartes Pokemon, réutilisés dans tout le projet.

### Composant d'affichage d'une carte

**Props :** `card`, `size` ('sm' | 'md'), `selectable`, `selected`, `disabled`, `currentHp`

**Affichage :**

- Image, numéro Pokédex, nom
- Badge de type avec couleur via `getTypeColor` de `useColors`
- HP et Attaque
- Barre de HP colorée si `currentHp` est fourni (via `hpColor` de `useColors`)

### Composant de grille de cartes sélectionnables

**Props :** `cards`, `selectable`, `selectedIds`, `maxSelected`

- Grille de cartes via le composant précédent
- Émet `toggle(cardId)` au clic
- Désactive les cartes non sélectionnées quand `maxSelected` est atteint

### Conseils

- `NGrid` et `NGridItem` de Naive UI pour la mise en page en grille
- La barre de HP peut être un simple `div` avec `width` calculée en pourcentage

---

## Ticket 2.2 — Composant de liste des decks (1 pt)

Créer un **composant de liste des decks** et l'intégrer sur la page d'accueil.

### Fonctionnement attendu

- Charger et afficher les decks de l'utilisateur dans `onMounted`
- Actions sur chaque deck : voir le détail, éditer, supprimer
- Bouton de création de deck
- Rafraîchir la liste après suppression
- Intégrer ce composant dans la page d'accueil fournie

### Conseils

- `useApi` expose `getMyDecks()` et `deleteDeck(id)`
- `NCard`, `NSpace`, `NButton` de Naive UI faciliteront la mise en page
- La navigation se fait avec `useRouter()` de Vue Router

---

## Ticket 2.3 — Page de création de deck (1,5 pts)

Créer une **page de formulaire** pour créer un nouveau deck avec sélection de 10 cartes.

### Fonctionnement attendu

- Champ pour le nom du deck
- Grille de toutes les cartes disponibles avec sélection limitée à **exactement 10 cartes**
- Compteur du nombre de cartes sélectionnées
- Soumission bloquée si ≠ 10 cartes ou nom vide
- Appel `createDeck({ name, cards })` puis redirection vers `/`

### Structure envoyée à l'API

```json
{ "name": "Mon deck", "cards": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
```

### Conseils

- Chargez les cartes dans `onMounted` avec `api.getCards()`
- Utilisez le composant de grille de cartes avec `selectable`, `selectedIds` et `maxSelected=10`

---

## Ticket 2.4 — Page de détail et édition d'un deck (1,5 pts)

Créer une **page de détail** pour consulter un deck, et adapter le formulaire de deck pour gérer le **mode édition**.

### Page de détail

- Charger le deck via son `id` (paramètre de route)
- Afficher les 10 cartes en mode lecture seule
- Bouton vers le formulaire d'édition

> **Attention** : l'API retourne des `DeckCard` (`{ id, deckId, cardId }`) et non des `Card` directement. Chargez `getCards()` séparément et croisez les données par `cardId`.

### Mode édition

Si la route est `/decks/:id/edit` :

- Charger le deck existant et pré-remplir le formulaire
- Appeler `updateDeck` au lieu de `createDeck`

### Conseils

- `useRoute().name` permet de distinguer création et édition
- Chargez deck et cartes en parallèle avec `Promise.all`
- Initialisez `selectedIds` avec les `cardId` du deck chargé

---

## Exigences

- [ ] Affichage image, nom, type (avec couleur), HP et attaque
- [ ] Deux tailles disponibles (`sm` et `md`)
- [ ] État visuel distinct quand `selected` ou `disabled`
- [ ] Barre de HP visible si `currentHp` est fourni
- [ ] Grille de cartes avec sélection toggleable et désactivation à `maxSelected`
- [ ] Decks chargés dans `onMounted`, bouton de création, suppression avec rafraîchissement
- [ ] Composant de liste visible sur la page d'accueil
- [ ] Champ de nom, grille sélectionnable, compteur et soumission bloquée si conditions non remplies
- [ ] Appel `createDeck` avec les bons paramètres et redirection
- [ ] Page de détail affiche les 10 cartes (jointure `DeckCard` ↔ `Card` correcte)
- [ ] Formulaire pré-rempli en mode édition, appel `updateDeck`

---

# 3. Jeu en temps réel (7 pts)

## Objectif

Implémenter le jeu complet en temps réel via Socket.io : store, lobby, page de jeu et composants d'interaction.

---

## Ticket 3.1 — Store de jeu et composant lobby (2 pts)

Créer un **store de jeu** et un **composant de lobby** pour gérer le matchmaking en temps réel via Socket.io.

### Store de jeu — Partie lobby

**État :** `socket`, `socketId`, `rooms`, `roomId`, `gameState`, `message`, `error`

**Actions :**

- `connect(token)` : initialise Socket.io avec `{ auth: { token } }` et enregistre les event listeners
- `disconnect()` : ferme la connexion
- `getRooms()` : émet `getRooms`
- `createRoom(deckId)` : émet `createRoom`
- `joinRoom(roomId, deckId)` : émet `joinRoom`

**Event listeners à enregistrer :**

- `roomsList` → mettre à jour `rooms`
- `roomsListUpdated` → rappeler `getRooms()`
- `roomCreated` → mettre à jour `roomId`
- `gameStarted` → stocker l'état et naviguer vers `/game`
- `error` → mettre à jour `error`

### Composant de lobby

- Se connecter dans `onMounted` avec le token du store auth
- Panneau gauche : sélecteur de deck + bouton "Créer une partie"
- Panneau droit : liste des rooms avec sélecteur de deck + bouton "Rejoindre"
- Intégrer ce composant sur la page d'accueil aux côtés de la liste des decks

### Conseils

- `io(import.meta.env.VITE_SOCKET_URL, { auth: { token } })`
- `NSelect` de Naive UI pour les sélecteurs de deck

---

## Ticket 3.2 — Complétion du store de jeu (1 pt)

Compléter le store de jeu avec les **computed** et les **actions** nécessaires pendant une partie.

### Computed à ajouter

- `isMyTurn` : `true` si `socketId === gameState.currentPlayerSocketId`
- `myRole` : `'host'` ou `'guest'` selon le slot du joueur
- `myBoard` / `opponentBoard` : les `PlayerBoard` de chaque joueur

### Actions de jeu à ajouter

| Action                        | Événement émis |
| ----------------------------- | -------------- |
| `drawCards(roomId)`           | `drawCards`    |
| `playCard(roomId, cardIndex)` | `playCard`     |
| `attack(roomId)`              | `attack`       |
| `endTurn(roomId)`             | `endTurn`      |

### Event listeners supplémentaires

- `gameStateUpdated` → mettre à jour `gameState`
- `gameEnded` → stocker le résultat dans `gameOver`
- `opponentDisconnected` → stocker un message

### Conseils

- Ajoutez aussi `resetGame()` pour remettre le store à zéro au retour au lobby
- Les types du jeu (`GameCard`, `PlayerBoard`, `GameState`, etc.) sont à définir dans `src/types/`

---

## Ticket 3.3 — Page de jeu et composant de zone (2 pts)

Créer la **page de jeu** et le **composant de zone de jeu** pour afficher l'interface principale.

### Page de jeu

Orchestre le layout en trois zones verticales :

1. Zone adversaire
2. Barre d'actions
3. Zone joueur (avec la main à l'intérieur via un slot)

Les données viennent des computed `myBoard` et `opponentBoard` du store.

### Composant de zone de jeu

**Props :** `role` ('my' | 'opponent'), `label`

- Affiche le **score** du joueur (0 à 3 KOs)
- Affiche la **carte active** avec ses HP courants (réutilisez le composant de carte avec `currentHp`)
- Slot pour insérer la main du joueur en mode `my`
- Placeholder si aucune carte active

### Conseils

- La carte active est un `GameCard` — elle peut être `null` si aucune carte n'est jouée

---

## Ticket 3.4 — Composants de jeu — main, barre d'actions et modal (2 pts)

Créer les trois composants d'interaction du jeu.

### Composant de main du joueur

- Grille des cartes en main (max 5)
- Compteur des cartes restantes dans le deck
- Clic sur une carte jouable → appelle `playCard` du store
- Jouable uniquement si `isMyTurn && !myBoard.activeCard`

### Composant de barre d'actions

- **Indicateur de tour** : "Votre tour" (vert) / "Tour de l'adversaire" (orange) — `NTag`
- **Bouton Piocher** : désactivé si main ≥ 5 ou deck vide
- **Bouton Attaquer** : désactivé si l'un des joueurs n'a pas de carte active
- **Bouton Fin de tour** : toujours actif pendant son tour
- **Zone de message** : affiche `gameStore.message`
- Tous les boutons désactivés si `!isMyTurn`

### Modal de fin de partie

- Visible automatiquement quand `gameStore.gameOver` est défini
- Message de victoire ou de défaite
- Bouton retour au lobby → appelle `resetGame()` et navigue vers `/`

### Conseils

- `NModal` de Naive UI pour la modal
- `NTag` avec `type="success"` ou `type="warning"` pour l'indicateur de tour
- Pour victoire/défaite : comparez `gameOver.winner` avec `socketId`

---

## Exigences

- [ ] Connexion Socket.io avec token JWT
- [ ] `getRooms()` dans `onMounted`, liste mise à jour en temps réel
- [ ] `createRoom` et `joinRoom` fonctionnels
- [ ] Redirection vers `/game` à la réception de `gameStarted`
- [ ] Composant lobby intégré sur la page d'accueil
- [ ] `isMyTurn`, `myRole`, `myBoard`, `opponentBoard` correctement calculés
- [ ] Les 4 actions émettent les bons événements Socket.io
- [ ] `gameState` mis à jour à chaque `gameStateUpdated`
- [ ] `gameOver` renseigné à la réception de `gameEnded`
- [ ] `resetGame()` remet le store à zéro
- [ ] Page de jeu affiche les trois zones dans le bon ordre
- [ ] Composant de zone : score, carte active avec barre de HP, placeholder, slot fonctionnel
- [ ] Main : cartes jouables, compteur de deck, `playCard` au clic
- [ ] Barre d'actions : indicateur de tour, boutons avec bons états désactivés, message temps réel
- [ ] Modal fin de partie : message victoire/défaite, retour au lobby fonctionnel

---

# 4. Barre de recherche dans le formulaire de deck (1 pt)

## Objectif

Ajouter un **champ de recherche** au-dessus de la grille de cartes dans le formulaire de création et d'édition de deck.

## Fonctionnement attendu

- Filtrer les cartes affichées en temps réel selon le texte saisi (par nom)
- Les cartes déjà sélectionnées restent dans `selectedIds` même si elles sont filtrées hors de la vue

## Conseils

- Un computed qui filtre le tableau de cartes selon un `ref` texte suffit — pas d'appel API supplémentaire
- Pensez au cas où une carte sélectionnée disparaît du filtre : elle doit rester sélectionnée

## Exigences

- [ ] Champ de recherche visible au-dessus de la grille
- [ ] La grille se met à jour en temps réel à chaque frappe
- [ ] Les cartes déjà sélectionnées restent sélectionnées même quand filtrées

---

# 5. Responsive design (3 pts)

## Objectif

Rendre l'application utilisable sur **mobile, tablette et desktop**. Cette partie est transversale — elle touche plusieurs vues et composants déjà implémentés.

## Points clés à rendre responsive

- **Page d'accueil** : lobby et liste des decks empilés sur mobile, côte à côte sur desktop
- **Grille de cartes** : nombre de colonnes adapté à la largeur (moins de colonnes sur mobile)
- **Liste des decks** : passage d'une à plusieurs colonnes selon la taille
- **Formulaires** : largeur maximale raisonnable sur grand écran, pleine largeur sur mobile
- **Page de jeu** : zones lisibles sur mobile

## Conseils

- Naive UI expose un système de breakpoints (`xs`, `s`, `m`, `l`, `xl`) sur `NGrid` via les props `x-xs`, `x-s`, etc.
- `NSpace` et `NFlex` peuvent gérer la direction (`vertical` sur mobile)
- Évitez le CSS custom autant que possible

## Exigences

- [ ] Page d'accueil lisible et fonctionnelle sur mobile
- [ ] Grille de cartes adaptive
- [ ] Liste des decks adaptive
- [ ] Formulaires lisibles sur toutes tailles
- [ ] Page de jeu utilisable sur mobile

---

# 6. Aperçu des cartes dans la liste des decks (1 pt)

## Objectif

Enrichir le composant de liste des decks pour afficher un **aperçu visuel des cartes** de chaque deck.

## Fonctionnement attendu

- Chaque deck affiche les miniatures de ses 10 cartes
- La jointure entre les `DeckCard` et les `Card` est faite côté front

## Conseils

- L'API retourne les decks avec des `DeckCard` (`cardId`) — chargez `getCards()` une seule fois et faites la jointure en mémoire
- Chargez cartes et decks en parallèle avec `Promise.all` pour éviter des appels séquentiels
- Réutilisez le composant de carte en taille `sm`

## Exigences

- [ ] Miniatures des 10 cartes affichées pour chaque deck
- [ ] Un seul appel `getCards()` pour tous les decks (pas un appel par deck)
- [ ] Affichage lisible en taille `sm`
