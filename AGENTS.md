# AGENTS.md — Developer Guide for Dungeon Crawler

This file provides guidelines and reference information for agents working on this codebase.

---

## 1. Project Overview

A browser-based, turn-based, procedurally generated dungeon crawler with an ASCII/text grid renderer.

| Layer              | Technology          |
|--------------------|---------------------|
| Frontend framework | React 19            |
| Build tooling      | Vite + Bun          |
| Language           | TypeScript          |
| Backend runtime    | Bun                 |
| Backend framework  | Hono                |
| Database           | SQLite              |
| ORM                | Drizzle             |

---

## 2. Build / Lint / Test Commands

### Root Commands (monorepo)
```bash
bun run dev     # Run both client and server concurrently
bun run build  # Build client only
```

### Client Commands
```bash
cd client

bun run dev      # Start Vite dev server (port 5173)
bun run build    # TypeScript compile + Vite build
bun run lint     # Run ESLint on all .ts/.tsx files
bun run preview # Preview production build
```

### Running a Single Test
Currently, **no test framework is configured** in this project. To add tests:
- Install `vitest` or `bun:test` for unit tests
- Add test scripts to `client/package.json`

Example (if vitest is added):
```bash
bun run test                    # Run all tests
bun run test --run src/game/map # Run specific file
bun run test --watch            # Watch mode
```

### Server Commands
```bash
cd server

bun run dev          # Run with file watching (bun --watch)
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run pending migrations
```

---

## 3. Code Style Guidelines

### General Principles
- **Game logic is pure TypeScript** — no React, no DOM inside `game/`. The engine is a plain state machine.
- **React is the view layer only** — hooks read game state and dispatch actions; components render output.
- **Turn-based** — nothing moves until the player acts.
- **Permadeath** — no save/load of in-progress runs. Only completed runs are persisted.

### File Organization
```
client/
├── src/
│   ├── components/     # React UI components
│   ├── game/          # Core game logic (pure TS, no React)
│   │   ├── map/       # Dungeon generation
│   │   ├── entities/  # Player, enemies, items
│   │   ├── combat/    # Turn-based combat system
│   │   └── engine/    # Game loop, turn manager, state
│   ├── hooks/         # React hooks wrapping game engine
│   └── styles/        # CSS

server/
├── src/
│   ├── routes/        # API route handlers
│   ├── db/            # Drizzle schema + migrations
│   └── index.ts       # Hono app entry point
```

### TypeScript Conventions
- Use explicit types for function parameters and return values
- Enable strict mode in tsconfig
- Use interfaces for objects, types for unions/primitives

### Naming Conventions
| Element            | Convention      | Example                |
|--------------------|-----------------|------------------------|
| Variables          | camelCase       | `playerName`, `score` |
| Functions          | camelCase       | `getPlayerPosition()` |
| Components         | PascalCase      | `GameCanvas`, `HUD`   |
| Types/Interfaces   | PascalCase      | `Player`, `Enemy`     |
| Constants          | UPPER_SNAKE     | `MAX_FLOORS`, `TILE`  |
| Database columns   | snake_case      | `player_name`, `floors_reached` |

### Import Style
- Use **named imports** for clarity:
  ```typescript
  import { Hono } from 'hono';
  import { cors } from 'hono/cors';
  import { runsRoutes } from './routes/runs';
  ```
- Use relative paths for local imports
- Group imports: external → internal → types

### Formatting
- Use 2 spaces for indentation
- No trailing commas
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters

### React Patterns
- Functional components with arrow functions or `function` keyword
- Use React 19 features (no legacy class components)
- Use custom hooks to bridge React and game engine
- Event handlers defined inline or as separate functions

### Error Handling
- Use Hono's built-in error handling with proper HTTP status codes
- Return appropriate status codes: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 501 (Not Implemented)
- Log errors server-side; return safe messages to client

### Database (Drizzle)
- Schema defined in `server/src/db/schema.ts`
- Migrations in `server/src/db/migrations/`
- Use snake_case for column names in schema
- Generate migrations: `bun run db:generate`
- Run migrations: `bun run db:migrate`

### Linting
- Client uses ESLint flat config (`eslint.config.js`)
- Extends: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Run linting before committing:
  ```bash
  cd client && bun run lint
  ```

---

## 4. API Endpoints

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | /api/health        | Health check             |
| GET    | /api/leaderboard   | Top 10 runs by score    |
| POST   | /api/runs          | Save a completed run     |

---

## 5. Development Workflow

1. Start dev servers: `bun run dev` (runs both client :5173 and server :3001)
2. Make changes in appropriate directory (`client/` or `server/`)
3. Run lint: `cd client && bun run lint`
4. Verify TypeScript: `cd client && npx tsc --noEmit` (or check build output)

---

## 6. Key Files

| File                          | Purpose                              |
|-------------------------------|--------------------------------------|
| client/src/App.tsx            | Main React component                |
| client/src/main.tsx          | React entry point                   |
| client/vite.config.ts        | Vite configuration                  |
| client/eslint.config.js      | ESLint configuration                 |
| server/src/index.ts          | Hono server entry point             |
| server/src/db/schema.ts      | Drizzle schema                       |
| server/src/routes/runs.ts    | POST /api/runs handler              |
| server/src/routes/leaderboard.ts | GET /api/leaderboard handler    |
| server/drizzle.config.ts     | Drizzle configuration               |

---

## 7. Future Considerations

When adding tests:
- Use `vitest` for the client (compatible with Vite)
- Use `bun:test` for server-side tests
- Follow the existing file organization: `__tests__/` or `*.test.ts` suffix
- Keep game logic testable without React

When adding new features:
- Follow the core design rules in PROJECT_PLAN.md
- Keep game logic pure TypeScript
- Use the existing naming and formatting conventions
