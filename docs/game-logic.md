# Game Logic with React

This document explains how the ongoing React migration is implemented and how the lobby works.

## Overview

Node Tetrinet runs on an Express server with Socket.IO providing realtime communication. The original AngularJS interface is being replaced with React components. The current React setup now includes components for the lobby, game page and chat.

## Lobby Component

`src/public/js/react/Lobby.jsx` defines the lobby component rendered at page load. It stores the nickname in `localStorage` and connects to the `/discover` namespace via Socket.IO to receive the list of open rooms. The UI allows players to:

- Edit their nickname (click the nickname to switch to edit mode).
- Start a new game, which redirects to `/game/<random>`.
- See existing rooms and join them.

React hooks manage component state (`useState` for nickname, mode and room list, and `useEffect` for side effects). The lobby renders into the `<div id="root">` element defined in `src/views/index.ejs`.

## Server Interaction

On the server side, `src/app.js` exposes several Socket.IO namespaces:

- `/discover` lists open rooms and notifies clients when rooms change.
- `/chat` handles chat messages inside a game.
- `/game` manages the multiplayer game itself.

The lobby listens for `room` events from `/discover` and emits `ask` when it connects to request the current room list. Starting or joining a game navigates to the `/game/:id` route handled by the new `GamePage` component.

## Migration Notes

The AngularJS controllers have been split into React components. `GamePage.jsx` manages the Tetris board while `Chat.jsx` implements in-game chat. Helper functions for block movement are exported from `tetris.js`.

## Services

Legacy Angular services are replaced with React hooks. The file
`src/public/js/react/useGameZone.js` exposes a `useGameZone` hook that
encapsulates the Socket.IO connection for the game board. Components call the
`sendGameEvent` helper returned by this hook to emit keyboard events to the
server while reading the current `zone` state from it.

