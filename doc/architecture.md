# NodeTetrinet Architecture Overview

Cette documentation décrit le fonctionnement côté serveur (Express/Socket.IO) et côté client (AngularJS) pour faciliter la rétro‑ingénierie du projet.

## Serveur : `src/app.js`

### Middleware Express
- Configuration du serveur sur le port 3000 par défaut avec les vues EJS. Les middlewares principaux incluent favicon, compression, logger `dev`, cookie/session et `less-middleware` avant les fichiers statiques (`src/public`).
- En développement, `express.errorHandler()` est ajouté.

### Namespaces Socket.IO
- **`/chat`** : gère la discussion textuelle par salle.
- **`/game`** : synchronise les parties Tetris (états de grille, événements de jeu, attribution du propriétaire de la salle).
- **`/discover`** : diffuse la liste des parties ouvertes pour la page d’accueil.

### Modèle de salle
- Les salles Socket.IO sont indexées par nom (`roomName`).
- `availableRooms` maintient la liste des parties joignables avec l’attribut `owner`.
- `getRoom(roomName)` retourne l’objet de salle du namespace `/game` (et crée `people` si nécessaire).
- `getOpenRoomList()` parcourt `availableRooms` pour exposer `[{ name, owner }]`.
- `updatePeopleInRoom(room)` pousse la liste `people` aux clients `/chat` de la salle.
- `updatePeopleOnDiscover()` notifie le namespace `/discover` avec la liste des salles ouvertes.

### Flux d’événements `/chat`
1. **`join`** : le client rejoint `roomName`, reçoit un message de bienvenue et la liste des participants est rafraîchie.
2. **`say`** : message texte broadcasté à la salle via `say { author, text, at }`.

### Flux d’événements `/game`
1. **`join`** : le socket rejoint `roomName`, enregistre `nickname` dans `people` et attribue `owner` si premier joueur. Le chat reçoit « has join the game » et la liste des participants est mise à jour. Si propriétaire, l’événement `owner` est émis au socket.
2. **`start`** : broadcast `start` à la salle, retire la partie de `availableRooms` et met à jour `/discover`.
3. **`updateGameField`** : l’état de grille du joueur (`zone`) est envoyé aux autres via `updateGameField { nickname, zone }`.
4. **`line`** : ajoute des lignes aux adversaires via `addLines` (moins 1 ligne si <4 envoyées).
5. **`gameover`** : relayé aux autres joueurs avec `opponentGameOver { nickname }`.
6. **`win`** : annonce côté chat avec `say` et `win`.
7. **Déconnexion / leave** : mise à jour de `people`, transfert éventuel du rôle `owner` au premier socket restant. Si salle vide, suppression d’`availableRooms`.

**Diffusion ciblée** : `sendToAllButYou` parcourt les clients du namespace et émet un événement à tous sauf l’émetteur (utilisé pour `updateGameField`, `gameover`, `line`).

### Flux d’événements `/discover`
- **`ask`** : le client demande la liste des parties ; le serveur répond par `room` avec `getOpenRoomList()`.

## Front-end AngularJS

### Initialisation (`src/public/js/app.js`)
- Module `tetris` avec routage : `/` (index) et `/game/:id` (partie).
- À l’exécution, génération d’un `nickname` dans les cookies si absent et enregistrement sur `$rootScope`.
- Gestion du focus chat/jeu : la touche Tab bascule le mode (`$rootScope.mode`), (dés)active le champ chat et renvoie le focus sur la zone de jeu.
- Écoute clavier quand le mode est `game` : flèches, espace déclenchent `$rootScope.$broadcast('gameEvent', <enum>)`.

### Contrôleur de jeu (`GameCtrl` dans `src/public/js/controllers.js`)
- Connexion au namespace `/game` puis `join { roomName, nickname }`.
- **Démarrage** : sur `start`, état `gameState="on"`, demande d’un nouveau bloc (`askNewBlock`), et boucle de chute via `sendDropTick`/`$timeout`.
- **Synchronisation de grilles** :
  - `sendGameField()` émet `updateGameField` avec `hiddenZone`.
  - Réception `updateGameField` met à jour `gameFields[nickname].zone` via `applyZoneWithVal` pour afficher les adversaires.
