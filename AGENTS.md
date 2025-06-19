This project uses Node.js and React with Socket.IO. Follow these best practices when making changes:

- Install dependencies with `npm install` before running or testing the app.
- Use `npm run build` to compile the React frontend via Vite. Do this before committing any frontend changes to ensure the build works.
- Keep generated files like `node_modules` and Vite build output out of commits.
- When adding features, update relevant documentation under `docs/` and any tasks in `tasks.md`.
- Commit messages should briefly describe the change in present tense.
- Use ESLint or similar tools if configured, and ensure `npm test` passes when available.
