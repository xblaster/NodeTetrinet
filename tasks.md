# React Migration Tasks

This document outlines the steps required to fully migrate the existing AngularJS frontend to React. Each section lists the files involved and the main tasks.

## 1. Project setup
- [x] Add a build system (e.g. Webpack or Vite) to bundle React code from `src/public/js/react`.
- [x] Remove AngularJS libraries from `package.json` and update dependencies for React.
- [x] Update `npm start` or other scripts to build and serve the React bundle.

## 2. Replace Angular routing
- [x] File to replace: `src/public/js/app.js`
- [x] Create a new React entry point `src/public/js/react/index.jsx` using React Router for `/` and `/game/:id`.
- [x] Delete the Angular `$routeProvider` configuration once the React router works.

## 3. Convert controllers to components
- [x] Source file: `src/public/js/controllers.js`
- [x] Split this file into React components and hooks:
  - **Lobby** component for the home page (replaces `IndexCtrl`).
  - **GamePage** component containing the Tetris board logic (replaces `GameCtrl`).
  - **Chat** component for in‑game chat (replaces `ChatCtrl`).
- [x] Port helper functions for block movement and game state into React modules.

## 4. Migrate Angular templates
- [x] Convert the following templates to JSX and include them in the new components:
  - [x] `src/public/partials/index.html`
  - [x] `src/public/partials/game.html`
  - [x] `src/public/partials/chat.html`
- [x] Remove the `<div ng-controller>` and other Angular directives while keeping the markup and styling.

## 5. Refactor services
- [x] File: `src/public/js/services.js`
- [x] Any Angular services should become React context providers or simple modules.

## 6. Clean up legacy scripts
- [x] Remove AngularJS libraries from `src/public/js/lib/` once no component requires them.
- [x] Delete unused files such as `src/public/js/app.js`, `src/public/js/controllers.js` and old partials after the React versions are in place.

## 7. Update server views
- [x] File: `src/views/index.ejs`
- [x] Ensure the page only loads the compiled React bundle and no longer references Angular scripts.
- [x] Add a `<div id="root"></div>` element if not already present for React to mount.

## 8. Testing
- [x] Verify the lobby, game and chat behave the same as the original Angular version.
- [x] Adjust server‑side Socket.IO events if needed to support the React implementation.