- **État des adversaires** : `opponentGameOver` marque un joueur `gameover`; si tous sont arrêtés, déclenche `youwin` → `win` envoyé au serveur.
- **Rôle propriétaire** : réception `owner` marque `$scope.owner=1`; `launchGame()` pour un propriétaire émet `start`.
- **Boucle de jeu** : gestion des blocs, collisions, lignes complètes, « garbage lines » (`addLines` reçu de `line`), logique de fantôme (`BlockType.GHOST`), mise à jour du rendu via `$scope.refresh()`.
- **Événements clavier** : le listener `gameEvent` ajuste la position/rotation du bloc courant, déclenche le drop instantané (`DROP`) ou une étape (`DOWN`), applique un `wallKick` si collision.
- **Nettoyage** : sur `$destroy`, envoie `leave`, annule les timeouts, désinscrit les listeners Socket.IO et Angular.

### Contrôleur de chat (`ChatCtrl`)
- Connexion au namespace `/chat`, `join { roomName, nickname }`.
- Réception `say` met à jour l’historique (15 derniers messages). `people` reçoit la liste des pseudos via l’événement homonyme.
- `say()` émet les messages utilisateur.

### Découverte des parties (`IndexCtrl`)
- Connexion au namespace `/discover`.
- Sur `room`, met à jour `$scope.rooms` et indique la connexion. `startNewGame()` redirige vers `/game/<random>`.
- Gestion du pseudo via cookies et `changeNickname()`.

## Séquences d’échanges typiques

### Découverte → Connexion → Lancement
1. **IndexCtrl** envoie `ask` sur `/discover` → reçoit `room` avec les parties ouvertes.
2. Le joueur clique sur une partie ou crée une nouvelle salle (`startNewGame`), navigue vers `/game/:id`.
3. **GameCtrl** et **ChatCtrl** émettent `join { roomName, nickname }` sur leurs namespaces respectifs.
4. Si premier joueur, le serveur marque `owner` et répond l’événement du même nom.
5. Le propriétaire déclenche `start` → les clients commencent leur boucle de jeu et synchronisent leur grille via `updateGameField`.

### Synchronisation de l’état de jeu
1. Chaque tick ou action majeure, le client émet `updateGameField` avec `hiddenZone` (grille). Le serveur relaye aux autres via `sendToAllButYou`.
2. Les adversaires appliquent la grille reçue à `gameFields[nickname]` pour l’affichage.
3. Lorsqu’un joueur termine (`gameover`), le serveur envoie `opponentGameOver` aux autres ; ceux‑ci marquent l’adversaire KO.
4. `line` déclenche l’ajout de lignes (`addLines`) chez les autres, ajusté selon le nombre envoyé (<4 → -1 ligne).

### Fin de partie / départ
- Sur déconnexion ou événement `win`, le serveur annonce dans le chat et met à jour `people`. Si le propriétaire part, `requestNewOwner()` attribue l’événement `owner` au prochain socket du namespace.

## Schéma textuel des messages

```
Client (IndexCtrl) --ask--> /discover
/discover --room[{name,owner}]--> Client

Client (GameCtrl) --join{roomName,nickname}--> /game
/game --owner?--> Client (si premier)

Client (ChatCtrl) --join{roomName,nickname}--> /chat
/chat --say{server:"has join"}--> room
/chat --people[list]--> room

Propriétaire --start--> /game --start--> room
Chaque joueur --updateGameField{nickname,zone}--> /game --updateGameField--> autres
Joueur --line{n}--> /game --addLines{n|n-1}--> autres
Joueur --gameover--> /game --opponentGameOver{nickname}--> autres
Joueur (gagnant) --win--> /chat --say{winner} & win--> room
Déconnexion/leave → mise à jour people, owner, availableRooms
```

Ces éléments devraient fournir une base claire pour analyser ou instrumenter davantage l’application.
